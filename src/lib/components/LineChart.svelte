<script lang="ts">
	// Courbe(s) dans le temps avec ligne d'objectif et infobulle au survol.
	import { fmtShort } from '$lib/dates';
	interface Pt { date: string; v: number }
	interface Line { name: string; color: string; points: Pt[] }
	let {
		points = [],
		lines,
		target,
		label = 'Line chart',
		max = 100,
		unit = '%',
		height = 220,
		area = true
	}: { points?: Pt[]; lines?: Line[]; target?: number; label?: string; max?: number; unit?: string; height?: number; area?: boolean } = $props();

	const all = $derived<Line[]>(lines ?? [{ name: label, color: 'var(--accent)', points }]);
	const n = $derived(Math.max(0, ...all.map((s) => s.points.length)));
	let cw = $state(640);
	let hover = $state<number | null>(null);
	const W = $derived(Math.max(320, cw));
	const l = 40, r = 16, t = 14, b = 30;
	const y = (v: number) => t + (height - t - b) * (1 - v / max);
	const xs = $derived((i: number) => (n <= 1 ? (l + W - r) / 2 : l + 10 + ((W - r - l - 20) * i) / (n - 1)));
	const path = (pts: Pt[]) => pts.map((p, i) => `${i ? 'L' : 'M'}${xs(i)} ${y(p.v)}`).join('');
	const tickVals = $derived([0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(max * f)));
	const labelEvery = $derived(Math.max(1, Math.ceil(n / Math.floor(W / 60))));
	const ref = $derived(all.reduce((a, s) => (s.points.length > a.length ? s.points : a), [] as Pt[]));
	function move(e: MouseEvent) {
		if (!n) return;
		const rect = (e.currentTarget as SVGElement).getBoundingClientRect();
		const x = ((e.clientX - rect.left) / rect.width) * W;
		let best = 0, bd = Infinity;
		for (let i = 0; i < n; i++) { const d = Math.abs(xs(i) - x); if (d < bd) { bd = d; best = i; } }
		hover = best;
	}
</script>

<div class="chart" bind:clientWidth={cw}>
	{#if all.length > 1}
		<div class="legend small">{#each all as s}<span><i style="background:{s.color}"></i>{s.name}</span>{/each}</div>
	{/if}
	<svg viewBox="0 0 {W} {height}" style="height:{height}px" role="img" aria-label={label} onmousemove={move} onmouseleave={() => (hover = null)}>
		{#each tickVals as v}
			<line x1={l} x2={W - r} y1={y(v)} y2={y(v)} stroke="var(--line)" />
			<text x={l - 6} y={y(v) + 4} text-anchor="end" class="tk">{v}</text>
		{/each}
		{#if target !== undefined}
			<line x1={l} x2={W - r} y1={y(target)} y2={y(target)} stroke="var(--green)" stroke-width="1.5" stroke-dasharray="5 4" />
			<text x={W - r} y={y(target) - 5} text-anchor="end" class="tk" fill="var(--green)">goal {target}{unit}</text>
		{/if}
		{#if n === 0}
			<text x={(l + W - r) / 2} y={height / 2 + 10} text-anchor="middle" class="empty-t">No data yet</text>
		{:else}
			{#each all as s}
				{#if s.points.length > 1}
					{#if area && all.length === 1}<path d="{path(s.points)}L{xs(s.points.length - 1)} {y(0)}L{xs(0)} {y(0)}Z" fill="var(--accent-soft)" opacity="0.7" />{/if}
					<path d={path(s.points)} fill="none" stroke={s.color} stroke-width="2" stroke-linejoin="round" />
				{/if}
				{#each s.points as p, i}
					{#if s.points.length <= 40 || i === s.points.length - 1}
						<circle cx={xs(i)} cy={y(p.v)} r={i === s.points.length - 1 ? 4.5 : 3} fill={target !== undefined && p.v >= target && all.length === 1 ? 'var(--green)' : s.color} stroke="var(--panel)" stroke-width="2" />
					{/if}
				{/each}
			{/each}
			{#each ref as p, i}
				{#if i % labelEvery === 0}<text x={xs(i)} y={height - 10} text-anchor="middle" class="tk">{fmtShort(p.date)}</text>{/if}
			{/each}
			{#if hover !== null}<line x1={xs(hover)} x2={xs(hover)} y1={t} y2={height - b} stroke="var(--muted)" stroke-dasharray="3 3" />{/if}
		{/if}
	</svg>
	{#if hover !== null && ref[hover]}
		<div class="tip" style="left:{Math.min(Math.max((xs(hover) / W) * cw, 70), cw - 70)}px">
			<b>{fmtShort(ref[hover].date)}</b>
			{#each all as s}{#if s.points[hover]}<span><i style="background:{s.color}"></i>{all.length > 1 ? s.name + ': ' : ''}{s.points[hover].v}{unit}</span>{/if}{/each}
		</div>
	{/if}
</div>

<style>
	.chart { position: relative; width: 100%; }
	svg { display: block; width: 100%; min-width: 300px; }
	.tk { font-size: 10px; fill: var(--muted); font-family: var(--f-mono); }
	.empty-t { font-size: 13px; fill: var(--muted); }
	.legend { display: flex; flex-wrap: wrap; gap: 12px; color: var(--muted); margin-bottom: 4px; }
	.legend span, .tip span { display: inline-flex; align-items: center; gap: 5px; }
	i { width: 10px; height: 3px; border-radius: 2px; display: inline-block; }
	.tip { position: absolute; top: 4px; transform: translateX(-50%); background: var(--panel); border: 1px solid var(--line); border-radius: 6px; padding: 6px 9px; font-size: 12px; display: flex; flex-direction: column; gap: 2px; pointer-events: none; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12); white-space: nowrap; z-index: 2; }
</style>
