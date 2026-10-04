import { deckStats, getPlanState, getVideos, listMocks, readiness, recentSessions, streak, totals } from '$lib/server/repo';
import { heatPoints } from '$lib/server/heat';
import { WEEKS, weekIndexOf } from '$lib/data/plan';

export const load = () => {
	const plan = getPlanState();
	const week = weekIndexOf(new Date());
	const videos = getVideos();
	const w = WEEKS[week];
	const weekVideos = w.days ? videos.filter((v) => v.day >= w.days![0] && v.day <= w.days![1]) : [];
	const nextVideo = videos.find((v) => !v.watched_at) ?? null;
	const decks = deckStats();
	const mocks = listMocks();
	return {
		examDate: plan.examDate,
		week,
		solo: plan.isSolo(week),
		done: plan.done,
		weekVideos,
		nextVideo,
		due: decks.reduce((a, d) => a + Number(d.due), 0),
		fresh: decks.reduce((a, d) => a + Number(d.new), 0),
		streak: streak(),
		readiness: readiness(),
		lastMock: mocks.at(-1) ?? null,
		heat: heatPoints(26),
		sessions: recentSessions(5),
		totals: totals()
	};
};
