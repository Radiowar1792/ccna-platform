import { json, error } from '@sveltejs/kit';
import { answerQuestion, finishAttempt } from '$lib/server/repo';

export async function POST({ request }) {
	const b = await request.json();
	if (b.op === 'answer') {
		const r = answerQuestion(Number(b.attempt), Number(b.question), (b.chosen ?? []).map(Number));
		if (!r) throw error(404, 'Question introuvable');
		return json(r);
	}
	if (b.op === 'finish') return json(finishAttempt(Number(b.attempt)));
	throw error(400, 'Opération inconnue');
}
