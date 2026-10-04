import { getVideos, lessonScores } from '$lib/server/repo';
export const load = ({ url }) => {
	const videos = getVideos();
	const next = videos.find((v) => !v.watched_at)?.day ?? 1;
	const day = Math.max(1, Math.min(63, Number(url.searchParams.get('day')) || next));
	return { videos, day, synced: videos.filter((v) => v.youtube_id).length, scores: lessonScores() };
};
