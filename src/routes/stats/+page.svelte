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

<svelte:head><title>Stats · CCNA Goal</title></svelte:head>

<div class="stack">
	<header><h1>Statistics</h1></header>

	<section class="strip">
		<div class="cell"><span class="lbl">Readiness</span><span class="val">{data.readiness}%</span><span class="sub">weighted by exam topics</span></div>
		<div class="cell"><span class="lbl">Quiz</span><span class="val">{qPct}%</span><span class="sub">{qTotal} answers</span></div>
		<div class="cell"><span class="lbl">Flashcards</span><span class="val">{data.totals.reviews}</span><span class="sub">{data.totals.mature}/{data.totals.cards} mature cards (≥ 21 d)</span></div>
		<div class="cell"><span class="lbl">Videos</span><span class="val">{data.totals.videos}/63</span><span class="sub">{Math.round(data.totals.minutes / 60)} h of logged sessions</span></div>
		<div class="cell"><span class="lbl">Streak</span><span class="val">{data.streak} d</span><span class="sub">subnetting: {data.subnet.all.n} drills</span></div>
	</section>

	<div class="card">
		<h3>Consistency since October</h3>
		<Heatmap days={data.heat} weeks={39} />
	</div>

	<div class="grid2">
		<div class="card">
			<h3>Domains: readiness and quiz</h3>
			<p class="small muted">Blue bar = mastered topics, green bar = quiz score. The weight is the share of the domain in the exam.</p>
			{#each DOMAINS as d}
				{@const q = data.quiz[d.id]}
				{@const qp = q ? Math.round((100 * q.ok) / q.n) : 0}
				<div class="dom">
					<div class="row small"><b>{d.id}.0 {d.name}</b><span class="spacer"></span><span class="mono muted">{d.weight}%</span></div>
					<div class="two">
						<div class="bar"><i style="width:{domainReady(d.id)}%"></i></div><span class="mono small">{domainReady(d.id)}%</span>
						<div class="bar green"><i style="width:{qp}%"></i></div><span class="mono small">{q ? qp + '%' : '–'}</span>
					</div>
				</div>
			{/each}
		</div>
		<div class="card">
			<h3>Quiz scores (sets of 5+ questions)</h3>
			<LineChart points={data.attempts.slice(-30)} label="Quiz scores" />
			<h3>Logged time by activity</h3>
			{#if data.byActivity.length}
				{#each data.byActivity as a}
					<div class="act"><span class="small">{a.activity}</span><div class="bar"><i style="width:{(100 * a.m) / maxAct}%"></i></div><span class="mono small">{Math.round(a.m / 6) / 10} h</span></div>
				{/each}
			{:else}<p class="empty">Log your sessions on the home page to see where your time goes.</p>{/if}
		</div>
	</div>

	<div class="card">
		<h3>Practice exams</h3>
		<p class="small muted">Full exams taken in real conditions (Netacad, PDF, Boson…). When you score over 85% on never-seen questions, you are ready.</p>
		<LineChart points={data.mocks.map((m) => ({ date: m.date, v: m.score }))} label="Practice exam scores" />
		<form method="POST" action="?/addMock" class="mock" use:enhance>
			<label class="field" for="m-date">Date<input id="m-date" name="date" type="date" value={ymd()} required /></label>
			<label class="field" for="m-src">Source<select id="m-src" name="source">{#each ['Netacad ENSA – CCNA practice exam', 'Netacad (checkpoint / final)', 'Examsdigest PDF', 'Platform exam mode', 'Boson ExSim', 'Other'] as s}<option>{s}</option>{/each}</select></label>
			<label class="field" for="m-score">Score (%)<input id="m-score" name="score" type="number" min="0" max="100" required /></label>
			<button class="btn primary">Add</button>
		</form>
		{#if form?.error}<p class="flash err">{form.error}</p>{/if}
		{#if data.mocks.length}
			<div class="tablewrap"><table>
				<thead><tr><th>Date</th><th>Source</th><th>Score</th><th></th></tr></thead>
				<tbody>
					{#each [...data.mocks].reverse() as m}
						<tr><td class="num">{fmtShort(m.date)}</td><td>{m.source}</td><td class="num">{m.score}%</td>
							<td><form method="POST" action="?/deleteMock" use:enhance><input type="hidden" name="id" value={m.id} /><button class="btn ghost small danger">Delete</button></form></td></tr>
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
