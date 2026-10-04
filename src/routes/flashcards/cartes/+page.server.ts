import { fail } from '@sveltejs/kit';
import { deleteCard, listCards, setSuspended, updateCard } from '$lib/server/repo';

export const load = ({ url }) => {
	const deck = url.searchParams.get('deck');
	return { deck, cards: listCards(deck) };
};

export const actions = {
	save: async ({ request }) => {
		const f = await request.formData();
		const id = Number(f.get('id'));
		const front = String(f.get('front') ?? '').trim();
		const back = String(f.get('back') ?? '').trim();
		if (!front || !back) return fail(400, { error: 'Recto et verso obligatoires.' });
		updateCard(id, front, back, String(f.get('topic') ?? '') || null, String(f.get('deck') ?? 'Concepts'));
	},
	delete: async ({ request }) => deleteCard(Number((await request.formData()).get('id'))),
	suspend: async ({ request }) => {
		const f = await request.formData();
		setSuspended(Number(f.get('id')), f.get('on') === '1');
	}
};
