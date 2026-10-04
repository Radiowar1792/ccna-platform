import { json, error } from '@sveltejs/kit';
import { setVideoId, setWatched } from '$lib/server/repo';
import { syncPlaylist } from '$lib/server/youtube';

/** Accepte une URL YouTube complète, courte ou un identifiant de 11 caractères. */
function parseId(s: string): string | null {
	const m = s.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/) ?? s.match(/^([\w-]{11})$/);
	return m ? m[1] : null;
}

export async function POST({ request }) {
	const b = await request.json();
	if (b.op === 'sync') {
		try {
			return json(await syncPlaylist());
		} catch (e) {
			throw error(502, `Sync failed: ${(e as Error).message}`);
		}
	}
	const day = Number(b.day);
	if (!(day >= 1 && day <= 63)) throw error(400, 'Invalid day');
	if (typeof b.watched === 'boolean') setWatched(day, b.watched);
	if (typeof b.url === 'string') {
		const id = b.url.trim() ? parseId(b.url.trim()) : null;
		if (b.url.trim() && !id) throw error(400, 'YouTube link not recognized');
		setVideoId(day, id);
	}
	return json({ ok: true });
}
