import { activity } from './repo';
import { addDays, ymd } from '$lib/dates';

/** Points d'activité par jour pour la heatmap. */
export function heatPoints(weeks = 26): Record<string, number> {
	const today = new Date();
	const act = activity(ymd(addDays(today, -7 * weeks - 7)), ymd(today));
	const out: Record<string, number> = {};
	for (const [d, a] of act) out[d] = Math.round(a.cards + a.questions * 2 + a.minutes / 2 + a.drills * 2 + a.videos * 10);
	return out;
}
