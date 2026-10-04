import { json, error } from '@sveltejs/kit';
import { setExamDate, setSolo, setSoloStartsOdd, toggleTask } from '$lib/server/repo';

export async function POST({ request }) {
	const b = await request.json();
	switch (b.op) {
		case 'task': toggleTask(Number(b.week), Number(b.idx), !!b.on); break;
		case 'solo': setSolo(Number(b.week), !!b.solo); break;
		case 'examDate': if (!/^\d{4}-\d{2}-\d{2}$/.test(b.value)) throw error(400, 'Date invalide'); setExamDate(b.value); break;
		case 'soloStartsOdd': setSoloStartsOdd(!!b.value); break;
		default: throw error(400, 'Opération inconnue');
	}
	return json({ ok: true });
}
