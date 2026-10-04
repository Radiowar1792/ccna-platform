// Import d'un paquet Anki (.apkg) : archive zip contenant une base SQLite.
// Gère les exports récents (collection.anki21b compressée en zstd) et anciens (anki21 / anki2).
import { DatabaseSync } from 'node:sqlite';
import { inflateRawSync } from 'node:zlib';
import * as zlib from 'node:zlib';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createEmptyCard } from 'ts-fsrs';
import { db } from './db';

/** Lit les fichiers d'une archive zip (sans dépendance externe). */
function unzip(buf: Buffer): Map<string, Buffer> {
	const files = new Map<string, Buffer>();
	let eocd = -1;
	for (let i = buf.length - 22; i >= Math.max(0, buf.length - 65557); i--) {
		if (buf.readUInt32LE(i) === 0x06054b50) { eocd = i; break; }
	}
	if (eocd < 0) throw new Error('This file is not a valid .apkg (zip) archive.');
	const count = buf.readUInt16LE(eocd + 10);
	let p = buf.readUInt32LE(eocd + 16);
	for (let n = 0; n < count; n++) {
		if (buf.readUInt32LE(p) !== 0x02014b50) break;
		const method = buf.readUInt16LE(p + 10);
		const compSize = buf.readUInt32LE(p + 20);
		const nameLen = buf.readUInt16LE(p + 28);
		const extraLen = buf.readUInt16LE(p + 30);
		const commentLen = buf.readUInt16LE(p + 32);
		const local = buf.readUInt32LE(p + 42);
		const name = buf.toString('utf8', p + 46, p + 46 + nameLen);
		const lNameLen = buf.readUInt16LE(local + 26);
		const lExtraLen = buf.readUInt16LE(local + 28);
		const start = local + 30 + lNameLen + lExtraLen;
		const data = buf.subarray(start, start + compSize);
		if (method === 0) files.set(name, Buffer.from(data));
		else if (method === 8) files.set(name, inflateRawSync(data));
		p += 46 + nameLen + extraLen + commentLen;
	}
	return files;
}

const ENT: Record<string, string> = { '&nbsp;': ' ', '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'" };

/** HTML d'Anki → texte simple (les images et sons sont ignorés). */
function toText(html: string): string {
	return html
		.replace(/\[sound:[^\]]*\]/g, '')
		.replace(/<img[^>]*>/gi, '[image]')
		.replace(/<br\s*\/?>/gi, '\n')
		.replace(/<\/(div|p|li)>/gi, '\n')
		.replace(/<[^>]+>/g, '')
		.replace(/&(nbsp|amp|lt|gt|quot|#39);/g, (m) => ENT[m] ?? m)
		.replace(/\n{3,}/g, '\n\n')
		.trim();
}

const dayFrom = (s: string): number | null => {
	const m = s.match(/day[\s_\-:]*0*(\d{1,2})\b/i);
	const d = m ? Number(m[1]) : NaN;
	return d >= 1 && d <= 63 ? d : null;
};

export interface ImportResult { added: number; skipped: number; deck: string; withDay: number }

export function importApkg(buf: Buffer, deckOverride?: string): ImportResult {
	const files = unzip(buf);
	let sqlite: Buffer | undefined;
	if (files.has('collection.anki21b')) {
		const zstd = (zlib as any).zstdDecompressSync as ((b: Buffer) => Buffer) | undefined;
		if (!zstd) throw new Error('This deck uses the new Anki format (zstd). Update Node.js to version 22.15 or newer.');
		sqlite = zstd(files.get('collection.anki21b')!);
	} else sqlite = files.get('collection.anki21') ?? files.get('collection.anki2');
	if (!sqlite) throw new Error('No Anki collection found in this file.');

	const dir = mkdtempSync(join(tmpdir(), 'apkg-'));
	const path = join(dir, 'collection.db');
	writeFileSync(path, sqlite);
	const src = new DatabaseSync(path, { readOnly: true });
	try {
		// Noms des paquets : table "decks" (format récent) ou JSON dans "col" (ancien format).
		const deckNames = new Map<number, string>();
		const hasDecksTable = (src.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='decks'").get() as any) != null;
		if (hasDecksTable) {
			for (const d of src.prepare('SELECT id, name FROM decks').all() as any[]) deckNames.set(Number(d.id), String(d.name).replace(/\x1f/g, '::'));
		} else {
			const col = src.prepare('SELECT decks FROM col').get() as any;
			for (const d of Object.values(JSON.parse(col?.decks || '{}')) as any[]) deckNames.set(Number(d.id), String(d.name));
		}
		const rows = src.prepare(
			`SELECT n.id AS nid, n.flds, n.tags, MIN(c.did) AS did FROM notes n JOIN cards c ON c.nid = n.id GROUP BY n.id ORDER BY n.id`
		).all() as any[];
		const sample = rows.find((r) => !/^(this file requires|please update)/i.test(toText(String(r.flds).split('\x1f')[0])));
		if (rows.length && !sample) throw new Error('This file needs a newer Anki export. Export again from Anki with "Support older Anki versions" ticked.');

		const now = new Date();
		const iso = now.toISOString();
		const ins = db.prepare(
			'INSERT OR IGNORE INTO cards (seed_key, deck, topic, day, front, back, fsrs, due, created_at, source) VALUES (?, ?, NULL, ?, ?, ?, ?, ?, ?, ?)'
		);
		let added = 0, skipped = 0, withDay = 0;
		let topDeck = deckOverride || '';
		db.exec('BEGIN');
		try {
			for (const r of rows) {
				const [f0 = '', f1 = '', ...rest] = String(r.flds).split('\x1f');
				const front = toText(f0);
				const back = toText([f1, ...rest].filter(Boolean).join('<br>'));
				if (!front || !back) { skipped++; continue; }
				const deckPath = deckNames.get(Number(r.did)) ?? 'Anki';
				const deck = deckOverride || deckPath.split('::')[0] || 'Anki';
				if (!topDeck) topDeck = deck;
				const day = dayFrom(deckPath) ?? dayFrom(String(r.tags || ''));
				if (day) withDay++;
				const res = ins.run(`anki-${r.nid}`, deck, day, front, back, JSON.stringify(createEmptyCard(now)), iso, iso, 'anki');
				if (Number(res.changes) > 0) added++;
				else skipped++;
			}
			db.exec('COMMIT');
		} catch (e) {
			db.exec('ROLLBACK');
			throw e;
		}
		return { added, skipped, deck: topDeck || 'Anki', withDay };
	} finally {
		src.close();
		rmSync(dir, { recursive: true, force: true });
	}
}
