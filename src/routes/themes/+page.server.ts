import { getTopics, quizByDomain, readiness } from '$lib/server/repo';
export const load = () => {
	const topics = getTopics();
	return { topics, readiness: readiness(topics), quiz: quizByDomain() };
};
