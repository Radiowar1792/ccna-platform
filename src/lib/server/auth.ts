import { createHmac, timingSafeEqual } from 'node:crypto';
import { env } from '$env/dynamic/private';

export const COOKIE = 'ccna_session';
const MAX_AGE = 60 * 60 * 24 * 60; // 60 jours

function secret() {
	return env.SESSION_SECRET || 'dev-secret-a-changer';
}

export function authEnabled() {
	return !!env.APP_PASSWORD;
}

export function checkPassword(pw: string): boolean {
	const expected = Buffer.from(env.APP_PASSWORD || '');
	const given = Buffer.from(pw);
	return expected.length === given.length && timingSafeEqual(expected, given);
}

export function makeToken(): string {
	const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
	const sig = createHmac('sha256', secret()).update(String(exp)).digest('hex');
	return `${exp}.${sig}`;
}

export function verifyToken(token: string | undefined): boolean {
	if (!token) return false;
	const [exp, sig] = token.split('.');
	if (!exp || !sig || Number(exp) < Date.now() / 1000) return false;
	const good = createHmac('sha256', secret()).update(exp).digest('hex');
	return good.length === sig.length && timingSafeEqual(Buffer.from(good), Buffer.from(sig));
}

export const cookieOpts = (secure: boolean) => ({ path: '/', httpOnly: true, sameSite: 'lax' as const, secure, maxAge: MAX_AGE });
