import { json, error } from '@sveltejs/kit';
import { setTopicNote, setTopicStatus } from '$lib/server/repo';
import { ALL_TOPICS } from '$lib/data/topics';

export async function POST({ request }) {
	const b = await request.json();
	if (!ALL_TOPICS.some((t) => t.code === b.code)) throw error(400, 'Unknown topic');
	if (typeof b.status === 'number') setTopicStatus(b.code, Math.max(0, Math.min(2, b.status)));
	if (typeof b.note === 'string') setTopicNote(b.code, b.note.slice(0, 20000));
	return json({ ok: true });
}
