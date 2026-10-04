<script lang="ts">
	// Barres verticales, simples ou empilées, avec infobulle au survol.
	interface Series { name: string; color: string; values: number[] }
	let {
		labels,
		series,
		unit = '',
		height = 200,
		label = 'Bar chart',
		every = 0,
		target,
		max: fixedMax
	}: { labels: string[]; series: Series[]; unit?: string; height?: number; label?: string; every?: number; target?: number; max?: number } = $props();

	let cw = $state(600);
	let hover = $state<number | null>(null);
	const W = $derived(Math.max(300, cw));
	const l = 36, r = 8, t = 10, b = 24;
	const totals = $derived(labels.map((_, i) => series.reduce((a, s) => a + (s.values[i] || 0), 0)));
	const max = $derived.by(() => {
		if (fixedMax) return fixedMax;
		const m = Math.max(target ?? 0, ...totals, 1);
		const pow = Math.pow(10, Math.floor(Math.log10(m)));
		const n = m / pow;
		return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * pow;
	});
	const ticks = $derived([0, max / 2, max].map((v) => Math.round(v * 10) / 10));
	const bw = $derived((W - l - r) / Math.max(1, labels.length));
	const gap = $derived(Math.min(6, bw * 0.25));
	const y = (v: number) => t + (height - t - b) * (1 - v / max);
	const fmt = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(1));
	const showEvery = $derived(every || Math.max(1, Math.ceil(labels.length / Math.floor(W / 58))));
</script>

<div class="bc" bind:clientWidth={cw}>
	{#if series.length > 1}
		<div class="legend small">{#each series as s}<span><i style="background:{s.color}"></i>{s.name}</span>{/each}</div>
	{/if}
	<svg viewBox="0 0 {W} {height}" style="height:{height}px" role="img" aria-label={label} onmouseleave={() => (hover = null)}>
		{#each ticks as v}
			<line x1={l} x2={W - r} y1={y(v)} y2={y(v)} class="grid" />
			<text x={l - 6} y={y(v) + 4} text-anchor="end" class="tk">{fmt(v)}</text>
		{/each}
		{#if target}
			<line x1={l} x2={W - r} y1={y(target)} y2={y(target)} stroke="var(--green)" stroke-width="1.5" stroke-dasharray="5 4" />
		{/if}
		{#each labels as lab, i}
			{@const x = l + i * bw + gap / 2}
			{@const w = Math.max(1, bw - gap)}
			<g opacity={hover === null || hover === i ? 1 : 0.55}>
				{#each series as s, k}
					{@const below = series.slice(0, k).reduce((a, ss) => a + (ss.values[i] || 0), 0)}
					{@const v = s.values[i] || 0}
					{#if v > 0}
						<rect x={x} y={y(below + v) + (k > 0 ? 1 : 0)} width={w} height={Math.max(0, y(below) - y(below + v) - (k > 0 ? 1 : 0))} fill={s.color} rx={k === series.length - 1 || series.slice(k + 1).every((ss) => !(ss.values[i] > 0)) ? Math.min(3, w / 2) : 0} />
					{/if}
				{/each}
			</g>
			<rect x={l + i * bw} y={t} width={bw} height={height - t - b} fill="transparent" onmouseenter={() => (hover = i)} role="presentation" />
			{#if i % showEvery === 0}<text x={x + w / 2} y={height - 6} text-anchor="middle" class="tk">{lab}</text>{/if}
		{/each}
		<line x1={l} x2={W - r} y1={y(0)} y2={y(0)} class="axis" />
	</svg>
	{#if hover !== null}
		{@const left = Math.min(Math.max(l + hover * bw + bw / 2, 70), W - 70)}
		<div class="tip" style="left:{left}px">
			<b>{labels[hover]}</b>
			{#each series as s}<span><i style="background:{s.color}"></i>{s.name}: {fmt(s.values[hover] || 0)}{unit}</span>{/each}
			{#if series.length > 1}<span class="muted">Total: {fmt(totals[hover])}{unit}</span>{/if}
		</div>
	{/if}
</div>

<style>
	.bc { position: relative; width: 100%; }
	svg { display: block; width: 100%; }
	.grid { stroke: var(--line); stroke-width: 1; }
	.axis { stroke: var(--muted); stroke-width: 1; }
	.tk { font-size: 10px; fill: var(--muted); font-family: var(--f-mono); }
	.legend { display: flex; flex-wrap: wrap; gap: 12px; color: var(--muted); margin-bottom: 4px; }
	.legend span, .tip span { display: inline-flex; align-items: center; gap: 5px; }
	i { width: 10px; height: 10px; border-radius: 2px; display: inline-block; }
	.tip { position: absolute; top: 4px; transform: translateX(-50%); background: var(--panel); border: 1px solid var(--line); border-radius: 6px; padding: 6px 9px; font-size: 12px; display: flex; flex-direction: column; gap: 2px; pointer-events: none; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12); white-space: nowrap; z-index: 2; }
</style>
