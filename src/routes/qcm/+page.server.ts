import { fail, redirect } from '@sveltejs/kit';
import { addQuestion, pickQuestions, questionCounts, quizByDomain, recentAttempts, startAttempt } from '$lib/server/repo';
import { ALL_TOPICS } from '$lib/data/topics';

export const load = ({ url }) => ({
	counts: questionCounts(),
	byDomain: quizByDomain(),
	attempts: recentAttempts(12),
	preset: url.searchParams.get('domain') ?? ''
});

export const actions = {
	start: async ({ request }) => {
		const f = await request.formData();
		const domain = String(f.get('domain') ?? '') || null;
		const count = Math.max(5, Math.min(120, Number(f.get('count')) || 10));
		const mode = f.get('mode') === 'exam' ? 'exam' : 'train';
		const pick = f.get('pick') === 'weak' ? 'weak' : 'random';
		const qs = pickQuestions(domain, count, pick);
		if (!qs.length) return fail(400, { error: 'Aucune question pour ce choix.' });
		const id = startAttempt(mode, JSON.stringify({ domain, pick, ids: qs.map((q) => q.id) }), qs.length);
		throw redirect(303, `/qcm/${id}`);
	},
	add: async ({ request }) => {
		const f = await request.formData();
		const topic = String(f.get('topic') ?? '');
		const stem = String(f.get('stem') ?? '').trim();
		const options = [0, 1, 2, 3, 4].map((i) => String(f.get('opt' + i) ?? '').trim()).filter(Boolean);
		const answer = f.getAll('correct').map(Number).filter((i) => i < options.length);
		const explanation = String(f.get('explanation') ?? '').trim();
		if (!ALL_TOPICS.some((t) => t.code === topic) || !stem || options.length < 2 || !answer.length)
			return fail(400, { addError: 'Il faut un thème, un énoncé, au moins 2 réponses et au moins une bonne réponse cochée.' });
		addQuestion(topic, stem, options, answer, explanation);
		return { added: true };
	}
};
