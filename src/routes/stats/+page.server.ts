import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { addMock, deleteMock, getTopics, listMocks, quizByDomain, readiness, streak, subnetStats, totals } from '$lib/server/repo';
import { heatPoints } from '$lib/server/heat';

export const load = () => {
	const attempts = db.prepare('SELECT started_at, total, correct FROM quiz_attempts WHERE finished_at IS NOT NULL AND total >= 5 ORDER BY id').all() as any[];
	const byActivity = db.prepare('SELECT activity, SUM(minutes) AS m FROM study_sessions GROUP BY activity ORDER BY m DESC').all() as any[];
	return {
		totals: totals(),
		streak: streak(),
		readiness: readiness(),
		topics: getTopics(),
		quiz: quizByDomain(),
		mocks: listMocks(),
		attempts: attempts.map((a) => ({ date: a.started_at.slice(0, 10), v: Math.round((100 * a.correct) / a.total) })),
		byActivity,
		subnet: subnetStats(),
		heat: heatPoints(39)
	};
};

export const actions = {
	addMock: async ({ request }) => {
		const f = await request.formData();
		const date = String(f.get('date') ?? '');
		const score = Math.round(Number(f.get('score')));
		if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !(score >= 0 && score <= 100)) return fail(400, { error: 'Invalid date or score.' });
		addMock(date, String(f.get('source') ?? 'Other'), score);
	},
	deleteMock: async ({ request }) => deleteMock(Number((await request.formData()).get('id')))
};
