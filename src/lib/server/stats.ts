// Calcul de toutes les statistiques de la page Stats (lecture seule).
import { db } from './db';
import { getPlanState, quizByDomain, getTopics } from './repo';
import { WEEKS, weekStart, weekIndexOf, tasksFor } from '$lib/data/plan';
import { ALL_TOPICS } from '$lib/data/topics';
import { addDays, ymd } from '$lib/dates';

type Row = Record<string, any>;
const all = (sql: string, ...p: any[]) => db.prepare(sql).all(...p) as Row[];
const one = (sql: string, ...p: any[]) => db.prepare(sql).get(...p) as Row | undefined;

const dayKey = (iso: string) => ymd(new Date(iso));
const mondayOf = (d: Date) => addDays(new Date(d.getFullYear(), d.getMonth(), d.getDate()), -((d.getDay() + 6) % 7));

/** Temps d'étude par semaine (minutes), par activité, sur les `n` dernières semaines. */
function timePerWeek(n = 12) {
	const thisMonday = mondayOf(new Date());
	const weeks = Array.from({ length: n }, (_, i) => ymd(addDays(thisMonday, -7 * (n - 1 - i))));
	const idx = (iso: string) => weeks.indexOf(ymd(mondayOf(new Date(iso))));
	const zero = () => weeks.map(() => 0);
	const sessions = zero(), cards = zero(), quiz = zero(), drills = zero();
	for (const r of all('SELECT date, minutes FROM study_sessions')) {
		const i = weeks.indexOf(ymd(mondayOf(new Date(r.date + 'T12:00:00'))));
		if (i >= 0) sessions[i] += r.minutes;
	}
	for (const r of all('SELECT reviewed_at, ms FROM reviews')) { const i = idx(r.reviewed_at); if (i >= 0) cards[i] += (r.ms ?? 8000) / 60000; }
	for (const r of all('SELECT started_at, duration_s FROM quiz_attempts WHERE finished_at IS NOT NULL')) { const i = idx(r.started_at); if (i >= 0) quiz[i] += (r.duration_s ?? 0) / 60; }
	for (const r of all('SELECT at FROM lesson_quiz')) { const i = idx(r.at); if (i >= 0) quiz[i] += 1.5; }
	for (const r of all('SELECT at, ms FROM subnet_drills')) { const i = idx(r.at); if (i >= 0) drills[i] += r.ms / 60000; }
	const round = (a: number[]) => a.map((v) => Math.round(v));
	return { weeks, sessions: round(sessions), cards: round(cards), quiz: round(quiz), drills: round(drills) };
}

/** Activité quotidienne (nombre d'éléments) sur les `n` derniers jours. */
function dailyCounts(n = 30) {
	const days = Array.from({ length: n }, (_, i) => ymd(addDays(new Date(), i - (n - 1))));
	const from = new Date(days[0] + 'T00:00:00').toISOString();
	const map = (rows: Row[], f: string, v?: string) => {
		const m = new Map<string, number>();
		for (const r of rows) m.set(dayKey(r[f]), (m.get(dayKey(r[f])) ?? 0) + (v ? Number(r[v]) : 1));
		return days.map((d) => m.get(d) ?? 0);
	};
	const q = map(all('SELECT answered_at FROM quiz_answers WHERE answered_at >= ?', from), 'answered_at');
	const lq = map(all('SELECT at, total FROM lesson_quiz WHERE at >= ?', from), 'at', 'total');
	return {
		days,
		cards: map(all('SELECT reviewed_at FROM reviews WHERE reviewed_at >= ?', from), 'reviewed_at'),
		questions: q.map((v, i) => v + lq[i]),
		drills: map(all('SELECT at FROM subnet_drills WHERE at >= ?', from), 'at')
	};
}

function flashStats() {
	const states = one(`SELECT
		SUM(CASE WHEN suspended = 1 THEN 1 ELSE 0 END) AS suspended,
		SUM(CASE WHEN suspended = 0 AND json_extract(fsrs,'$.state') = 0 THEN 1 ELSE 0 END) AS new,
		SUM(CASE WHEN suspended = 0 AND json_extract(fsrs,'$.state') IN (1,3) THEN 1 ELSE 0 END) AS learning,
		SUM(CASE WHEN suspended = 0 AND json_extract(fsrs,'$.state') = 2 AND json_extract(fsrs,'$.scheduled_days') < 21 THEN 1 ELSE 0 END) AS young,
		SUM(CASE WHEN suspended = 0 AND json_extract(fsrs,'$.state') = 2 AND json_extract(fsrs,'$.scheduled_days') >= 21 THEN 1 ELSE 0 END) AS mature,
		COUNT(*) AS total FROM cards`)!;
	const ratings = [1, 2, 3, 4].map((r) => (one('SELECT COUNT(*) AS n FROM reviews WHERE rating = ?', r)!.n as number));
	const avgMs = (one('SELECT AVG(ms) AS a FROM reviews WHERE ms > 0')?.a ?? 0) as number;
	// Rétention : part des révisions de cartes déjà apprises qui ne sont pas "Again", par semaine.
	const thisMonday = mondayOf(new Date());
	const weeks = Array.from({ length: 12 }, (_, i) => ymd(addDays(thisMonday, -7 * (11 - i))));
	const tally = weeks.map(() => ({ n: 0, ok: 0 }));
	for (const r of all(`SELECT r.reviewed_at, r.rating, r.prev FROM reviews r WHERE r.prev IS NOT NULL`)) {
		let prevState = 0;
		try { prevState = JSON.parse(JSON.parse(r.prev).fsrs).state; } catch { /* ancienne révision */ }
		if (prevState !== 2) continue;
		const i = weeks.indexOf(ymd(mondayOf(new Date(r.reviewed_at))));
		if (i < 0) continue;
		tally[i].n++;
		if (r.rating > 1) tally[i].ok++;
	}
	const retention = weeks.map((w, i) => ({ date: w, v: tally[i].n ? Math.round((100 * tally[i].ok) / tally[i].n) : null })).filter((x) => x.v !== null) as { date: string; v: number }[];
	const byDeck = all(`SELECT deck, COUNT(*) AS total,
		SUM(CASE WHEN json_extract(fsrs,'$.state') = 2 AND json_extract(fsrs,'$.scheduled_days') >= 21 THEN 1 ELSE 0 END) AS mature,
		SUM(CASE WHEN json_extract(fsrs,'$.state') = 0 THEN 1 ELSE 0 END) AS new,
		SUM(json_extract(fsrs,'$.lapses')) AS lapses
		FROM cards GROUP BY deck ORDER BY deck`);
	const hardest = all(`SELECT id, deck, day, front, json_extract(fsrs,'$.lapses') AS lapses, json_extract(fsrs,'$.difficulty') AS difficulty
		FROM cards WHERE json_extract(fsrs,'$.lapses') > 0 ORDER BY lapses DESC, difficulty DESC LIMIT 10`);
	return { states, ratings, avgMs, retention, byDeck, hardest };
}

function quizStats() {
	const attempts = all('SELECT started_at, mode, total, correct FROM quiz_attempts WHERE finished_at IS NOT NULL AND total >= 5 ORDER BY id');
	const practice = attempts.filter((a) => a.mode !== 'exam').map((a) => ({ date: a.started_at.slice(0, 10), v: Math.round((100 * a.correct) / a.total) }));
	const exam = attempts.filter((a) => a.mode === 'exam').map((a) => ({ date: a.started_at.slice(0, 10), v: Math.round((100 * a.correct) / a.total) }));
	// Réussite par thème : QCM + mini-QCM des leçons ne sont pas reliés à un thème → QCM seulement.
	const perTopic = new Map<string, { n: number; ok: number }>();
	for (const r of all('SELECT q.topic, a.correct FROM quiz_answers a JOIN questions q ON q.id = a.question_id')) {
		const t = perTopic.get(r.topic) ?? { n: 0, ok: 0 };
		t.n++;
		t.ok += r.correct;
		perTopic.set(r.topic, t);
	}
	const topics = getTopics();
	const bankByTopic = new Map<string, number>();
	for (const r of all('SELECT topic, COUNT(*) AS n FROM questions GROUP BY topic')) bankByTopic.set(r.topic, r.n);
	const topicRows = ALL_TOPICS.map((t) => {
		const s = perTopic.get(t.code);
		return { code: t.code, label: t.label, domain: t.domain, bank: bankByTopic.get(t.code) ?? 0, n: s?.n ?? 0, pct: s ? Math.round((100 * s.ok) / s.n) : null, status: topics[t.code]?.status ?? 0 };
	});
	const weakest = topicRows.filter((t) => t.n >= 2 && t.pct !== null).sort((a, b) => a.pct! - b.pct!).slice(0, 8);
	const totals = one('SELECT COUNT(*) AS n, SUM(correct) AS ok FROM quiz_answers') as Row;
	return { practice, exam, byDomain: quizByDomain(), topicRows, weakest, totals, attempts: attempts.length };
}

function lessonStats() {
	const best = new Map<number, { best: number; total: number; first: number; tries: number }>();
	for (const r of all('SELECT day, correct, total FROM lesson_quiz ORDER BY id')) {
		const b = best.get(r.day);
		if (!b) best.set(r.day, { best: r.correct, total: r.total, first: r.correct, tries: 1 });
		else { b.best = Math.max(b.best, r.correct); b.tries++; }
	}
	const cells = Array.from({ length: 63 }, (_, i) => {
		const b = best.get(i + 1);
		return { day: i + 1, best: b?.best ?? null, total: b?.total ?? 3, first: b?.first ?? null, tries: b?.tries ?? 0 };
	});
	const done = cells.filter((c) => c.best !== null);
	return {
		cells,
		done: done.length,
		perfect: done.filter((c) => c.best === c.total).length,
		firstTry: done.length ? Math.round((100 * done.reduce((a, c) => a + (c.first ?? 0), 0)) / done.reduce((a, c) => a + c.total, 0)) : null
	};
}

function subnetStats() {
	const rows = all('SELECT at, correct, ms FROM subnet_drills ORDER BY at');
	const byDay = new Map<string, { n: number; ok: number; ms: number[] }>();
	for (const r of rows) {
		const k = dayKey(r.at);
		const d = byDay.get(k) ?? { n: 0, ok: 0, ms: [] };
		d.n++;
		if (r.correct) { d.ok++; d.ms.push(r.ms); }
		byDay.set(k, d);
	}
	const days = [...byDay.entries()].slice(-30);
	return {
		total: rows.length,
		ok: rows.filter((r) => r.correct).length,
		accuracy: days.map(([d, v]) => ({ date: d, v: Math.round((100 * v.ok) / v.n) })),
		speed: days.filter(([, v]) => v.ms.length).map(([d, v]) => ({ date: d, v: Math.round(v.ms.reduce((a, b) => a + b, 0) / v.ms.length / 1000) })),
		best: rows.filter((r) => r.correct).reduce((m, r) => Math.min(m, r.ms), Infinity)
	};
}

function planStats() {
	const p = getPlanState();
	const current = weekIndexOf(new Date());
	const weeks = WEEKS.map((w, i) => ({ i, title: w.title, pct: p.weekPct(i), tasks: tasksFor(i, p.isSolo(i)).length, start: ymd(weekStart(i)) }));
	// Vidéos : cumul réel vs cumul prévu par le planning, semaine par semaine jusqu'à aujourd'hui.
	const watched = all('SELECT watched_at FROM videos WHERE watched_at IS NOT NULL').map((r) => new Date(r.watched_at));
	const upto = Math.max(0, Math.min(WEEKS.length - 1, current));
	const planned: { date: string; v: number }[] = [];
	const actual: { date: string; v: number }[] = [];
	let plannedSoFar = 0;
	for (let i = 0; i <= upto; i++) {
		const w = WEEKS[i];
		if (w.days) plannedSoFar = Math.max(plannedSoFar, w.days[1]);
		const end = addDays(weekStart(i), 7);
		planned.push({ date: ymd(weekStart(i)), v: plannedSoFar });
		actual.push({ date: ymd(weekStart(i)), v: watched.filter((d) => d < end).length });
	}
	const doneTasks = weeks.slice(0, upto + 1).reduce((a, w) => a + Math.round((w.pct * w.tasks) / 100), 0);
	const allTasks = weeks.slice(0, upto + 1).reduce((a, w) => a + w.tasks, 0);
	return { current, weeks, planned, actual, watched: watched.length, plannedNow: plannedSoFar, taskRate: allTasks ? Math.round((100 * doneTasks) / allTasks) : 0 };
}

function hourOfDay() {
	const hours = Array.from({ length: 24 }, () => 0);
	for (const r of all('SELECT reviewed_at AS at FROM reviews UNION ALL SELECT answered_at FROM quiz_answers UNION ALL SELECT at FROM subnet_drills UNION ALL SELECT at FROM lesson_quiz'))
		hours[new Date(r.at).getHours()]++;
	return hours;
}

function weekdayStats() {
	const days = Array.from({ length: 7 }, () => 0);
	for (const r of all('SELECT reviewed_at AS at FROM reviews UNION ALL SELECT answered_at FROM quiz_answers UNION ALL SELECT at FROM subnet_drills UNION ALL SELECT at FROM lesson_quiz'))
		days[(new Date(r.at).getDay() + 6) % 7]++;
	for (const r of all('SELECT date, minutes FROM study_sessions')) days[(new Date(r.date + 'T12:00:00').getDay() + 6) % 7] += Math.round(r.minutes / 2);
	return days;
}

export function allStats() {
	return {
		time: timePerWeek(12),
		daily: dailyCounts(30),
		flash: flashStats(),
		quiz: quizStats(),
		lessons: lessonStats(),
		subnet: subnetStats(),
		plan: planStats(),
		hours: hourOfDay(),
		weekdays: weekdayStats()
	};
}

