import { activity, getPlanState, listMocks } from '$lib/server/repo';
import { PLAN_START, WEEKS } from '$lib/data/plan';
import { addDays, parseYmd, ymd } from '$lib/dates';

export const load = ({ url }) => {
	const now = new Date();
	const m = url.searchParams.get('m');
	const base = m && /^\d{4}-\d{2}$/.test(m) ? new Date(Number(m.slice(0, 4)), Number(m.slice(5)) - 1, 1) : new Date(now.getFullYear(), now.getMonth(), 1);
	const first = addDays(base, -((base.getDay() + 6) % 7));
	const last = addDays(first, 41);
	const plan = getPlanState();
	const act = activity(ymd(first), ymd(last));
	const mocks = listMocks();
	const start = parseYmd(PLAN_START);

	const days = Array.from({ length: 42 }, (_, i) => {
		const d = addDays(first, i);
		const key = ymd(d);
		const dow = (d.getDay() + 6) % 7;
		const wi = Math.floor((d.getTime() - start.getTime()) / (7 * 86400e3));
		const inPlan = wi >= 0 && wi < WEEKS.length;
		let plan_: { label: string; kind: string } | null = null;
		const events: { label: string; tone: string }[] = [];
		if (inPlan) {
			const w = WEEKS[wi];
			if (w.kind === 'maintain') plan_ = { label: dow < 5 ? 'BTS · flashcards' : 'Repos', kind: 'rest' };
			else if (dow <= 2) {
				if (w.days) {
					const n = w.days[1] - w.days[0] + 1;
					const per = Math.ceil(n / 3);
					const a = w.days[0] + dow * per, b = Math.min(w.days[1], a + per - 1);
					plan_ = a <= w.days[1] ? { label: a === b ? `Vidéo J${a}` : `Vidéos J${a}–${b}`, kind: 'video' } : { label: 'Notes + flashcards', kind: 'review' };
				} else plan_ = { label: w.kind === 'exam' ? 'Révision ciblée' : w.title, kind: w.kind === 'light' ? 'rest' : 'review' };
			} else if (dow <= 4) plan_ = { label: w.kind === 'learn' ? 'Labs Packet Tracer' : w.kind === 'exam' && dow === 4 ? 'Examen blanc' : 'Labs + QCM', kind: w.kind === 'exam' && dow === 4 ? 'exam' : 'lab' };
			else plan_ = plan.isSolo(wi) ? { label: 'Seul · sieste', kind: 'rest' } : { label: dow === 5 ? 'Session longue' : 'QCM semaine', kind: 'long' };
			if (dow === 0) events.push({ label: `S${wi + 1} · ${w.title}`, tone: 'week' });
			if (dow === 4) for (const x of w.extra) if (/Examen final Netacad/.test(x)) events.push({ label: x.replace(/ :.*/, ''), tone: 'amber' });
		}
		for (const mk of mocks) if (mk.date === key) events.push({ label: `Blanc ${mk.score} %`, tone: mk.score >= 85 ? 'green' : 'amber' });
		if (key === plan.examDate) events.push({ label: 'EXAMEN CCNA', tone: 'red' });
		return { key, day: d.getDate(), inMonth: d.getMonth() === base.getMonth(), dow, plan: plan_, events, act: act.get(key) ?? null };
	});

	const prev = new Date(base.getFullYear(), base.getMonth() - 1, 1);
	const next = new Date(base.getFullYear(), base.getMonth() + 1, 1);
	const mk = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
	return { month: ymd(base), prev: mk(prev), next: mk(next), today: ymd(now), days };
};
