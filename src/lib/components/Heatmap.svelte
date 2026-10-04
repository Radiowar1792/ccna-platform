<script lang="ts">
	// Grille type GitHub : colonnes = semaines (lundi en haut), intensité = volume d'activité.
	import { addDays, fmtShort, parseYmd, ymd } from '$lib/dates';
	let { days, weeks = 26, end = ymd() }: { days: Record<string, number>; weeks?: number; end?: string } = $props();

	const cols = $derived.by(() => {
		const e = parseYmd(end);
		const monday = addDays(e, -((e.getDay() + 6) % 7));
		const first = addDays(monday, -7 * (weeks - 1));
		return Array.from({ length: weeks }, (_, c) =>
			Array.from({ length: 7 }, (_, r) => {
				const d = addDays(first, c * 7 + r);
				const k = ymd(d);
				return { k, v: days[k] ?? 0, future: d > e };
			})
		);
	});
	const level = (v: number) => (v === 0 ? 0 : v < 10 ? 1 : v < 25 ? 2 : v < 50 ? 3 : 4);
</script>

<div class="hm" role="img" aria-label="Activity over the last {weeks} weeks">
	<div class="labels small muted"><span>M</span><span></span><span>W</span><span></span><span>F</span><span></span><span>S</span></div>
	<div class="cols">
		{#each cols as col}
			<div class="col">
				{#each col as cell}
					<span class="sq l{level(cell.v)}" class:future={cell.future} title="{fmtShort(cell.k)} : {cell.v} activity points"></span>
				{/each}
			</div>
		{/each}
	</div>
</div>
<div class="row small muted legend">Less <span class="sq l0"></span><span class="sq l1"></span><span class="sq l2"></span><span class="sq l3"></span><span class="sq l4"></span> More</div>

<style>
	.hm { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 2px; }
	.labels { display: grid; grid-template-rows: repeat(7, 12px); gap: 3px; font-size: 10px; line-height: 12px; }
	.cols { display: flex; gap: 3px; }
	.col { display: grid; grid-template-rows: repeat(7, 12px); gap: 3px; }
	.sq { width: 12px; height: 12px; border-radius: 3px; background: var(--heat-0); display: inline-block; }
	.sq.l1 { background: var(--heat-1); } .sq.l2 { background: var(--heat-2); } .sq.l3 { background: var(--heat-3); } .sq.l4 { background: var(--heat-4); }
	.sq.future { opacity: 0.3; }
	.legend { gap: 4px; }
</style>
