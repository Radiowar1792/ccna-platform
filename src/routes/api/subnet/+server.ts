import { json } from '@sveltejs/kit';
import { logSubnet } from '$lib/server/repo';

export async function POST({ request }) {
	const b = await request.json();
	logSubnet(!!b.correct, Math.max(0, Math.min(Number(b.ms) || 0, 3600000)));
	return json({ ok: true });
}
