<script lang="ts">
	import { WEEKS, tasksFor, weekStart } from '$lib/data/plan';
	import { addDays, fmtShort } from '$lib/dates';
	import { post } from '$lib/api';

	let { index, solo, done }: { index: number; solo: boolean; done: Record<string, string> } = $props();
	const w = $derived(WEEKS[index]);
	const list = $derived(tasksFor(index, solo));
	const pct = $derived(list.length ? Math.round((100 * list.filter((_, k) => done[`${index}:${k}`]).length) / list.length) : 0);
	const tone = $derived(w.kind === 'light' || w.kind === 'maintain' ? 'light' : w.kind === 'exam' || w.kind === 'final' ? 'amber' : '');
	const start = $derived(weekStart(index));
</script>

<div class="card">
	<div class="row">
		<span class="pill {tone}">{w.phase}</span>
		<span class="mono muted small">Semaine {index + 1} · {fmtShort(start)} → {fmtShort(addDays(start, 6))}</span>
	</div>
	<div class="stack-s" style="gap:2px">
		<h2>{w.title}{w.days ? ` · Jours ${w.days[0]}–${w.days[1]}` : ''}</h2>
		<p class="muted">{w.desc}</p>
	</div>
	<div class="row">
		<span class="muted small">Ce week-end :</span>
		<div class="seg" role="group" aria-label="Type de week-end">
			<button aria-pressed={!solo} onclick={() => post('/api/plan', { op: 'solo', week: index, solo: false })}>Avec ma femme</button>
			<button aria-pressed={solo} onclick={() => post('/api/plan', { op: 'solo', week: index, solo: true })}>Seul avec le petit</button>
		</div>
	</div>
	<ul class="tasks">
		{#each list as t, k}
			{@const on = !!done[`${index}:${k}`]}
			<li class="task" class:done={on}>
				<input id="t{index}_{k}" type="checkbox" checked={on} onchange={(e) => post('/api/plan', { op: 'task', week: index, idx: k, on: e.currentTarget.checked })} />
				<label for="t{index}_{k}"><span class="when">{t.when}</span>{t.text}</label>
				{#if t.link}<a class="go small" href={t.link}>Ouvrir</a>{/if}
			</li>
		{/each}
	</ul>
	<div class="row">
		<div class="bar" style="flex:1"><i style="width:{pct}%"></i></div>
		<span class="mono muted small">{pct} %</span>
	</div>
</div>

<style>
	.go { margin-left: auto; white-space: nowrap; padding-top: 2px; }
</style>
