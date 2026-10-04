import { json, error } from '@sveltejs/kit';
import { getCardForReview, previewIntervals, reviewCard, undoLastReview } from '$lib/server/repo';

export function GET({ url }) {
	const id = Number(url.searchParams.get('id'));
	return json(previewIntervals(id));
}

export async function POST({ request }) {
	const b = await request.json();
	if (b.op === 'undo') {
		const id = undoLastReview();
		return json({ card: id ? getCardForReview(id) : null });
	}
	const rating = Number(b.rating);
	if (![1, 2, 3, 4].includes(rating)) throw error(400, 'Invalid rating');
	reviewCard(Number(b.cardId), rating as 1 | 2 | 3 | 4, Number(b.ms) || 0);
	return json({ ok: true });
}
