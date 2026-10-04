<script lang="ts">
	import WeekCard from '$lib/components/WeekCard.svelte';
	import { WEEKS, weekStart } from '$lib/data/plan';
	import { addDays, fmtShort } from '$lib/dates';
	import { post } from '$lib/api';
	let { data } = $props();
	const phases = $derived.by(() => {
		const out: { phase: string; items: number[] }[] = [];
		WEEKS.forEach((w, i) => {
			if (!out.length || out.at(-1)!.phase !== w.phase) out.push({ phase: w.phase, items: [] });
			out.at(-1)!.items.push(i);
		});
		return out;
	});
	const overall = $derived(Math.round(data.weeks.slice(0, data.current + 1).reduce((a, w) => a + w.pct, 0) / (data.current + 1)));
</script>

<svelte:head><title>Plan · CCNA Goal</title></svelte:head>

<div class="stack">
	<header class="row">
		<h1>Study plan</h1>
		<span class="spacer"></span>
		<span class="muted small">Consistency so far: <b class="mono">{overall}%</b> of tasks done</span>
	</header>

	<div class="layout">
		<div class="stack">
			<div class="row">
				<a class="btn small" href="?w={Math.max(0, data.sel - 1)}" data-sveltekit-noscroll>← Previous</a>
				{#if data.sel !== data.current}<a class="btn small ghost" href="/planning" data-sveltekit-noscroll>This week</a>{/if}
				<span class="spacer"></span>
				<a class="btn small" href="?w={Math.min(WEEKS.length - 1, data.sel + 1)}" data-sveltekit-noscroll>Next →</a>
			</div>
			<WeekCard index={data.sel} solo={data.weeks[data.sel].solo} done={data.done} />
			<div class="card flat">
				<h3>Settings</h3>
				<label class="field" for="exam">Target exam date
					<input id="exam" type="date" value={data.examDate} onchange={(e) => e.currentTarget.value && post('/api/plan', { op: 'examDate', value: e.currentTarget.value })} />
				</label>
				<div class="stack-s">
					<span class="small muted">First weekend (10–11 Oct): the next ones alternate automatically</span>
					<div class="seg">
						<button aria-pressed={data.soloStartsOdd} onclick={() => post('/api/plan', { op: 'soloStartsOdd', value: true })}>With my wife</button>
						<button aria-pressed={!data.soloStartsOdd} onclick={() => post('/api/plan', { op: 'soloStartsOdd', value: false })}>Alone with my son</button>
					</div>
				</div>
			</div>
		</div>

		<div class="weeks">
			{#each phases as ph}
				<div class="phase">{ph.phase}</div>
				{#each ph.items as i}
					{@const w = WEEKS[i]}
					<a class="wk" class:current={i === data.current} class:sel={i === data.sel} href="?w={i}" data-sveltekit-noscroll>
						<span class="n mono">S<b>{i + 1}</b></span>
						<span class="body">
							<span class="t">{w.title}{w.days ? ` · D${w.days[0]}–${w.days[1]}` : ''}</span>
							<span class="d">{fmtShort(weekStart(i))} → {fmtShort(addDays(weekStart(i), 6))}{data.weeks[i].solo ? ' · weekend alone' : ''}</span>
						</span>
						<span class="pct mono" class:full={data.weeks[i].pct === 100}>{data.weeks[i].pct ? data.weeks[i].pct + '%' : '–'}</span>
					</a>
				{/each}
			{/each}
		</div>
	</div>
</div>

<style>
	.layout { display: grid; grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr); gap: 20px; align-items: start; }
	@media (max-width: 1000px) { .layout { grid-template-columns: 1fr; } }
	.weeks { display: flex; flex-direction: column; gap: 4px; }
	.phase { font-family: var(--f-display); font-size: 14px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); margin-top: 10px; }
	.wk { display: grid; grid-template-columns: 40px minmax(0, 1fr) auto; gap: 10px; align-items: center; background: var(--panel); border: 1px solid var(--line); border-radius: var(--r); padding: 8px 10px; color: inherit; text-decoration: none; }
	.wk:hover { border-color: var(--muted); }
	.wk.current { box-shadow: inset 3px 0 0 var(--accent); }
	.wk.sel { border-color: var(--accent); }
	.n { font-size: 11px; color: var(--muted); line-height: 1.1; }
	.n b { display: block; font-size: 16px; color: var(--ink); }
	.body { display: flex; flex-direction: column; min-width: 0; }
	.t { font-weight: 600; font-size: 14px; }
	.d { font-size: 12px; color: var(--muted); }
	.pct { font-size: 12px; color: var(--muted); }
	.pct.full { color: var(--green); font-weight: 600; }
</style>
