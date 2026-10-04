<script lang="ts">
	// Courbe de scores (0–100 %) avec ligne d'objectif.
	import { fmtShort } from '$lib/dates';
	let { points, target = 85, label = 'Scores' }: { points: { date: string; v: number }[]; target?: number; label?: string } = $props();
	let cw = $state(640);
	const W = $derived(Math.max(320, cw));
	const H = 220, l = 40, r = 16, t = 14, b = 34;
	const y = (v: number) => t + (H - t - b) * (1 - v / 100);
	const xs = $derived((i: number) => (points.length === 1 ? (l + W - r) / 2 : l + 12 + ((W - r - l - 24) * i) / (points.length - 1)));
	const path = $derived(points.map((p, i) => `${i ? 'L' : 'M'}${xs(i)} ${y(p.v)}`).join(''));
</script>

<div class="chart" bind:clientWidth={cw}>
	<svg viewBox="0 0 {W} {H}" role="img" aria-label={label}>
		{#each [0, 25, 50, 75, 100] as v}
			<line x1={l} x2={W - r} y1={y(v)} y2={y(v)} stroke="var(--line)" />
			<text x={l - 6} y={y(v) + 4} text-anchor="end" class="tk">{v}</text>
		{/each}
		<line x1={l} x2={W - r} y1={y(target)} y2={y(target)} stroke="var(--green)" stroke-width="1.5" stroke-dasharray="5 4" />
		<text x={W - r} y={y(target) - 5} text-anchor="end" class="tk" fill="var(--green)">goal {target}%</text>
		{#if points.length === 0}
			<text x={(l + W - r) / 2} y={H / 2 + 10} text-anchor="middle" class="empty-t">No data yet</text>
		{:else}
			{#if points.length > 1}
				<path d="{path}L{xs(points.length - 1)} {y(0)}L{xs(0)} {y(0)}Z" fill="var(--accent-soft)" opacity="0.7" />
				<path d={path} fill="none" stroke="var(--accent)" stroke-width="2" />
			{/if}
			{#each points as p, i}
				<circle cx={xs(i)} cy={y(p.v)} r={i === points.length - 1 ? 5 : 3.5} fill={p.v >= target ? 'var(--green)' : 'var(--accent)'} stroke="var(--panel)" stroke-width="1.5" />
				{#if points.length <= Math.floor(W / 60) || i % Math.ceil(points.length / Math.floor(W / 60)) === 0}
					<text x={xs(i)} y={H - 12} text-anchor="middle" class="tk">{fmtShort(p.date)}</text>
				{/if}
				{#if i === points.length - 1}<text x={xs(i)} y={y(p.v) - 10} text-anchor="middle" class="val">{p.v}%</text>{/if}
			{/each}
		{/if}
	</svg>
</div>

<style>
	.chart { overflow-x: auto; }
	svg { display: block; width: 100%; height: 220px; min-width: 320px; }
	.tk { font-size: 11px; fill: var(--muted); font-family: var(--f-mono); }
	.val { font-size: 12px; font-weight: 600; fill: var(--ink); font-family: var(--f-mono); }
	.empty-t { font-size: 13px; fill: var(--muted); }
</style>
