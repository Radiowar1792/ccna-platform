import { reviewQueue } from '$lib/server/repo';
export const load = ({ url }) => {
	const deck = url.searchParams.get('deck');
	return { deck, queue: reviewQueue(deck) };
};
