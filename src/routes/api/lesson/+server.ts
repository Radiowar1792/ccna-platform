import { json, error } from '@sveltejs/kit';
import { saveLessonQuiz } from '$lib/server/repo';

export async function POST({ request }) {
	const b = await request.json();
	const day = Number(b.day), correct = Number(b.correct), total = Number(b.total);
	if (!(day >= 1 && day <= 63) || !(total > 0 && total <= 20) || !(correct >= 0 && correct <= total)) throw error(400, 'Invalid quiz result');
	saveLessonQuiz(day, correct, total);
	return json({ ok: true });
}
