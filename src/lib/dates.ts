// Dates "jour" au format YYYY-MM-DD, en heure locale (TZ=Europe/Paris côté serveur).
export function ymd(d: Date = new Date()): string {
	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, '0');
	const day = String(d.getDate()).padStart(2, '0');
	return `${y}-${m}-${day}`;
}

export function parseYmd(s: string): Date {
	return new Date(s + 'T00:00:00');
}

export function addDays(d: Date, n: number): Date {
	const r = new Date(d);
	r.setDate(r.getDate() + n);
	return r;
}

const short = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' });
const long = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
const month = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' });

export const fmtShort = (d: Date | string) => short.format(typeof d === 'string' ? parseYmd(d) : d);
export const fmtLong = (d: Date | string) => long.format(typeof d === 'string' ? parseYmd(d) : d);
export const fmtMonth = (d: Date) => month.format(d);
