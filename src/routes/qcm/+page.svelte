<script lang="ts">
	import { enhance } from '$app/forms';
	import { DOMAINS, ALL_TOPICS } from '$lib/data/topics';
	import { fmtShort } from '$lib/dates';
	let { data, form } = $props();
	let mode = $state('train');
	const total = $derived(Object.values(data.counts).reduce((a, b) => a + b, 0));
</script>

<svelte:head><title>QCM · Objectif CCNA</title></svelte:head>

<div class="stack">
	<header class="row"><h1>QCM</h1><span class="spacer"></span><span class="mono small muted">{total} questions dans la banque</span></header>
	<p class="muted">Questions en anglais, comme à l'examen, avec l'explication en français. Mode Entraînement : correction après chaque question. Mode Examen : chronomètre (72 s par question, le rythme du vrai examen) et correction à la fin.</p>

	<div class="grid2">
		<form class="card" method="POST" action="?/start">
			<h3>Nouveau QCM</h3>
			<label class="field" for="domain">Domaine
				<select id="domain" name="domain">
					<option value="">Tous les domaines</option>
					{#each DOMAINS as d}<option value={d.id} selected={data.preset === d.id}>{d.id}.0 {d.fr} ({data.counts[d.id] ?? 0})</option>{/each}
				</select>
			</label>
			<div class="row">
				<label class="field" for="count" style="flex:1">Questions<input id="count" name="count" type="number" min="5" max="120" value="10" /></label>
				<label class="field" for="pick" style="flex:2">Choix des questions
					<select id="pick" name="pick"><option value="weak">Priorité à mes erreurs et aux inédites</option><option value="random">Au hasard</option></select>
				</label>
			</div>
			<input type="hidden" name="mode" value={mode} />
			<div class="seg" role="group" aria-label="Mode">
				<button type="button" aria-pressed={mode === 'train'} onclick={() => (mode = 'train')}>Entraînement</button>
				<button type="button" aria-pressed={mode === 'exam'} onclick={() => (mode = 'exam')}>Examen chronométré</button>
			</div>
			{#if form?.error}<p class="flash err">{form.error}</p>{/if}
			<button class="btn primary">Commencer</button>
		</form>

		<div class="card">
			<h3>Réussite par domaine</h3>
			{#each DOMAINS as d}
				{@const s = data.byDomain[d.id]}
				{@const pct = s ? Math.round((100 * s.ok) / s.n) : 0}
				<div class="dom">
					<span class="small"><b>{d.id}.0</b> {d.fr}</span>
					<div class="bar" class:green={pct >= 85}><i style="width:{pct}%"></i></div>
					<span class="mono small muted">{s ? `${pct} % · ${s.n}` : '–'}</span>
				</div>
			{/each}
		</div>
	</div>

	{#if data.attempts.length}
		<div class="card">
			<h3>Derniers QCM</h3>
			<div class="tablewrap"><table>
				<thead><tr><th>Date</th><th>Mode</th><th>Domaine</th><th>Score</th><th>Durée</th><th></th></tr></thead>
				<tbody>
					{#each data.attempts as a}
						{@const f = JSON.parse(a.filter ?? '{}')}
						{@const pct = Math.round((100 * a.correct) / a.total)}
						<tr>
							<td class="num">{fmtShort(new Date(a.started_at))}</td>
							<td>{a.mode === 'exam' ? 'Examen' : 'Entraînement'}</td>
							<td>{f.domain ? `${f.domain}.0` : 'Tous'}</td>
							<td class="num"><span class="pill {pct >= 85 ? 'green' : pct >= 70 ? 'amber' : 'red'}">{a.correct}/{a.total} · {pct} %</span></td>
							<td class="num">{Math.round(a.duration_s / 60)} min</td>
							<td><a class="small" href="/qcm/{a.id}">Revoir</a></td>
						</tr>
					{/each}
				</tbody>
			</table></div>
		</div>
	{/if}

	<details class="card">
		<summary><b>Ajouter ma propre question</b> <span class="muted small">(pendant tes cours ou après une erreur à un examen blanc)</span></summary>
		<form method="POST" action="?/add" class="stack-s" use:enhance>
			<label class="field" for="q-topic">Thème<select id="q-topic" name="topic">{#each ALL_TOPICS as t}<option value={t.code}>{t.code} {t.label.slice(0, 60)}</option>{/each}</select></label>
			<label class="field" for="q-stem">Énoncé (en anglais)<textarea id="q-stem" name="stem" required></textarea></label>
			{#each [0, 1, 2, 3, 4] as i}
				<div class="row opt"><input type="checkbox" name="correct" value={i} id="c{i}" aria-label="Réponse {i + 1} correcte" /><input type="text" name="opt{i}" placeholder="Réponse {i + 1}{i > 1 ? ' (facultatif)' : ''}" /></div>
			{/each}
			<label class="field" for="q-exp">Explication (en français)<textarea id="q-exp" name="explanation"></textarea></label>
			{#if form?.addError}<p class="flash err">{form.addError}</p>{/if}
			{#if form?.added}<p class="flash">Question ajoutée.</p>{/if}
			<button class="btn primary">Ajouter la question</button>
		</form>
	</details>
</div>

<style>
	.dom { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr) 70px; gap: 10px; align-items: center; }
	.opt { flex-wrap: nowrap; }
	.opt input[type='checkbox'] { width: 18px; height: 18px; flex: none; accent-color: var(--green); }
	summary { cursor: pointer; }
	details[open] summary { margin-bottom: 8px; }
</style>
