import { db, getSetting, setSetting } from './db';
import { createEmptyCard, fsrs, Rating, type Card, type Grade } from 'ts-fsrs';
import { DEFAULT_EXAM_DATE, WEEKS, defaultSolo, tasksFor } from '$lib/data/plan';
import { DOMAINS, domainOf } from '$lib/data/topics';
import { addDays, ymd } from '$lib/dates';

type Row = Record<string, any>;
const all = (sql: string, ...p: any[]) => db.prepare(sql).all(...p) as Row[];
const one = (sql: string, ...p: any[]) => db.prepare(sql).get(...p) as Row | undefined;
const run = (sql: string, ...p: any[]) => db.prepare(sql).run(...p);

/* ---------- réglages & planning ---------- */
export function getPlanState() {
	const examDate = getSetting('examDate', DEFAULT_EXAM_DATE);
	const soloStartsOdd = getSetting('soloStartsOdd', '0') === '1';
	const solo: Record<number, boolean> = {};
	for (const r of all('SELECT week, solo FROM week_solo')) solo[r.week] = !!r.solo;
	const done: Record<string, string> = {};
	for (const r of all('SELECT week, idx, done_at FROM task_done')) done[`${r.week}:${r.idx}`] = r.done_at;
	const isSolo = (i: number) => (solo[i] !== undefined ? solo[i] : defaultSolo(i, soloStartsOdd));
	const weekPct = (i: number) => {
		const list = tasksFor(i, isSolo(i));
		const n = list.filter((_, k) => done[`${i}:${k}`]).length;
		return list.length ? Math.round((100 * n) / list.length) : 0;
	};
	return { examDate, soloStartsOdd, solo, done, isSolo, weekPct };
}

export function toggleTask(week: number, idx: number, on: boolean) {
	if (on) run('INSERT OR REPLACE INTO task_done (week, idx, done_at) VALUES (?, ?, ?)', week, idx, new Date().toISOString());
	else run('DELETE FROM task_done WHERE week = ? AND idx = ?', week, idx);
}
export function setSolo(week: number, solo: boolean) {
	run('INSERT INTO week_solo (week, solo) VALUES (?, ?) ON CONFLICT(week) DO UPDATE SET solo = excluded.solo', week, solo ? 1 : 0);
}
export const setExamDate = (d: string) => setSetting('examDate', d);
export const setSoloStartsOdd = (b: boolean) => setSetting('soloStartsOdd', b ? '1' : '0');

/* ---------- thèmes ---------- */
export function getTopics() {
	const map: Record<string, { status: number; note: string }> = {};
	for (const r of all('SELECT code, status, note FROM topic_status')) map[r.code] = { status: r.status, note: r.note };
	return map;
}
export function setTopicStatus(code: string, status: number) {
	run(`INSERT INTO topic_status (code, status, updated_at) VALUES (?, ?, ?)
	     ON CONFLICT(code) DO UPDATE SET status = excluded.status, updated_at = excluded.updated_at`, code, status, new Date().toISOString());
}
export function setTopicNote(code: string, note: string) {
	run(`INSERT INTO topic_status (code, note, updated_at) VALUES (?, ?, ?)
	     ON CONFLICT(code) DO UPDATE SET note = excluded.note, updated_at = excluded.updated_at`, code, note, new Date().toISOString());
}
/** Score pondéré par le poids des domaines (vert = 1, orange = 0,4). */
export function readiness(topics = getTopics()) {
	let total = 0;
	for (const d of DOMAINS) {
		let s = 0;
		for (const [code] of d.topics) {
			const st = topics[code]?.status ?? 0;
			s += st === 2 ? 1 : st === 1 ? 0.4 : 0;
		}
		total += d.weight * (s / d.topics.length);
	}
	return Math.round(total);
}

/* ---------- vidéos ---------- */
export function getVideos() {
	return all('SELECT day, title, youtube_id, watched_at FROM videos ORDER BY day');
}
export function setWatched(day: number, on: boolean) {
	run('UPDATE videos SET watched_at = ? WHERE day = ?', on ? new Date().toISOString() : null, day);
}
export function setVideoId(day: number, id: string | null, title?: string) {
	if (title) run('UPDATE videos SET youtube_id = ?, title = ? WHERE day = ?', id, title, day);
	else run('UPDATE videos SET youtube_id = ? WHERE day = ?', id, day);
}

/* ---------- flashcards (FSRS, fonctionnement façon Anki) ---------- */
export interface FlashSettings { newPerDay: number; retention: number; unlockByVideo: boolean }

export function getFlashSettings(): FlashSettings {
	return {
		newPerDay: Number(getSetting('fc_new_per_day', '15')),
		retention: Number(getSetting('fc_retention', '0.9')),
		unlockByVideo: getSetting('fc_unlock', '1') === '1'
	};
}
export function setFlashSettings(s: FlashSettings) {
	setSetting('fc_new_per_day', String(Math.max(0, Math.min(200, Math.round(s.newPerDay)))));
	setSetting('fc_retention', String(Math.max(0.7, Math.min(0.97, s.retention))));
	setSetting('fc_unlock', s.unlockByVideo ? '1' : '0');
}
const scheduler = () => fsrs({ enable_fuzz: true, request_retention: getFlashSettings().retention });

function loadCard(json: string): Card {
	const c = JSON.parse(json);
	c.due = new Date(c.due);
	if (c.last_review) c.last_review = new Date(c.last_review);
	return c as Card;
}

/** Condition SQL : la carte est "débloquée" (pas liée à un Day, ou vidéo du Day déjà vue). */
function unlockedSql(): string {
	return getFlashSettings().unlockByVideo
		? '(cards.day IS NULL OR cards.day IN (SELECT day FROM videos WHERE watched_at IS NOT NULL))'
		: '1 = 1';
}

/** Début du jour local en ISO (les horodatages sont en UTC). */
const startOfToday = () => new Date(ymd() + 'T00:00:00').toISOString();

/** Nouvelles cartes déjà vues aujourd'hui (première révision aujourd'hui). */
function introducedToday(): number {
	return (one(
		`SELECT COUNT(*) AS n FROM (SELECT card_id, MIN(reviewed_at) AS first FROM reviews GROUP BY card_id) WHERE first >= ?`,
		startOfToday()
	)?.n ?? 0) as number;
}

export function deckStats() {
	const now = new Date().toISOString();
	const unlocked = unlockedSql();
	return all(
		`SELECT deck,
		        COUNT(*) AS total,
		        SUM(CASE WHEN suspended = 0 AND due <= ? AND json_extract(fsrs, '$.state') != 0 THEN 1 ELSE 0 END) AS due,
		        SUM(CASE WHEN suspended = 0 AND json_extract(fsrs, '$.state') = 0 AND ${unlocked} THEN 1 ELSE 0 END) AS new,
		        SUM(CASE WHEN suspended = 0 AND json_extract(fsrs, '$.state') = 0 AND NOT ${unlocked} THEN 1 ELSE 0 END) AS locked
		 FROM cards GROUP BY deck ORDER BY deck`,
		now
	);
}

/** Nouvelles cartes restantes aujourd'hui (limite quotidienne commune à tous les paquets, comme Anki). */
export function newLeftToday(): number {
	return Math.max(0, getFlashSettings().newPerDay - introducedToday());
}

/** File de révision : cartes dues d'abord, puis les nouvelles dans l'ordre du cours (Day 1, 2, 3…). */
export function reviewQueue(deck: string | null, day: number | null = null) {
	const now = new Date().toISOString();
	const filters: string[] = [];
	const args: any[] = [];
	if (deck) { filters.push('deck = ?'); args.push(deck); }
	if (day) { filters.push('day = ?'); args.push(day); }
	const extra = filters.length ? 'AND ' + filters.join(' AND ') : '';
	const due = all(
		`SELECT id, deck, topic, day, front, back, fsrs FROM cards WHERE suspended = 0 AND json_extract(fsrs,'$.state') != 0 AND due <= ? ${extra} ORDER BY due LIMIT 500`,
		now, ...args
	);
	// Révision ciblée d'un Day : toutes ses nouvelles cartes, sans limite quotidienne.
	const limit = day ? 500 : newLeftToday();
	const fresh = all(
		`SELECT id, deck, topic, day, front, back, fsrs FROM cards WHERE suspended = 0 AND json_extract(fsrs,'$.state') = 0 AND ${unlockedSql()} ${extra}
		 ORDER BY COALESCE(day, 999), id LIMIT ?`,
		...args, limit
	);
	return [...due, ...fresh].map((r) => ({ id: r.id, deck: r.deck, topic: r.topic, day: r.day, front: r.front, back: r.back, state: JSON.parse(r.fsrs).state as number }));
}

/** Nombre de cartes par Day (pour la page vidéo) : total, nouvelles, dues. */
export function dayCardCounts(day: number) {
	const now = new Date().toISOString();
	return one(
		`SELECT COUNT(*) AS total,
		        SUM(CASE WHEN json_extract(fsrs,'$.state') = 0 THEN 1 ELSE 0 END) AS new,
		        SUM(CASE WHEN json_extract(fsrs,'$.state') != 0 AND due <= ? THEN 1 ELSE 0 END) AS due
		 FROM cards WHERE day = ? AND suspended = 0`,
		now, day
	) as { total: number; new: number; due: number };
}

/** Intervalles affichés sous les 4 boutons (Again, Hard, Good, Easy). */
export function previewIntervals(cardId: number) {
	const r = one('SELECT fsrs FROM cards WHERE id = ?', cardId);
	if (!r) return null;
	const now = new Date();
	const prev = scheduler().repeat(loadCard(r.fsrs), now);
	const fmt = (d: Date) => {
		const m = Math.round((d.getTime() - now.getTime()) / 60000);
		if (m < 60) return `${Math.max(1, m)} min`;
		if (m < 1440) return `${Math.round(m / 60)} h`;
		const days = Math.round(m / 1440);
		return days < 31 ? `${days} d` : days < 365 ? `${Math.round(days / 30)} mo` : `${(days / 365).toFixed(1)} y`;
	};
	return {
		1: fmt(prev[Rating.Again].card.due),
		2: fmt(prev[Rating.Hard].card.due),
		3: fmt(prev[Rating.Good].card.due),
		4: fmt(prev[Rating.Easy].card.due)
	};
}

export function reviewCard(cardId: number, rating: Grade, ms: number) {
	const r = one('SELECT fsrs, due FROM cards WHERE id = ?', cardId);
	if (!r) return;
	const now = new Date();
	const { card } = scheduler().next(loadCard(r.fsrs), now, rating);
	run('UPDATE cards SET fsrs = ?, due = ? WHERE id = ?', JSON.stringify(card), card.due.toISOString(), cardId);
	run('INSERT INTO reviews (card_id, rating, reviewed_at, ms, prev) VALUES (?, ?, ?, ?, ?)', cardId, rating, now.toISOString(), Math.min(ms, 600000), JSON.stringify({ fsrs: r.fsrs, due: r.due }));
}

/** Annule la dernière révision (Ctrl+Z, comme dans Anki). Renvoie l'id de la carte rétablie. */
export function undoLastReview(): number | null {
	const r = one('SELECT id, card_id, prev FROM reviews ORDER BY id DESC LIMIT 1');
	if (!r || !r.prev) return null;
	const prev = JSON.parse(r.prev);
	run('UPDATE cards SET fsrs = ?, due = ? WHERE id = ?', prev.fsrs, prev.due, r.card_id);
	run('DELETE FROM reviews WHERE id = ?', r.id);
	return r.card_id;
}

export function getCardForReview(id: number) {
	const r = one('SELECT id, deck, topic, day, front, back, fsrs FROM cards WHERE id = ?', id);
	return r ? { id: r.id, deck: r.deck, topic: r.topic, day: r.day, front: r.front, back: r.back, state: JSON.parse(r.fsrs).state as number } : null;
}

/** Cartes dues par jour sur les `days` prochains jours (prévision, comme les stats d'Anki). */
export function forecast(days = 30) {
	const out: { d: string; n: number }[] = [];
	const today = new Date();
	const rows = all(`SELECT due FROM cards WHERE suspended = 0 AND json_extract(fsrs,'$.state') != 0`);
	const counts = new Map<string, number>();
	const todayKey = ymd(today);
	for (const r of rows) {
		let k = ymd(new Date(r.due));
		if (k < todayKey) k = todayKey; // en retard = à faire aujourd'hui
		counts.set(k, (counts.get(k) ?? 0) + 1);
	}
	for (let i = 0; i < days; i++) {
		const k = ymd(addDays(today, i));
		out.push({ d: k, n: counts.get(k) ?? 0 });
	}
	return out;
}

export function listCards(deck: string | null) {
	return all(
		`SELECT id, deck, topic, day, front, back, due, suspended, json_extract(fsrs,'$.state') AS state, json_extract(fsrs,'$.reps') AS reps, json_extract(fsrs,'$.lapses') AS lapses FROM cards ${deck ? 'WHERE deck = ?' : ''} ORDER BY deck, COALESCE(day, 999), id`,
		...(deck ? [deck] : [])
	);
}
export function addCard(deck: string, topic: string | null, front: string, back: string, day: number | null = null) {
	const now = new Date();
	run('INSERT INTO cards (deck, topic, day, front, back, fsrs, due, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', deck, topic, day, front, back, JSON.stringify(createEmptyCard(now)), now.toISOString(), now.toISOString());
}
export function updateCard(id: number, front: string, back: string, topic: string | null, deck: string) {
	run('UPDATE cards SET front = ?, back = ?, topic = ?, deck = ? WHERE id = ?', front, back, topic, deck, id);
}
export function deleteCard(id: number) {
	run('DELETE FROM cards WHERE id = ?', id);
}
export function setSuspended(id: number, on: boolean) {
	run('UPDATE cards SET suspended = ? WHERE id = ?', on ? 1 : 0, id);
}
/** Remet une carte à zéro (redevient nouvelle). */
export function resetCard(id: number) {
	const now = new Date();
	run('UPDATE cards SET fsrs = ?, due = ? WHERE id = ?', JSON.stringify(createEmptyCard(now)), now.toISOString(), id);
}

/* ---------- QCM ---------- */
export interface QuestionOut { id: number; topic: string; stem: string; options: string[]; answer: number[]; explanation: string }
const toQ = (r: Row): QuestionOut => ({ id: r.id, topic: r.topic, stem: r.stem, options: JSON.parse(r.options), answer: JSON.parse(r.answer), explanation: r.explanation });

export function questionCounts() {
	const counts: Record<string, number> = {};
	for (const r of all('SELECT topic FROM questions')) {
		const d = domainOf(r.topic);
		counts[d] = (counts[d] || 0) + 1;
	}
	return counts;
}

/** Tire des questions : "weak" privilégie celles ratées ou jamais vues. */
export function pickQuestions(domain: string | null, count: number, mode: 'random' | 'weak') {
	const rows = all('SELECT * FROM questions');
	const stats = new Map<number, { seen: number; wrong: number }>();
	for (const r of all('SELECT question_id, COUNT(*) AS seen, SUM(1 - correct) AS wrong FROM quiz_answers GROUP BY question_id'))
		stats.set(r.question_id, { seen: r.seen, wrong: r.wrong });
	let pool = rows.filter((r) => !domain || domainOf(r.topic) === domain);
	const score = (r: Row) => {
		const s = stats.get(r.id);
		const base = mode === 'weak' ? (s ? s.wrong / s.seen + (s.seen < 2 ? 0.5 : 0) : 1) : 0;
		return base + Math.random();
	};
	pool = pool.map((r) => ({ r, k: score(r) })).sort((a, b) => b.k - a.k).map((x) => x.r);
	return pool.slice(0, count).map(toQ);
}

export function getQuestions(ids: number[]) {
	if (!ids.length) return [];
	const rows = all(`SELECT * FROM questions WHERE id IN (${ids.map(() => '?').join(',')})`, ...ids);
	const byId = new Map(rows.map((r) => [r.id, toQ(r)]));
	return ids.map((i) => byId.get(i)).filter(Boolean) as QuestionOut[];
}

export function startAttempt(mode: string, filter: string, total: number) {
	const r = run('INSERT INTO quiz_attempts (mode, filter, started_at, total) VALUES (?, ?, ?, ?)', mode, filter, new Date().toISOString(), total);
	return Number(r.lastInsertRowid);
}
export function answerQuestion(attemptId: number, questionId: number, chosen: number[]) {
	const q = one('SELECT answer FROM questions WHERE id = ?', questionId);
	if (!q) return null;
	const ans: number[] = JSON.parse(q.answer);
	const ok = ans.length === chosen.length && ans.every((a) => chosen.includes(a));
	run('INSERT OR REPLACE INTO quiz_answers (attempt_id, question_id, chosen, correct, answered_at) VALUES (?, ?, ?, ?, ?)', attemptId, questionId, JSON.stringify(chosen), ok ? 1 : 0, new Date().toISOString());
	return { correct: ok, answer: ans };
}
export function finishAttempt(attemptId: number) {
	const a = one('SELECT started_at FROM quiz_attempts WHERE id = ?', attemptId);
	if (!a) return null;
	const c = one('SELECT COUNT(*) AS n, SUM(correct) AS ok FROM quiz_answers WHERE attempt_id = ?', attemptId)!;
	const dur = Math.round((Date.now() - new Date(a.started_at).getTime()) / 1000);
	run('UPDATE quiz_attempts SET finished_at = ?, correct = ?, duration_s = ? WHERE id = ?', new Date().toISOString(), c.ok ?? 0, dur, attemptId);
	return { answered: c.n, correct: c.ok ?? 0, duration: dur };
}
export function recentAttempts(limit = 10) {
	return all('SELECT * FROM quiz_attempts WHERE finished_at IS NOT NULL ORDER BY id DESC LIMIT ?', limit);
}
export function addQuestion(topic: string, stem: string, options: string[], answer: number[], explanation: string) {
	run('INSERT INTO questions (topic, stem, options, answer, explanation, created_at) VALUES (?, ?, ?, ?, ?, ?)', topic, stem, JSON.stringify(options), JSON.stringify(answer), explanation, new Date().toISOString());
}

/* ---------- mini-QCM des leçons vidéo ---------- */
export function saveLessonQuiz(day: number, correct: number, total: number) {
	run('INSERT INTO lesson_quiz (day, correct, total, at) VALUES (?, ?, ?, ?)', day, correct, total, new Date().toISOString());
}
/** Meilleur score par Day. */
export function lessonScores(): Record<number, { best: number; total: number; tries: number }> {
	const out: Record<number, { best: number; total: number; tries: number }> = {};
	for (const r of all('SELECT day, MAX(correct) AS best, MAX(total) AS total, COUNT(*) AS tries FROM lesson_quiz GROUP BY day'))
		out[r.day] = { best: r.best, total: r.total, tries: r.tries };
	return out;
}

/* ---------- examens blancs, sessions, subnetting ---------- */
export const listMocks = () => all('SELECT * FROM mock_exams ORDER BY date');
export const addMock = (date: string, source: string, score: number) => run('INSERT INTO mock_exams (date, source, score) VALUES (?, ?, ?)', date, source, score);
export const deleteMock = (id: number) => run('DELETE FROM mock_exams WHERE id = ?', id);

export const addSession = (date: string, minutes: number, activity: string, note: string) =>
	run('INSERT INTO study_sessions (date, minutes, activity, note) VALUES (?, ?, ?, ?)', date, minutes, activity, note);
export const deleteSession = (id: number) => run('DELETE FROM study_sessions WHERE id = ?', id);
export const recentSessions = (limit = 8) => all('SELECT * FROM study_sessions ORDER BY date DESC, id DESC LIMIT ?', limit);

export const logSubnet = (correct: boolean, ms: number) => run('INSERT INTO subnet_drills (at, correct, ms) VALUES (?, ?, ?)', new Date().toISOString(), correct ? 1 : 0, ms);
export function subnetStats() {
	const today = ymd();
	return {
		all: one('SELECT COUNT(*) AS n, SUM(correct) AS ok, AVG(CASE WHEN correct = 1 THEN ms END) AS avg FROM subnet_drills') as Row,
		today: one("SELECT COUNT(*) AS n, SUM(correct) AS ok FROM subnet_drills WHERE substr(at,1,10) = ?", today) as Row
	};
}

/* ---------- activité par jour (calendrier, heatmap, série) ---------- */
export interface DayActivity { cards: number; questions: number; qok: number; minutes: number; drills: number; videos: number }

/** Les horodatages ISO sont en UTC : on les ramène en jour local avant de grouper. */
function byLocalDay(rows: Row[], field: string, acc: Map<string, DayActivity>, key: keyof DayActivity, valueField?: string) {
	for (const r of rows) {
		const day = ymd(new Date(r[field]));
		const a = acc.get(day) ?? { cards: 0, questions: 0, qok: 0, minutes: 0, drills: 0, videos: 0 };
		a[key] += valueField ? Number(r[valueField]) || 0 : 1;
		acc.set(day, a);
	}
}

export function activity(fromYmd: string, toYmd: string): Map<string, DayActivity> {
	const from = new Date(fromYmd + 'T00:00:00').toISOString();
	const to = new Date(toYmd + 'T23:59:59').toISOString();
	const acc = new Map<string, DayActivity>();
	byLocalDay(all('SELECT reviewed_at FROM reviews WHERE reviewed_at BETWEEN ? AND ?', from, to), 'reviewed_at', acc, 'cards');
	byLocalDay(all('SELECT answered_at FROM quiz_answers WHERE answered_at BETWEEN ? AND ?', from, to), 'answered_at', acc, 'questions');
	byLocalDay(all('SELECT answered_at FROM quiz_answers WHERE correct = 1 AND answered_at BETWEEN ? AND ?', from, to), 'answered_at', acc, 'qok');
	byLocalDay(all('SELECT at FROM subnet_drills WHERE at BETWEEN ? AND ?', from, to), 'at', acc, 'drills');
	const lq = all('SELECT at, total, correct FROM lesson_quiz WHERE at BETWEEN ? AND ?', from, to);
	byLocalDay(lq, 'at', acc, 'questions', 'total');
	byLocalDay(lq, 'at', acc, 'qok', 'correct');
	byLocalDay(all('SELECT watched_at FROM videos WHERE watched_at BETWEEN ? AND ?', from, to), 'watched_at', acc, 'videos');
	for (const r of all('SELECT date, minutes FROM study_sessions WHERE date BETWEEN ? AND ?', fromYmd, toYmd)) {
		const a = acc.get(r.date) ?? { cards: 0, questions: 0, qok: 0, minutes: 0, drills: 0, videos: 0 };
		a.minutes += r.minutes;
		acc.set(r.date, a);
	}
	return acc;
}

export const isActive = (a?: DayActivity) => !!a && a.cards + a.questions + a.minutes + a.drills + a.videos > 0;

/** Jours consécutifs d'activité, aujourd'hui compris (ou hier si rien encore aujourd'hui). */
export function streak(): number {
	const today = new Date();
	const act = activity(ymd(addDays(today, -400)), ymd(today));
	let d = today;
	if (!isActive(act.get(ymd(d)))) d = addDays(d, -1);
	let n = 0;
	while (isActive(act.get(ymd(d)))) {
		n++;
		d = addDays(d, -1);
	}
	return n;
}

/** Réussite QCM par domaine. */
export function quizByDomain() {
	const res: Record<string, { n: number; ok: number }> = {};
	for (const r of all('SELECT q.topic, a.correct FROM quiz_answers a JOIN questions q ON q.id = a.question_id')) {
		const d = domainOf(r.topic);
		res[d] ??= { n: 0, ok: 0 };
		res[d].n++;
		res[d].ok += r.correct;
	}
	return res;
}

export function totals() {
	return {
		reviews: one('SELECT COUNT(*) AS n FROM reviews')!.n as number,
		answers: one('SELECT COUNT(*) AS n, SUM(correct) AS ok FROM quiz_answers') as Row,
		minutes: (one('SELECT SUM(minutes) AS m FROM study_sessions')!.m ?? 0) as number,
		videos: one('SELECT COUNT(*) AS n FROM videos WHERE watched_at IS NOT NULL')!.n as number,
		mature: one("SELECT COUNT(*) AS n FROM cards WHERE json_extract(fsrs,'$.scheduled_days') >= 21")!.n as number,
		cards: one('SELECT COUNT(*) AS n FROM cards')!.n as number
	};
}

export { WEEKS };
