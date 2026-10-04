import { json, error } from '@sveltejs/kit';
import { previewIntervals, reviewCard } from '$lib/server/repo';

export function GET({ url }) {
	const id = Number(url.searchParams.get('id'));
	return json(previewIntervals(id));
}

export async function POST({ request }) {
	const b = await request.json();
	const rating = Number(b.rating);
	if (![1, 2, 3, 4].includes(rating)) throw error(400, 'Note invalide');
	reviewCard(Number(b.cardId), rating as 1 | 2 | 3 | 4, Number(b.ms) || 0);
	return json({ ok: true });
}
