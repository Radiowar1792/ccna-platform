<script lang="ts">
	import { fmtLong, fmtMonth, parseYmd } from '$lib/dates';
	let { data } = $props();
	let selected = $state<string | null>(null);
	const sel = $derived(data.days.find((d) => d.key === (selected ?? data.today)) ?? null);
	const dots = (a: any) => (!a ? [] : [a.videos && 'video', a.cards && 'cards', a.questions && 'qcm', a.minutes && 'session', a.drills && 'subnet'].filter(Boolean));
</script>

<svelte:head><title>Calendar · CCNA Goal</title></svelte:head>

<div class="stack">
	<header class="row">
		<h1 style="text-transform:capitalize">{fmtMonth(parseYmd(data.month))}</h1>
		<span class="spacer"></span>
		<a class="btn small" href="?m={data.prev}" data-sveltekit-noscroll>←</a>
		<a class="btn small" href="/calendrier" data-sveltekit-noscroll>Today</a>
		<a class="btn small" href="?m={data.next}" data-sveltekit-noscroll>→</a>
	</header>

	<div class="legend row small muted">
		<span><i class="k video"></i>Videos</span><span><i class="k lab"></i>Labs</span><span><i class="k long"></i>Long session</span><span><i class="k rest"></i>Light</span><span><i class="k exam"></i>Exam</span>
		<span class="spacer"></span>
		<span>Dots = what you actually did</span>
	</div>

	<div class="cal-wrap">
		<div class="cal">
			{#each ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as h}<div class="h">{h}</div>{/each}
			{#each data.days as d}
				<button class="day" class:out={!d.inMonth} class:today={d.key === data.today} class:sel={d.key === (selected ?? data.today)} onclick={() => (selected = d.key)}>
					<span class="num mono">{d.day}</span>
					{#if d.plan}<span class="plan {d.plan.kind}">{d.plan.label}</span>{/if}
					{#each d.events as e}<span class="ev {e.tone}">{e.label}</span>{/each}
					{#if dots(d.act).length}<span class="dots">{#each dots(d.act) as k}<i class="dot {k}"></i>{/each}</span>{/if}
				</button>
			{/each}
		</div>
	</div>

	{#if sel}
		<div class="card">
			<h3 style="text-transform:capitalize">{fmtLong(sel.key)}</h3>
			{#if sel.plan}<p><span class="muted">Planned:</span> {sel.plan.label}</p>{/if}
			{#each sel.events as e}<p><span class="pill {e.tone === 'red' ? 'red' : e.tone === 'green' ? 'green' : e.tone === 'amber' ? 'amber' : ''}">{e.label}</span></p>{/each}
			{#if sel.act}
				<p class="mono small">{sel.act.videos} video(s) · {sel.act.cards} cards reviewed · {sel.act.questions} questions ({sel.act.qok} correct) · {sel.act.drills} subnetting drills · {sel.act.minutes} min logged</p>
			{:else}
				<p class="muted small">No activity recorded on this day.</p>
			{/if}
		</div>
	{/if}
</div>

<style>
	.cal-wrap { overflow-x: auto; }
	.cal { display: grid; grid-template-columns: repeat(7, minmax(92px, 1fr)); gap: 4px; min-width: 660px; }
	.h { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); padding: 0 4px; }
	.day { background: var(--panel); border: 1px solid var(--line); border-radius: 6px; min-height: 96px; padding: 6px; display: flex; flex-direction: column; gap: 3px; align-items: stretch; text-align: left; }
	.day:hover { border-color: var(--muted); }
	.day.out { opacity: 0.45; }
	.day.today .num { background: var(--accent); color: var(--accent-ink); border-radius: 99px; padding: 0 6px; align-self: flex-start; }
	.day.sel { border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent); }
	.num { font-size: 12px; font-weight: 600; }
	.plan, .ev { font-size: 11px; line-height: 1.25; border-radius: 4px; padding: 2px 5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
	.plan { border-left: 3px solid var(--k); background: var(--panel2); }
	.video { --k: var(--accent); } .lab { --k: #8a63d2; } .long { --k: var(--green); } .rest { --k: var(--led-off); } .review { --k: var(--amber); } .exam { --k: var(--danger); }
	.ev { background: var(--accent-soft); color: var(--accent); font-weight: 600; }
	.ev.week { background: none; color: var(--muted); font-weight: 500; padding-left: 0; }
	.ev.amber { background: var(--amber-soft); color: var(--amber); }
	.ev.green { background: var(--green-soft); color: var(--green); }
	.ev.red { background: var(--danger); color: #fff; }
	.dots { display: flex; gap: 3px; margin-top: auto; }
	.dot { width: 7px; height: 7px; border-radius: 50%; }
	.dot.video { background: var(--accent); } .dot.cards { background: var(--amber); } .dot.qcm { background: var(--green); } .dot.session { background: #8a63d2; } .dot.subnet { background: var(--muted); }
	.legend span { display: inline-flex; gap: 5px; align-items: center; }
	.k { width: 10px; height: 10px; border-radius: 2px; background: var(--k); display: inline-block; }
</style>
