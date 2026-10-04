<script lang="ts">
	import { post } from '$lib/api';
	import { ymd } from '$lib/dates';
	let date = $state(ymd());
	let minutes = $state(30);
	let activity = $state('Videos');
	let note = $state('');
	let msg = $state('');
	async function submit(e: SubmitEvent) {
		e.preventDefault();
		try {
			await post('/api/session', { date, minutes, activity, note });
			msg = `${minutes}-minute session saved.`;
			note = '';
		} catch (err) {
			msg = (err as Error).message;
		}
	}
</script>

<form class="sf" onsubmit={submit}>
	<label class="field" for="s-date">Date<input id="s-date" type="date" bind:value={date} required /></label>
	<label class="field" for="s-min">Minutes<input id="s-min" type="number" min="5" max="600" step="5" bind:value={minutes} required /></label>
	<label class="field" for="s-act">Activity
		<select id="s-act" bind:value={activity}>
			{#each ['Videos', 'Packet Tracer labs', 'Netacad', 'Reading / notes', 'Practice exam', 'Other'] as a}<option>{a}</option>{/each}
		</select>
	</label>
	<label class="field wide" for="s-note">Note (optional)<input id="s-note" type="text" bind:value={note} placeholder="e.g. redid the OSPF lab without the solution" /></label>
	<button class="btn primary">Save</button>
	{#if msg}<p class="small muted wide">{msg}</p>{/if}
</form>

<style>
	.sf { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; align-items: end; }
	.wide { grid-column: span 2; }
	@media (max-width: 600px) { .sf { grid-template-columns: 1fr 1fr; } .wide { grid-column: 1 / -1; } }
</style>
