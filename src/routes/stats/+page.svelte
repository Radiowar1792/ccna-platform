<script lang="ts">
	import { enhance } from '$app/forms';
	import Heatmap from '$lib/components/Heatmap.svelte';
	import LineChart from '$lib/components/LineChart.svelte';
	import { DOMAINS } from '$lib/data/topics';
	import { fmtShort, ymd } from '$lib/dates';
	let { data, form } = $props();
	const qTotal = $derived(data.totals.answers.n ?? 0);
	const qPct = $derived(qTotal ? Math.round((100 * (data.totals.answers.ok ?? 0)) / qTotal) : 0);
	const maxAct = $derived(Math.max(1, ...data.byActivity.map((a) => a.m)));
	const domainReady = (id: string) => {
		const d = DOMAINS.find((x) => x.id === id)!;
		const s = d.topics.reduce((a, [c]) => a + ((data.topics[c]?.status ?? 0) === 2 ? 1 : (data.topics[c]?.status ?? 0) === 1 ? 0.4 : 0), 0);
		return Math.round((100 * s) / d.topics.length);
	};
</script>

<svelte:head><title>Statistiques · Objectif CCNA</title></svelte:head>

<div class="stack">
	<header><h1>Statistiques</h1></header>

	<section class="strip">
		<div class="cell"><span class="lbl">Préparation</span><span class="val">{data.readiness} %</span><span class="sub">thèmes pondérés</span></div>
		<div class="cell"><span class="lbl">QCM</span><span class="val">{qPct} %</span><span class="sub">{qTotal} réponses</span></div>
		<div class="cell"><span class="lbl">Flashcards</span><span class="val">{data.totals.reviews}</span><span class="sub">{data.totals.mature}/{data.totals.cards} cartes solides (≥ 21 j)</span></div>
		<div class="cell"><span class="lbl">Vidéos</span><span class="val">{data.totals.videos}/63</span><span class="sub">{Math.round(data.totals.minutes / 60)} h de sessions notées</span></div>
		<div class="cell"><span class="lbl">Série</span><span class="val">{data.streak} j</span><span class="sub">subnetting : {data.subnet.all.n} exercices</span></div>
	</section>

	<div class="card">
		<h3>Régularité depuis octobre</h3>
		<Heatmap days={data.heat} weeks={39} />
	</div>

	<div class="grid2">
		<div class="card">
			<h3>Domaines : préparation et QCM</h3>
			<p class="small muted">Barre bleue = thèmes maîtrisés, barre verte = réussite aux QCM. Le poids indique la part du domaine à l'examen.</p>
			{#each DOMAINS as d}
				{@const q = data.quiz[d.id]}
				{@const qp = q ? Math.round((100 * q.ok) / q.n) : 0}
				<div class="dom">
					<div class="row small"><b>{d.id}.0 {d.fr}</b><span class="spacer"></span><span class="mono muted">{d.weight} %</span></div>
					<div class="two">
						<div class="bar"><i style="width:{domainReady(d.id)}%"></i></div><span class="mono small">{domainReady(d.id)} %</span>
						<div class="bar green"><i style="width:{qp}%"></i></div><span class="mono small">{q ? qp + ' %' : '–'}</span>
					</div>
				</div>
			{/each}
		</div>
		<div class="card">
			<h3>Scores aux QCM (séries de 5 questions et plus)</h3>
			<LineChart points={data.attempts.slice(-30)} label="Scores aux QCM" />
			<h3>Temps noté par activité</h3>
			{#if data.byActivity.length}
				{#each data.byActivity as a}
					<div class="act"><span class="small">{a.activity}</span><div class="bar"><i style="width:{(100 * a.m) / maxAct}%"></i></div><span class="mono small">{Math.round(a.m / 6) / 10} h</span></div>
				{/each}
			{:else}<p class="empty">Note tes sessions depuis l'accueil pour voir où passe ton temps.</p>{/if}
		</div>
	</div>

	<div class="card">
		<h3>Examens blancs</h3>
		<p class="small muted">Examens complets faits en conditions réelles (Netacad, PDF, Boson…). Quand tu dépasses 85 % sur des questions jamais vues, tu es prêt.</p>
		<LineChart points={data.mocks.map((m) => ({ date: m.date, v: m.score }))} label="Scores aux examens blancs" />
		<form method="POST" action="?/addMock" class="mock" use:enhance>
			<label class="field" for="m-date">Date<input id="m-date" name="date" type="date" value={ymd()} required /></label>
			<label class="field" for="m-src">Source<select id="m-src" name="source">{#each ['Netacad ENSA – examen blanc CCNA', 'Netacad (checkpoint / final)', 'PDF Examsdigest', 'Mode examen de la plateforme', 'Boson ExSim', 'Autre'] as s}<option>{s}</option>{/each}</select></label>
			<label class="field" for="m-score">Score (%)<input id="m-score" name="score" type="number" min="0" max="100" required /></label>
			<button class="btn primary">Ajouter</button>
		</form>
		{#if form?.error}<p class="flash err">{form.error}</p>{/if}
		{#if data.mocks.length}
			<div class="tablewrap"><table>
				<thead><tr><th>Date</th><th>Source</th><th>Score</th><th></th></tr></thead>
				<tbody>
					{#each [...data.mocks].reverse() as m}
						<tr><td class="num">{fmtShort(m.date)}</td><td>{m.source}</td><td class="num">{m.score} %</td>
							<td><form method="POST" action="?/deleteMock" use:enhance><input type="hidden" name="id" value={m.id} /><button class="btn ghost small danger">Supprimer</button></form></td></tr>
					{/each}
				</tbody>
			</table></div>
		{/if}
	</div>
</div>

<style>
	.dom { display: flex; flex-direction: column; gap: 4px; padding: 6px 0; border-top: 1px solid var(--line); }
	.dom:first-of-type { border-top: 0; }
	.two { display: grid; grid-template-columns: minmax(0, 1fr) 46px; gap: 4px 10px; align-items: center; }
	.act { display: grid; grid-template-columns: 140px minmax(0, 1fr) 50px; gap: 10px; align-items: center; }
	.mock { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; align-items: end; }
	@media (max-width: 640px) { .mock { grid-template-columns: 1fr 1fr; } }
</style>
