import { json, error } from '@sveltejs/kit';
import { addSession, deleteSession } from '$lib/server/repo';

export async function POST({ request }) {
	const b = await request.json();
	if (b.op === 'delete') { deleteSession(Number(b.id)); return json({ ok: true }); }
	const minutes = Math.round(Number(b.minutes));
	if (!/^\d{4}-\d{2}-\d{2}$/.test(b.date) || !(minutes > 0 && minutes <= 600)) throw error(400, 'Session invalide');
	addSession(b.date, minutes, String(b.activity || 'Autre').slice(0, 40), String(b.note || '').slice(0, 300));
	return json({ ok: true });
}
