import { fail } from '@sveltejs/kit';
import { activity, addCard, deckStats, forecast, getFlashSettings, newLeftToday, setFlashSettings } from '$lib/server/repo';
import { importApkg } from '$lib/server/anki';
import { addDays, ymd } from '$lib/dates';

export const load = () => {
	const act = activity(ymd(addDays(new Date(), -13)), ymd());
	const last14 = Array.from({ length: 14 }, (_, i) => {
		const d = ymd(addDays(new Date(), i - 13));
		return { d, n: act.get(d)?.cards ?? 0 };
	});
	return { decks: deckStats(), last14, forecast: forecast(30), settings: getFlashSettings(), newLeft: newLeftToday() };
};

export const actions = {
	add: async ({ request }) => {
		const f = await request.formData();
		const front = String(f.get('front') ?? '').trim();
		const back = String(f.get('back') ?? '').trim();
		const deck = String(f.get('deck') ?? 'My cards').trim() || 'My cards';
		const topic = String(f.get('topic') ?? '').trim() || null;
		const dayN = Number(f.get('day'));
		if (!front || !back) return fail(400, { error: 'Front and back are both required.' });
		addCard(deck, topic, front, back, dayN >= 1 && dayN <= 63 ? dayN : null);
		return { added: true };
	},
	settings: async ({ request }) => {
		const f = await request.formData();
		setFlashSettings({
			newPerDay: Number(f.get('newPerDay')) || 0,
			retention: Number(f.get('retention')) / 100 || 0.9,
			unlockByVideo: f.get('unlock') === 'on'
		});
		return { savedSettings: true };
	},
	import: async ({ request }) => {
		const f = await request.formData();
		const file = f.get('file');
		if (!(file instanceof File) || !file.size) return fail(400, { importError: 'Choose a .apkg file first.' });
		if (!/\.(apkg|colpkg)$/i.test(file.name)) return fail(400, { importError: 'The file must be an Anki .apkg export.' });
		try {
			const r = importApkg(Buffer.from(await file.arrayBuffer()), String(f.get('deck') ?? '').trim() || undefined);
			return { imported: r };
		} catch (e) {
			return fail(400, { importError: (e as Error).message });
		}
	}
};
