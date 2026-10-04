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
		if (!r.ok) throw new Error(`YouTube API: ${r.status}`);
		const j = await r.json();
		for (const it of j.items ?? []) items.push({ id: it.snippet.resourceId.videoId, title: it.snippet.title });
		if (!j.nextPageToken) break;
		page = j.nextPageToken;
	}
	return items;
}

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36';
// En Europe, YouTube redirige vers une page de consentement aux cookies : ces cookies la contournent.
const COOKIE = 'SOCS=CAI; CONSENT=YES+cb';

/** Parcourt récursivement la réponse YouTube et récupère les vidéos (ancien et nouveau format). */
function collect(node: unknown, out: Map<string, string>, tokens: string[]) {
	if (!node || typeof node !== 'object') return;
	if (Array.isArray(node)) {
		for (const x of node) collect(x, out, tokens);
		return;
	}
	const o = node as Record<string, any>;
	const pv = o.playlistVideoRenderer;
	if (pv?.videoId) {
		const t = pv.title?.runs?.map((r: any) => r.text).join('') ?? pv.title?.simpleText ?? '';
		if (t) out.set(pv.videoId, t);
	}
	const pp = o.playlistPanelVideoRenderer;
	if (pp?.videoId) {
		const t = pp.title?.simpleText ?? pp.title?.runs?.map((r: any) => r.text).join('') ?? '';
		if (t) out.set(pp.videoId, t);
	}
	const lv = o.lockupViewModel;
	if (lv?.contentId && lv.contentType !== 'LOCKUP_CONTENT_TYPE_PLAYLIST') {
		const t = lv.metadata?.lockupMetadataViewModel?.title?.content;
		if (t) out.set(lv.contentId, t);
	}
	const tok = o.continuationItemRenderer?.continuationEndpoint?.continuationCommand?.token;
	if (typeof tok === 'string') tokens.push(tok);
	for (const k in o) collect(o[k], out, tokens);
}

/** Sans clé : lit la page publique de la playlist puis les pages suivantes (API interne de YouTube). */
async function viaPage(): Promise<Item[]> {
	const r = await fetch(`https://www.youtube.com/playlist?list=${JEREMY_PLAYLIST}&hl=en&gl=US`, {
		headers: { 'User-Agent': UA, 'Accept-Language': 'en-US,en;q=0.9', Cookie: COOKIE }
	});
	if (!r.ok) throw new Error(`YouTube answered ${r.status}`);
	const html = await r.text();
	if (/consent\.youtube\.com|consent\.google/.test(r.url)) throw new Error('YouTube returned the cookie consent page');
	const m = html.match(/(?:var ytInitialData|window\["ytInitialData"\])\s*=\s*(\{.+?\});\s*<\/script>/s);
	if (!m) throw new Error('unexpected YouTube page format (ytInitialData not found)');
	const videos = new Map<string, string>();
	let tokens: string[] = [];
	collect(JSON.parse(m[1]), videos, tokens);

	const version = html.match(/"INNERTUBE_CLIENT_VERSION":"([^"]+)"/)?.[1] ?? '2.20241001.00.00';
	const apiKey = html.match(/"INNERTUBE_API_KEY":"([^"]+)"/)?.[1];
	const visitor = html.match(/"VISITOR_DATA":"([^"]+)"/)?.[1];
	for (let i = 0; i < 10 && tokens.length; i++) {
		const token = tokens.shift()!;
		tokens = [];
		try {
			const res = await fetch(`https://www.youtube.com/youtubei/v1/browse?prettyPrint=false${apiKey ? '&key=' + apiKey : ''}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'User-Agent': UA,
					Cookie: COOKIE,
					Origin: 'https://www.youtube.com',
					Referer: `https://www.youtube.com/playlist?list=${JEREMY_PLAYLIST}`,
					'X-Youtube-Client-Name': '1',
					'X-Youtube-Client-Version': version,
					...(visitor ? { 'X-Goog-Visitor-Id': visitor } : {})
				},
				body: JSON.stringify({ context: { client: { clientName: 'WEB', clientVersion: version, hl: 'en', gl: 'US', visitorData: visitor } }, continuation: token })
			});
			if (!res.ok) break;
			collect(await res.json(), videos, tokens);
		} catch {
			break;
		}
	}

	// Plan B : la page de lecture d'une vidéo de la playlist affiche un panneau avec les vidéos autour d'elle.
	for (let i = 0; i < 3 && videos.size >= 100; i++) {
		const lastId = [...videos.keys()].at(-1)!;
		const before = videos.size;
		try {
			const w = await fetch(`https://www.youtube.com/watch?v=${lastId}&list=${JEREMY_PLAYLIST}&index=${videos.size}&hl=en`, {
				headers: { 'User-Agent': UA, 'Accept-Language': 'en-US,en;q=0.9', Cookie: COOKIE }
			});
			const wm = (await w.text()).match(/(?:var ytInitialData|window\["ytInitialData"\])\s*=\s*(\{.+?\});\s*<\/script>/s);
			if (wm) collect(JSON.parse(wm[1]), videos, []);
		} catch {
			/* on garde ce qu'on a */
		}
		if (videos.size === before) break;
	}
	return [...videos].map(([id, title]) => ({ id, title }));
}

export async function syncPlaylist(): Promise<{ matched: number; total: number; method: string }> {
	const key = env.YOUTUBE_API_KEY;
	const items = key ? await viaApi(key) : await viaPage();
	if (!items.length) throw new Error(key ? 'the playlist is empty or the API key was refused' : 'no video found on the page. Add a YOUTUBE_API_KEY (see README)');
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
	return { matched, total: items.length, method: key ? 'YouTube API' : 'public page' };
}
