import { fail } from '@sveltejs/kit';
import { addMock, deleteMock, getTopics, listMocks, readiness, streak, totals } from '$lib/server/repo';
import { allStats } from '$lib/server/stats';
import { heatPoints } from '$lib/server/heat';

export const load = () => ({
	totals: totals(),
	streak: streak(),
	readiness: readiness(),
	topics: getTopics(),
	mocks: listMocks(),
	heat: heatPoints(39),
	s: allStats()
});

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
