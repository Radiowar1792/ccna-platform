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

/* ---------- flashcards (FSRS) ---------- */
const scheduler = fsrs({ enable_fuzz: true });

function loadCard(json: string): Card {
	const c = JSON.parse(json);
	c.due = new Date(c.due);
	if (c.last_review) c.last_review = new Date(c.last_review);
	return c as Card;
}

export function deckStats() {
	const now = new Date().toISOString();
	return all(
		`SELECT deck,
		        COUNT(*) AS total,
		        SUM(CASE WHEN suspended = 0 AND due <= ? AND json_extract(fsrs, '$.state') != 0 THEN 1 ELSE 0 END) AS due,
		        SUM(CASE WHEN suspended = 0 AND json_extract(fsrs, '$.state') = 0 THEN 1 ELSE 0 END) AS new
		 FROM cards GROUP BY deck ORDER BY deck`,
		now
	);
}

/** File de révision : cartes dues d'abord, puis jusqu'à `newLimit` nouvelles cartes par jour. */
export function reviewQueue(deck: string | null, newLimit = 15) {
	const now = new Date().toISOString();
	const today = ymd();
	const introduced = one(
		`SELECT COUNT(DISTINCT card_id) AS n FROM reviews r WHERE substr(reviewed_at,1,10) >= ? AND NOT EXISTS
		   (SELECT 1 FROM reviews r2 WHERE r2.card_id = r.card_id AND r2.reviewed_at < r.reviewed_at)`,
		today
	)?.n ?? 0;
	const deckSql = deck ? 'AND deck = ?' : '';
	const args = deck ? [deck] : [];
	const due = all(
		`SELECT id, deck, topic, front, back, fsrs FROM cards WHERE suspended = 0 AND json_extract(fsrs,'$.state') != 0 AND due <= ? ${deckSql} ORDER BY due LIMIT 200`,
		now, ...args
	);
	const fresh = all(
		`SELECT id, deck, topic, front, back, fsrs FROM cards WHERE suspended = 0 AND json_extract(fsrs,'$.state') = 0 ${deckSql} ORDER BY id LIMIT ?`,
		...args, Math.max(0, newLimit - introduced)
	);
	return [...due, ...fresh].map((r) => ({ id: r.id, deck: r.deck, topic: r.topic, front: r.front, back: r.back, state: JSON.parse(r.fsrs).state as number }));
}

/** Intervalles affichés sous les 4 boutons (À revoir, Difficile, Bien, Facile). */
export function previewIntervals(cardId: number) {
	const r = one('SELECT fsrs FROM cards WHERE id = ?', cardId);
	if (!r) return null;
	const now = new Date();
	const prev = scheduler.repeat(loadCard(r.fsrs), now);
	const fmt = (d: Date) => {
		const m = Math.round((d.getTime() - now.getTime()) / 60000);
		if (m < 60) return `${Math.max(1, m)} min`;
		if (m < 1440) return `${Math.round(m / 60)} h`;
		const days = Math.round(m / 1440);
		return days < 31 ? `${days} j` : `${Math.round(days / 30)} mois`;
	};
	return {
		1: fmt(prev[Rating.Again].card.due),
		2: fmt(prev[Rating.Hard].card.due),
		3: fmt(prev[Rating.Good].card.due),
		4: fmt(prev[Rating.Easy].card.due)
	};
}

export function reviewCard(cardId: number, rating: Grade, ms: number) {
	const r = one('SELECT fsrs FROM cards WHERE id = ?', cardId);
	if (!r) return;
	const now = new Date();
	const { card } = scheduler.next(loadCard(r.fsrs), now, rating);
	run('UPDATE cards SET fsrs = ?, due = ? WHERE id = ?', JSON.stringify(card), card.due.toISOString(), cardId);
	run('INSERT INTO reviews (card_id, rating, reviewed_at, ms) VALUES (?, ?, ?, ?)', cardId, rating, now.toISOString(), Math.min(ms, 600000));
}

export function listCards(deck: string | null) {
	return all(
		`SELECT id, deck, topic, front, back, due, suspended, json_extract(fsrs,'$.state') AS state, json_extract(fsrs,'$.reps') AS reps FROM cards ${deck ? 'WHERE deck = ?' : ''} ORDER BY deck, id`,
		...(deck ? [deck] : [])
	);
}
export function addCard(deck: string, topic: string | null, front: string, back: string) {
	const now = new Date();
	run('INSERT INTO cards (deck, topic, front, back, fsrs, due, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)', deck, topic, front, back, JSON.stringify(createEmptyCard(now)), now.toISOString(), now.toISOString());
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
