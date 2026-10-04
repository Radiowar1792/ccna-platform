// Import de questions QCM au format JSON (fichier ou texte collé). Elles restent dans la base
// de Batiste uniquement : rien n'est ajouté au dépôt public.
import { createHash } from 'node:crypto';
import { db } from './db';
import { ALL_TOPICS } from '$lib/data/topics';

export interface ImportReport { added: number; duplicates: number; errors: string[] }

const LETTERS = 'ABCDEF';

/** Accepte [1], 1, "B", "B,D", ["B","D"] → index des bonnes réponses. */
function parseAnswer(a: unknown, n: number): number[] | null {
	const list = Array.isArray(a) ? a : typeof a === 'string' ? a.split(/[,;\s]+/).filter(Boolean) : [a];
	const out: number[] = [];
	for (const x of list) {
		let i: number;
		if (typeof x === 'number') i = x;
		else if (typeof x === 'string' && /^[A-Fa-f]$/.test(x)) i = LETTERS.indexOf(x.toUpperCase());
		else if (typeof x === 'string' && /^\d+$/.test(x)) i = Number(x);
		else return null;
		if (!(i >= 0 && i < n)) return null;
		if (!out.includes(i)) out.push(i);
	}
	return out.length ? out.sort() : null;
}

export function importQuestions(json: string): ImportReport {
	let data: unknown;
	try {
		data = JSON.parse(json);
	} catch {
		return { added: 0, duplicates: 0, errors: ['The file is not valid JSON.'] };
	}
	const items = Array.isArray(data) ? data : Array.isArray((data as any)?.questions) ? (data as any).questions : null;
	if (!items) return { added: 0, duplicates: 0, errors: ['Expected a JSON array of questions.'] };

	const topics = new Set(ALL_TOPICS.map((t) => t.code));
	const ins = db.prepare(
		'INSERT OR IGNORE INTO questions (seed_key, topic, stem, options, answer, explanation, created_at, source) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
	);
	const report: ImportReport = { added: 0, duplicates: 0, errors: [] };
	const now = new Date().toISOString();
	db.exec('BEGIN');
	try {
		items.forEach((q: any, k: number) => {
			const n = k + 1;
			const stem = String(q.question ?? q.stem ?? '').trim();
			const options = (Array.isArray(q.options) ? q.options : []).map((o: unknown) => String(o).trim()).filter(Boolean);
			const topic = String(q.topic ?? '').trim();
			if (!stem) return void report.errors.push(`#${n}: missing "question".`);
			if (options.length < 2 || options.length > 6) return void report.errors.push(`#${n}: needs 2 to 6 "options".`);
			if (!topics.has(topic)) return void report.errors.push(`#${n}: unknown topic "${topic}" (use a code like 3.4).`);
			const answer = parseAnswer(q.answer, options.length);
			if (!answer) return void report.errors.push(`#${n}: invalid "answer".`);
			// Même énoncé (sans tenir compte des espaces et de la casse) = doublon.
			const key = 'imp-' + createHash('sha1').update(stem.toLowerCase().replace(/\s+/g, ' ')).digest('hex').slice(0, 16);
			const res = ins.run(key, topic, stem, JSON.stringify(options), JSON.stringify(answer), String(q.explanation ?? '').trim(), now, String(q.source ?? 'import').slice(0, 60));
			if (Number(res.changes) > 0) report.added++;
			else report.duplicates++;
		});
		db.exec('COMMIT');
	} catch (e) {
		db.exec('ROLLBACK');
		throw e;
	}
	return report;
}

export function questionSources() {
	return db.prepare("SELECT COALESCE(source, CASE WHEN seed_key LIKE 'q-%' THEN 'built-in' ELSE 'my questions' END) AS source, COUNT(*) AS n FROM questions GROUP BY 1 ORDER BY n DESC").all() as { source: string; n: number }[];
}

export function deleteImported(source: string) {
	return Number(db.prepare('DELETE FROM questions WHERE source = ?').run(source).changes);
}
