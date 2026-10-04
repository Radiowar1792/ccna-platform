// Base SQLite intégrée à Node (node:sqlite) : aucun module natif à compiler.
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { env } from '$env/dynamic/private';
import { createEmptyCard } from 'ts-fsrs';
import { SEED_CARDS } from '$lib/data/cards';
import { SEED_QUESTIONS } from '$lib/data/questions';
import { COURSE } from '$lib/data/videos';

const path = resolve(env.DATABASE_PATH || './data/ccna.db');
mkdirSync(dirname(path), { recursive: true });

export const db = new DatabaseSync(path);
db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 3000;');

// Migrations versionnées : ajoute une entrée au tableau pour faire évoluer le schéma.
const MIGRATIONS: string[] = [
	`
	CREATE TABLE settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
	CREATE TABLE task_done (week INTEGER NOT NULL, idx INTEGER NOT NULL, done_at TEXT NOT NULL, PRIMARY KEY (week, idx));
	CREATE TABLE week_solo (week INTEGER PRIMARY KEY, solo INTEGER NOT NULL);
	CREATE TABLE topic_status (code TEXT PRIMARY KEY, status INTEGER NOT NULL DEFAULT 0, note TEXT NOT NULL DEFAULT '', updated_at TEXT);
	CREATE TABLE videos (day INTEGER PRIMARY KEY, title TEXT NOT NULL, youtube_id TEXT, watched_at TEXT);
	CREATE TABLE cards (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		seed_key TEXT UNIQUE,
		deck TEXT NOT NULL,
		topic TEXT,
		front TEXT NOT NULL,
		back TEXT NOT NULL,
		fsrs TEXT NOT NULL,
		due TEXT NOT NULL,
		suspended INTEGER NOT NULL DEFAULT 0,
		created_at TEXT NOT NULL
	);
	CREATE INDEX cards_due ON cards(due);
	CREATE TABLE reviews (id INTEGER PRIMARY KEY AUTOINCREMENT, card_id INTEGER NOT NULL REFERENCES cards(id) ON DELETE CASCADE, rating INTEGER NOT NULL, reviewed_at TEXT NOT NULL, ms INTEGER);
	CREATE TABLE questions (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		seed_key TEXT UNIQUE,
		topic TEXT NOT NULL,
		stem TEXT NOT NULL,
		options TEXT NOT NULL,
		answer TEXT NOT NULL,
		explanation TEXT NOT NULL DEFAULT '',
		created_at TEXT NOT NULL
	);
	CREATE TABLE quiz_attempts (id INTEGER PRIMARY KEY AUTOINCREMENT, mode TEXT NOT NULL, filter TEXT, started_at TEXT NOT NULL, finished_at TEXT, total INTEGER NOT NULL, correct INTEGER NOT NULL DEFAULT 0, duration_s INTEGER);
	CREATE TABLE quiz_answers (attempt_id INTEGER NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE, question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE, chosen TEXT NOT NULL, correct INTEGER NOT NULL, answered_at TEXT NOT NULL, PRIMARY KEY (attempt_id, question_id));
	CREATE TABLE mock_exams (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT NOT NULL, source TEXT NOT NULL, score INTEGER NOT NULL);
	CREATE TABLE study_sessions (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT NOT NULL, minutes INTEGER NOT NULL, activity TEXT NOT NULL, note TEXT NOT NULL DEFAULT '');
	CREATE TABLE subnet_drills (id INTEGER PRIMARY KEY AUTOINCREMENT, at TEXT NOT NULL, correct INTEGER NOT NULL, ms INTEGER NOT NULL);
	`
];

function migrate() {
	const row = db.prepare('PRAGMA user_version').get() as { user_version: number };
	let v = row.user_version;
	while (v < MIGRATIONS.length) {
		db.exec('BEGIN');
		try {
			db.exec(MIGRATIONS[v]);
			v++;
			db.exec(`PRAGMA user_version = ${v}`);
			db.exec('COMMIT');
		} catch (e) {
			db.exec('ROLLBACK');
			throw e;
		}
	}
}

/** Ajoute le contenu de départ sans jamais écraser ce que tu as modifié. */
function seed() {
	const now = new Date();
	const iso = now.toISOString();
	const insCard = db.prepare(
		'INSERT OR IGNORE INTO cards (seed_key, deck, topic, front, back, fsrs, due, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
	);
	const insQ = db.prepare(
		'INSERT OR IGNORE INTO questions (seed_key, topic, stem, options, answer, explanation, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
	);
	const insV = db.prepare('INSERT OR IGNORE INTO videos (day, title) VALUES (?, ?)');
	db.exec('BEGIN');
	for (const c of SEED_CARDS) {
		const card = createEmptyCard(now);
		insCard.run(c.key, c.deck, c.topic, c.front, c.back, JSON.stringify(card), iso, iso);
	}
	for (const q of SEED_QUESTIONS) {
		insQ.run(q.key, q.topic, q.stem, JSON.stringify(q.options), JSON.stringify(q.answer), q.explanation, iso);
	}
	for (const v of COURSE) insV.run(v.day, v.title);
	db.exec('COMMIT');
}

migrate();
seed();

export function getSetting(key: string, fallback: string): string {
	const r = db.prepare('SELECT value FROM settings WHERE key = ?').get(key) as { value: string } | undefined;
	return r ? r.value : fallback;
}

export function setSetting(key: string, value: string) {
	db.prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value').run(key, value);
}
