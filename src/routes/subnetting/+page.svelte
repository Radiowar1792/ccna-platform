<script lang="ts">
	import { randomProblem, solve, sameIp } from '$lib/subnet';
	import { post } from '$lib/api';
	let { data } = $props();

	let mode = $state<'full' | 'mask'>('full');
	let p = $state(randomProblem());
	let start = $state(Date.now());
	let checked = $state(false);
	let f = $state({ network: '', broadcast: '', first: '', last: '', hosts: '', mask: '', wildcard: '' });
	let session = $state({ n: 0, ok: 0, times: [] as number[] });
	const sol = $derived(solve(p.ip, p.prefix));
	const fields = $derived(mode === 'full'
		? [['network', 'Adresse réseau'], ['broadcast', 'Broadcast'], ['first', 'Premier hôte'], ['last', 'Dernier hôte'], ['hosts', 'Hôtes utilisables']]
		: [['mask', 'Masque'], ['wildcard', 'Wildcard'], ['hosts', 'Hôtes utilisables']]) as [keyof typeof f, string][];
	const good = (k: keyof typeof f) => (k === 'hosts' ? Number(f.hosts) === sol.hosts : sameIp(f[k], sol[k] as string));
	const allGood = $derived(fields.every(([k]) => good(k)));

	async function check(e: SubmitEvent) {
		e.preventDefault();
		if (checked) return newProblem();
		checked = true;
		const ms = Date.now() - start;
		session.n++;
		if (allGood) { session.ok++; session.times = [...session.times, ms]; }
		await post('/api/subnet', { correct: allGood, ms }, false);
	}
	function newProblem() {
		p = randomProblem();
		f = { network: '', broadcast: '', first: '', last: '', hosts: '', mask: '', wildcard: '' };
		checked = false;
		start = Date.now();
		setTimeout(() => document.getElementById('f-' + fields[0][0])?.focus(), 0);
	}
	function setMode(m: 'full' | 'mask') { mode = m; newProblem(); }
	const avg = $derived(session.times.length ? Math.round(session.times.reduce((a, b) => a + b, 0) / session.times.length / 1000) : null);
</script>

<svelte:head><title>Subnetting · Objectif CCNA</title></svelte:head>

<div class="stack sub">
	<header class="row">
		<h1>Subnetting</h1>
		<span class="spacer"></span>
		<div class="seg">
			<button aria-pressed={mode === 'full'} onclick={() => setMode('full')}>Sous-réseau complet</button>
			<button aria-pressed={mode === 'mask'} onclick={() => setMode('mask')}>Masques et wildcards</button>
		</div>
	</header>
	<p class="muted">Objectif : un sous-réseau complet en moins de 30 secondes. Fais-le de tête, sans calculatrice, comme à l'examen.</p>

	<form class="card" onsubmit={check}>
		<div class="prob mono">{mode === 'full' ? `${p.ip}/${p.prefix}` : `/${p.prefix}`}</div>
		<div class="fields">
			{#each fields as [k, label]}
				<label class="field" for="f-{k}">{label}
					<input id="f-{k}" type="text" inputmode="decimal" autocomplete="off" bind:value={f[k]} class:ok={checked && good(k)} class:ko={checked && !good(k)} readonly={checked} />
					{#if checked && !good(k)}<span class="mono sol">{sol[k]}</span>{/if}
				</label>
			{/each}
		</div>
		<div class="row">
			{#if checked}<span class="pill {allGood ? 'green' : 'red'}">{allGood ? `Juste en ${Math.round((Date.now() - start) / 1000)} s` : 'Il y a une erreur'}</span>{/if}
			<span class="spacer"></span>
			<button class="btn primary">{checked ? 'Suivant (Entrée)' : 'Vérifier (Entrée)'}</button>
		</div>
	</form>

	<div class="grid3">
		<div class="card"><span class="small muted">Cette session</span><span class="mono big">{session.ok}/{session.n}</span><span class="small muted">{avg ? `${avg} s en moyenne` : '—'}</span></div>
		<div class="card"><span class="small muted">Aujourd'hui</span><span class="mono big">{(data.today.ok ?? 0) + 0}/{data.today.n}</span><span class="small muted">exercices justes</span></div>
		<div class="card"><span class="small muted">Depuis le début</span><span class="mono big">{data.all.n ? Math.round((100 * (data.all.ok ?? 0)) / data.all.n) : 0} %</span><span class="small muted">{data.all.n} exercices · {data.all.avg ? Math.round(data.all.avg / 1000) + ' s' : '—'} en moyenne</span></div>
	</div>

	<details class="card flat">
		<summary><b>La méthode rapide</b></summary>
		<ol class="small">
			<li>Trouve l'octet « intéressant » (celui où le masque n'est ni 255 ni 0).</li>
			<li>Taille du bloc = 256 − valeur du masque dans cet octet (ex. /27 → 255.255.255.224 → bloc de 32).</li>
			<li>Adresse réseau = le multiple du bloc juste en dessous de l'adresse (ex. .77 en /27 → .64).</li>
			<li>Broadcast = réseau + bloc − 1 (→ .95). Premier hôte = réseau + 1, dernier = broadcast − 1.</li>
			<li>Hôtes = 2<sup>bits d'hôte</sup> − 2 (/27 → 32 − 2 = 30).</li>
		</ol>
	</details>
</div>

<style>
	.sub { max-width: 860px; margin: 0 auto; }
	.prob { font-size: clamp(28px, 6vw, 42px); font-weight: 600; text-align: center; padding: 10px 0; letter-spacing: 0.02em; }
	.fields { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; }
	.fields input { font-family: var(--f-mono); font-size: 16px; }
	input.ok { border-color: var(--green); background: var(--green-soft); }
	input.ko { border-color: var(--danger); background: var(--danger-soft); }
	.sol { color: var(--green); font-size: 13px; }
	.big { font-size: 26px; font-weight: 600; }
	ol { margin: 8px 0 0; padding-left: 20px; display: flex; flex-direction: column; gap: 4px; }
	summary { cursor: pointer; }
</style>
