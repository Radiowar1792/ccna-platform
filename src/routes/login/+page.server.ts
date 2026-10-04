import { fail, redirect } from '@sveltejs/kit';
import { checkPassword, COOKIE, cookieOpts, makeToken } from '$lib/server/auth';

export const actions = {
	login: async ({ request, cookies, url }) => {
		const f = await request.formData();
		if (!checkPassword(String(f.get('password') ?? ''))) return fail(400, { error: 'Wrong password.' });
		cookies.set(COOKIE, makeToken(), cookieOpts(url.protocol === 'https:'));
		const next = url.searchParams.get('next');
		throw redirect(303, next && next.startsWith('/') ? next : '/');
	},
	logout: async ({ cookies }) => {
		cookies.delete(COOKIE, { path: '/' });
		throw redirect(303, '/login');
	}
};
