import { getPlanState } from '$lib/server/repo';
import { WEEKS, weekIndexOf } from '$lib/data/plan';

export const load = ({ url }) => {
	const p = getPlanState();
	const current = weekIndexOf(new Date());
	const sel = url.searchParams.has('w') ? Math.max(0, Math.min(WEEKS.length - 1, Number(url.searchParams.get('w')))) : current;
	return {
		current,
		sel,
		examDate: p.examDate,
		soloStartsOdd: p.soloStartsOdd,
		done: p.done,
		weeks: WEEKS.map((_, i) => ({ solo: p.isSolo(i), pct: p.weekPct(i) }))
	};
};
