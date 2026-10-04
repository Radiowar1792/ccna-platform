// Synchronise les identifiants des vidéos de la playlist de Jeremy (titres "Day N").
import { env } from '$env/dynamic/private';
import { JEREMY_PLAYLIST } from '$lib/data/videos';
import { setVideoId } from './repo';

interface Item { id: string; title: string }

async function viaApi(key: string): Promise<Item[]> {
	const items: Item[] = [];
	let page = '';
	for (let i = 0; i < 10; i++) {
		const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${JEREMY_PLAYLIST}&key=${key}${page ? '&pageToken=' + page : ''}`;
		const r = await fetch(url);
		if (!r.ok) throw new Error(`API YouTube : ${r.status}`);
		const j = await r.json();
		for (const it of j.items ?? []) items.push({ id: it.snippet.resourceId.videoId, title: it.snippet.title });
		if (!j.nextPageToken) break;
		page = j.nextPageToken;
	}
	return items;
}

/** Sans clé : lit la page publique de la playlist (les ~100 premières vidéos). */
async function viaPage(): Promise<Item[]> {
	const r = await fetch(`https://www.youtube.com/playlist?list=${JEREMY_PLAYLIST}&hl=en`, {
		headers: { 'User-Agent': 'Mozilla/5.0', 'Accept-Language': 'en-US,en;q=0.9' }
	});
	if (!r.ok) throw new Error(`YouTube : ${r.status}`);
	const html = await r.text();
	const items: Item[] = [];
	const re = /"playlistVideoRenderer":\{"videoId":"([\w-]{11})".*?"title":\{"runs":\[\{"text":"((?:[^"\\]|\\.)*)"/g;
	let m: RegExpExecArray | null;
	while ((m = re.exec(html))) items.push({ id: m[1], title: JSON.parse(`"${m[2]}"`) });
	return items;
}

export async function syncPlaylist(): Promise<{ matched: number; total: number; method: string }> {
	const key = env.YOUTUBE_API_KEY;
	const items = key ? await viaApi(key) : await viaPage();
	let matched = 0;
	const seen = new Set<number>();
	for (const it of items) {
		// Titres du type : "Free CCNA | Network Devices | Day 1 | CCNA 200-301 Complete Course"
		if (/\blab\b/i.test(it.title)) continue;
		const m = it.title.match(/day\s*(\d{1,2})\b/i);
		if (!m) continue;
		const day = Number(m[1]);
		if (day < 1 || day > 63 || seen.has(day)) continue;
		seen.add(day);
		const parts = it.title.split('|').map((x) => x.trim());
		const di = parts.findIndex((x) => /^day\s*\d+/i.test(x));
		const clean = di > 0 ? parts[di - 1].replace(/^free\s+ccna\s*/i, '').trim() : '';
		setVideoId(day, it.id, clean || undefined);
		matched++;
	}
	return { matched, total: items.length, method: key ? 'API YouTube' : 'page publique' };
}
