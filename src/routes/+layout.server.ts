import { deckStats } from '$lib/server/repo';
import { authEnabled } from '$lib/server/auth';

export const load = ({ locals, url }) => {
	if (!locals.authed || url.pathname.startsWith('/login')) return { due: 0, auth: authEnabled() };
	const due = deckStats().reduce((a, d) => a + Number(d.due) + 0, 0);
	return { due, auth: authEnabled() };
};
