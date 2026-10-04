import { reviewQueue } from '$lib/server/repo';
export const load = ({ url }) => {
	const deck = url.searchParams.get('deck');
	const dayN = Number(url.searchParams.get('day'));
	const day = dayN >= 1 && dayN <= 63 ? dayN : null;
	return { deck, day, queue: reviewQueue(deck, day) };
};
