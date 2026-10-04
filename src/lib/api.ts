import { invalidateAll } from '$app/navigation';

/** POST JSON vers une route /api, puis recharge les données de la page. */
export async function post<T = unknown>(url: string, body: unknown, refresh = true): Promise<T> {
	const r = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
	if (!r.ok) throw new Error(await r.text());
	const data = r.headers.get('content-type')?.includes('json') ? await r.json() : null;
	if (refresh) await invalidateAll();
	return data as T;
}
