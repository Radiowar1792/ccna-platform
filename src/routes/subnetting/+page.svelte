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
		? [['network', 'Network address'], ['broadcast', 'Broadcast'], ['first', 'First host'], ['last', 'Last host'], ['hosts', 'Usable hosts']]
		: [['mask', 'Mask'], ['wildcard', 'Wildcard'], ['hosts', 'Usable hosts']]) as [keyof typeof f, string][];
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

<svelte:head><title>Subnetting · CCNA Goal</title></svelte:head>

<div class="stack sub">
	<header class="row">
		<h1>Subnetting</h1>
		<span class="spacer"></span>
		<div class="seg">
			<button aria-pressed={mode === 'full'} onclick={() => setMode('full')}>Full subnet</button>
			<button aria-pressed={mode === 'mask'} onclick={() => setMode('mask')}>Masks and wildcards</button>
		</div>
	</header>
	<p class="muted">Goal: a full subnet in under 30 seconds. Do it in your head, without a calculator, like in the exam.</p>

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
			{#if checked}<span class="pill {allGood ? 'green' : 'red'}">{allGood ? `Correct in ${Math.round((Date.now() - start) / 1000)} s` : 'Something is wrong'}</span>{/if}
			<span class="spacer"></span>
			<button class="btn primary">{checked ? 'Next (Enter)' : 'Check (Enter)'}</button>
		</div>
	</form>

	<div class="grid3">
		<div class="card"><span class="small muted">This session</span><span class="mono big">{session.ok}/{session.n}</span><span class="small muted">{avg ? `${avg} s on average` : '—'}</span></div>
		<div class="card"><span class="small muted">Today</span><span class="mono big">{(data.today.ok ?? 0) + 0}/{data.today.n}</span><span class="small muted">correct drills</span></div>
		<div class="card"><span class="small muted">All time</span><span class="mono big">{data.all.n ? Math.round((100 * (data.all.ok ?? 0)) / data.all.n) : 0}%</span><span class="small muted">{data.all.n} drills · {data.all.avg ? Math.round(data.all.avg / 1000) + ' s' : '—'} on average</span></div>
	</div>

	<details class="card flat">
		<summary><b>The fast method</b> <span class="muted small">(explication en français)</span></summary>
		<ol class="small" lang="fr">
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
