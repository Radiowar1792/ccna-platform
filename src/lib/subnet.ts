// Calculs IPv4 pour l'entraînement au subnetting.
export const toInt = (ip: string) => ip.split('.').reduce((a, o) => (a << 8) + Number(o), 0) >>> 0;
export const toIp = (n: number) => [24, 16, 8, 0].map((s) => (n >>> s) & 255).join('.');
export const maskOf = (p: number) => (p === 0 ? 0 : (0xffffffff << (32 - p)) >>> 0);

export function solve(ip: string, prefix: number) {
	const m = maskOf(prefix);
	const net = (toInt(ip) & m) >>> 0;
	const bc = (net | (~m >>> 0)) >>> 0;
	const hosts = prefix >= 31 ? (prefix === 31 ? 2 : 1) : 2 ** (32 - prefix) - 2;
	return {
		network: toIp(net),
		broadcast: toIp(bc),
		first: toIp(prefix >= 31 ? net : net + 1),
		last: toIp(prefix >= 31 ? bc : bc - 1),
		hosts,
		mask: toIp(m),
		wildcard: toIp(~m >>> 0)
	};
}

const r = (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1));

/** Adresse aléatoire réaliste (privée la plupart du temps) et préfixe entre /17 et /30. */
export function randomProblem() {
	const kind = r(0, 3);
	const ip = kind === 0 ? `10.${r(0, 255)}.${r(0, 255)}.${r(1, 254)}` : kind === 1 ? `172.${r(16, 31)}.${r(0, 255)}.${r(1, 254)}` : kind === 2 ? `192.168.${r(0, 255)}.${r(1, 254)}` : `${r(11, 223)}.${r(0, 255)}.${r(0, 255)}.${r(1, 254)}`;
	const prefix = Math.random() < 0.7 ? r(24, 30) : r(17, 23);
	return { ip, prefix };
}

export const sameIp = (a: string, b: string) => a.trim().replace(/\s/g, '') === b;
