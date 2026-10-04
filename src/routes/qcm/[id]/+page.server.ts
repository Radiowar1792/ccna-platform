import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { getQuestions } from '$lib/server/repo';

export const load = ({ params }) => {
	const a = db.prepare('SELECT * FROM quiz_attempts WHERE id = ?').get(Number(params.id)) as any;
	if (!a) throw error(404, 'QCM introuvable');
	const f = JSON.parse(a.filter ?? '{}');
	const questions = getQuestions(f.ids ?? []);
	const answers: Record<number, { chosen: number[]; correct: boolean }> = {};
	for (const r of db.prepare('SELECT question_id, chosen, correct FROM quiz_answers WHERE attempt_id = ?').all(a.id) as any[])
		answers[r.question_id] = { chosen: JSON.parse(r.chosen), correct: !!r.correct };
	const finished = !!a.finished_at;
	// En mode examen non terminé, on ne divulgue pas les réponses au navigateur.
	const hide = a.mode === 'exam' && !finished;
	return {
		attempt: { id: a.id, mode: a.mode, startedAt: a.started_at, finished, total: a.total, correct: a.correct, duration: a.duration_s },
		questions: questions.map((q) => ({ ...(hide ? { ...q, answer: [] as number[], explanation: "" } : q), n: q.answer.length })),
		answers
	};
};
