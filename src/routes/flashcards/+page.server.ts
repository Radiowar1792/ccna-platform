import { fail } from '@sveltejs/kit';
import { addCard, deckStats } from '$lib/server/repo';
import { activity } from '$lib/server/repo';
import { addDays, ymd } from '$lib/dates';

export const load = () => {
	const act = activity(ymd(addDays(new Date(), -13)), ymd());
	const last14 = Array.from({ length: 14 }, (_, i) => {
		const d = ymd(addDays(new Date(), i - 13));
		return { d, n: act.get(d)?.cards ?? 0 };
	});
	return { decks: deckStats(), last14 };
};

export const actions = {
	add: async ({ request }) => {
		const f = await request.formData();
		const front = String(f.get('front') ?? '').trim();
		const back = String(f.get('back') ?? '').trim();
		const deck = String(f.get('deck') ?? 'My cards').trim() || 'My cards';
		const topic = String(f.get('topic') ?? '').trim() || null;
		if (!front || !back) return fail(400, { error: 'Front and back are both required.' });
		addCard(deck, topic, front, back);
		return { added: true };
	}
};
