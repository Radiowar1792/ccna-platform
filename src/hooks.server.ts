import { redirect, type Handle } from '@sveltejs/kit';
import { authEnabled, COOKIE, verifyToken } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
	const open = !authEnabled();
	event.locals.authed = open || verifyToken(event.cookies.get(COOKIE));
	const p = event.url.pathname;
	if (!event.locals.authed && !p.startsWith('/login')) {
		if (p.startsWith('/api/')) return new Response('Non connecté', { status: 401 });
		throw redirect(303, '/login?next=' + encodeURIComponent(p));
	}
	return resolve(event);
};
