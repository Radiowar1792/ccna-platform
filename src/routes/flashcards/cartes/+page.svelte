<script lang="ts">
	import { enhance } from '$app/forms';
	import { fmtShort } from '$lib/dates';
	let { data } = $props();
	let editing = $state<number | null>(null);
	let q = $state('');
	const shown = $derived(data.cards.filter((c) => !q || (c.front + ' ' + c.back + ' day ' + (c.day ?? '')).toLowerCase().includes(q.toLowerCase())));
	const STATE = ['New', 'Learning', 'Review', 'Relearning'];
</script>

<svelte:head><title>Cards · Flashcards</title></svelte:head>

<div class="stack">
	<header class="row">
		<a class="btn small ghost" href="/flashcards">← Decks</a>
		<h1>Card browser</h1>
		<span class="spacer"></span>
		<div class="seg">
			<a href="/flashcards/cartes" aria-current={!data.deck ? 'page' : undefined}>All</a>
			{#each ['Concepts', 'Commands', 'Tech English', 'Video vocabulary', 'My cards'] as d}<a href="?deck={encodeURIComponent(d)}" aria-current={data.deck === d ? 'page' : undefined}>{d}</a>{/each}
		</div>
	</header>
	<input type="text" placeholder="Search cards… (try: day 17)" bind:value={q} />
	<div class="card">
		<div class="tablewrap"><table>
			<thead><tr><th>Day</th><th>Front</th><th>Back</th><th>State</th><th>Next</th><th></th></tr></thead>
			<tbody>
				{#each shown as c (c.id)}
					{#if editing === c.id}
						<tr><td colspan="6">
							<form method="POST" action="?/save" class="stack-s" use:enhance={() => async ({ update }) => { await update(); editing = null; }}>
								<input type="hidden" name="id" value={c.id} /><input type="hidden" name="topic" value={c.topic ?? ''} /><input type="hidden" name="deck" value={c.deck} />
								<textarea name="front" value={c.front}></textarea>
								<textarea name="back" value={c.back}></textarea>
								<div class="row"><button class="btn primary small">Save</button><button type="button" class="btn small" onclick={() => (editing = null)}>Cancel</button></div>
							</form>
						</td></tr>
					{:else}
						<tr class:susp={c.suspended}>
							<td class="num small">{c.day ?? '—'}</td>
							<td class="cell-text">{c.front}</td>
							<td class="cell-text mono small">{c.back}</td>
							<td class="small">{c.suspended ? 'Suspended' : STATE[c.state]}{c.lapses ? ` · ${c.lapses} lapse${c.lapses > 1 ? 's' : ''}` : ''}</td>
							<td class="num small">{c.state === 0 ? '—' : fmtShort(new Date(c.due))}</td>
							<td class="actions">
								<button class="btn ghost small" onclick={() => (editing = c.id)}>Edit</button>
								<form method="POST" action="?/suspend" use:enhance><input type="hidden" name="id" value={c.id} /><input type="hidden" name="on" value={c.suspended ? '0' : '1'} /><button class="btn ghost small">{c.suspended ? 'Unsuspend' : 'Suspend'}</button></form>
								<form method="POST" action="?/reset" use:enhance><input type="hidden" name="id" value={c.id} /><button class="btn ghost small" title="Make it a new card again">Reset</button></form>
								<form method="POST" action="?/delete" use:enhance><input type="hidden" name="id" value={c.id} /><button class="btn ghost small danger">Delete</button></form>
							</td>
						</tr>
					{/if}
				{/each}
			</tbody>
		</table></div>
	</div>
</div>

<style>
	.cell-text { white-space: pre-wrap; max-width: 340px; }
	.actions { display: flex; flex-wrap: wrap; gap: 2px; justify-content: flex-end; }
	.susp { opacity: 0.5; }
</style>
