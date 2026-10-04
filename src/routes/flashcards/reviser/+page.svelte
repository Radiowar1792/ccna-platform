<script lang="ts">
	import { post } from '$lib/api';
	import { onMount } from 'svelte';
	let { data } = $props();
	// Local queue: a card rated "Again" comes back at the end of the session.
	let queue = $state([...data.queue]);
	let flipped = $state(false);
	let done = $state(0);
	let again = $state(0);
	let started = Date.now();
	let intervals = $state<Record<number, string> | null>(null);
	const card = $derived(queue[0]);

	async function flip() {
		if (!card || flipped) return;
		flipped = true;
		intervals = null;
		const r = await fetch('/api/review?id=' + card.id);
		intervals = await r.json();
	}
	async function rate(rating: 1 | 2 | 3 | 4) {
		if (!card || !flipped) return;
		const c = card;
		const ms = Date.now() - started;
		queue = queue.slice(1);
		if (rating === 1) { queue = [...queue, c]; again++; } else done++;
		flipped = false;
		started = Date.now();
		await post('/api/review', { cardId: c.id, rating, ms }, false);
	}
	onMount(() => {
		const onKey = (e: KeyboardEvent) => {
			if ((e.target as HTMLElement)?.tagName === 'INPUT') return;
			if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flip(); }
			if (flipped && ['1', '2', '3', '4'].includes(e.key)) rate(Number(e.key) as 1 | 2 | 3 | 4);
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});
	const BTN = [
		{ r: 1, label: 'Again', cls: 'again' },
		{ r: 2, label: 'Hard', cls: 'hard' },
		{ r: 3, label: 'Good', cls: 'good' },
		{ r: 4, label: 'Easy', cls: 'easy' }
	] as const;
</script>

<svelte:head><title>Review · Flashcards</title></svelte:head>

<div class="stack rev">
	<header class="row">
		<a class="btn small ghost" href="/flashcards">← Decks</a>
		<span class="spacer"></span>
		<span class="mono small muted">{data.deck ?? 'All decks'} · {done} done · {queue.length} left</span>
	</header>

	{#if card}
		<button class="fc" class:flipped onclick={flip} aria-label={flipped ? 'Card flipped' : 'Flip the card'}>
			<span class="row small muted"><span class="pill light">{card.deck}</span>{#if card.topic}<span class="mono">{card.topic}</span>{/if}{#if card.state === 0}<span class="pill">New</span>{/if}</span>
			<span class="front">{card.front}</span>
			{#if flipped}
				<hr />
				<span class="back">{card.back}</span>
			{:else}
				<span class="hint small muted">Click or press <kbd>Space</kbd> to show the answer</span>
			{/if}
		</button>
		{#if flipped}
			<div class="rates">
				{#each BTN as b}
					<button class="rate {b.cls}" onclick={() => rate(b.r)}>
						<span>{b.label}</span>
						<span class="mono small">{intervals ? intervals[b.r] : '…'}</span>
						<kbd>{b.r}</kbd>
					</button>
				{/each}
			</div>
		{/if}
	{:else}
		<div class="card done">
			<h2>Session complete</h2>
			<p class="muted">{done} cards reviewed{again ? `, ${again} of them seen twice` : ''}. Come back tomorrow: the algorithm has scheduled your next reviews.</p>
			<div class="row"><a class="btn primary" href="/">Back to home</a><a class="btn" href="/qcm">Take a quiz next</a></div>
		</div>
	{/if}
</div>

<style>
	.rev { max-width: 760px; margin: 0 auto; }
	.fc { background: var(--panel); border: 1px solid var(--line); border-radius: 12px; padding: 22px; min-height: 260px; display: flex; flex-direction: column; gap: 14px; text-align: left; width: 100%; }
	.fc:hover { border-color: var(--muted); }
	.front { font-size: clamp(18px, 3vw, 22px); font-weight: 500; white-space: pre-wrap; }
	.back { font-family: var(--f-mono); font-size: 15px; white-space: pre-wrap; line-height: 1.6; }
	hr { border: 0; border-top: 1px dashed var(--line); margin: 0; width: 100%; }
	.hint { margin-top: auto; }
	.rates { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
	.rate { border: 1px solid var(--line); background: var(--panel); border-radius: 8px; padding: 10px 6px; display: flex; flex-direction: column; align-items: center; gap: 2px; font-weight: 600; }
	.rate kbd { opacity: 0.7; }
	.again { color: var(--danger); } .hard { color: var(--amber); } .good { color: var(--green); } .easy { color: var(--accent); }
	.rate:hover { border-color: currentColor; }
	@media (max-width: 500px) { .rates { grid-template-columns: repeat(2, 1fr); } }
</style>
