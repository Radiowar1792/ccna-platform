<script lang="ts">
	import { enhance } from '$app/forms';
	import BarChart from '$lib/components/BarChart.svelte';
	import { ALL_TOPICS } from '$lib/data/topics';
	import { fmtShort } from '$lib/dates';
	let { data, form } = $props();
	const totalDue = $derived(data.decks.reduce((a, d) => a + Number(d.due), 0));
	const totalNew = $derived(data.decks.reduce((a, d) => a + Number(d.new), 0));
	const totalLocked = $derived(data.decks.reduce((a, d) => a + Number(d.locked), 0));
	const todayNew = $derived(Math.min(totalNew, data.newLeft));
	const next7 = $derived(data.forecast.slice(1, 8).reduce((a, x) => a + x.n, 0));
</script>

<svelte:head><title>Flashcards · CCNA Goal</title></svelte:head>

<div class="stack">
	<header class="row">
		<h1>Flashcards</h1>
		<span class="spacer"></span>
		<a class="btn" href="/flashcards/cartes">Browse cards</a>
		<a class="btn primary" href="/flashcards/reviser">Study now{totalDue + todayNew ? ` (${totalDue + todayNew})` : ''}</a>
	</header>

	<section class="strip" aria-label="Today">
		<div class="cell"><span class="lbl">Due today</span><span class="val">{totalDue}</span><span class="sub">reviews</span></div>
		<div class="cell"><span class="lbl">New today</span><span class="val">{todayNew}</span><span class="sub">{data.settings.newPerDay} new cards per day</span></div>
		<div class="cell"><span class="lbl">Locked</span><span class="val">{totalLocked}</span><span class="sub">unlock when you watch the video</span></div>
		<div class="cell"><span class="lbl">Next 7 days</span><span class="val">{next7}</span><span class="sub">reviews coming</span></div>
		<div class="cell"><span class="lbl">Retention goal</span><span class="val">{Math.round(data.settings.retention * 100)}%</span><span class="sub">FSRS, like Anki</span></div>
	</section>

	<p class="muted small">Works like Anki: each Day of Jeremy's course has its own cards. They unlock when you tick the video as watched, then FSRS schedules every review. Study a little every day and you never need Anki.</p>

	<div class="grid3">
		{#each data.decks as d}
			<div class="card">
				<h3>{d.deck}</h3>
				<div class="row mono small">
					<span class="pill amber">{d.due} due</span>
					<span class="pill">{d.new} new</span>
					{#if Number(d.locked)}<span class="pill light">{d.locked} locked</span>{/if}
					<span class="muted">{d.total} cards</span>
				</div>
				<a class="btn small" href="/flashcards/reviser?deck={encodeURIComponent(d.deck)}">Study this deck</a>
			</div>
		{/each}
	</div>

	<div class="grid2">
		<div class="card">
			<h3>Review forecast, next 30 days</h3>
			<BarChart labels={data.forecast.map((x, i) => (i === 0 ? 'Today' : fmtShort(x.d)))} series={[{ name: 'Reviews due', color: 'var(--s1)', values: data.forecast.map((x) => x.n) }]} label="Reviews due per day for the next 30 days" />
		</div>
		<div class="card">
			<h3>Cards reviewed, last 14 days</h3>
			<BarChart labels={data.last14.map((x) => fmtShort(x.d))} series={[{ name: 'Cards reviewed', color: 'var(--s3)', values: data.last14.map((x) => x.n) }]} label="Cards reviewed per day" />
		</div>
	</div>

	<div class="grid2">
		<form class="card" method="POST" action="?/settings" use:enhance={() => async ({ update }) => update({ reset: false })}>
			<h3>Options</h3>
			<label class="field" for="npd">New cards per day<input id="npd" name="newPerDay" type="number" min="0" max="200" value={data.settings.newPerDay} /></label>
			<label class="field" for="ret">Desired retention (%) <span class="small">90 is the Anki default. Higher = more reviews.</span><input id="ret" name="retention" type="number" min="70" max="97" value={Math.round(data.settings.retention * 100)} /></label>
			<label class="row small" style="gap:8px"><input type="checkbox" name="unlock" checked={data.settings.unlockByVideo} style="width:18px;height:18px" /> Unlock a Day's cards only after its video is watched</label>
			{#if form?.savedSettings}<p class="flash">Options saved.</p>{/if}
			<button class="btn primary">Save options</button>
		</form>

		<form class="card" method="POST" action="?/import" enctype="multipart/form-data" use:enhance>
			<h3>Import an Anki deck (.apkg)</h3>
			<p class="small muted">For example Jeremy's official CCNA deck. Cards in sub-decks or tags named "Day 12" are linked to that video automatically. Images and sounds are not imported.</p>
			<label class="field" for="apkg">File<input id="apkg" name="file" type="file" accept=".apkg,.colpkg" required /></label>
			<label class="field" for="ideck">Deck name (optional)<input id="ideck" name="deck" type="text" placeholder="Keep the name from Anki" /></label>
			{#if form?.importError}<p class="flash err">{form.importError}</p>{/if}
			{#if form?.imported}<p class="flash">{form.imported.added} cards added to "{form.imported.deck}" ({form.imported.withDay} linked to a Day, {form.imported.skipped} skipped).</p>{/if}
			<button class="btn primary">Import</button>
		</form>
	</div>

	<form class="card" method="POST" action="?/add" use:enhance>
		<h3>Add a card</h3>
		<div class="grid2">
			<label class="field" for="front">Front<textarea id="front" name="front" required style="min-height:60px"></textarea></label>
			<label class="field" for="back">Back<textarea id="back" name="back" required style="min-height:60px"></textarea></label>
		</div>
		<div class="row">
			<label class="field" for="deck" style="flex:1">Deck
				<select id="deck" name="deck">{#each ['My cards', 'Concepts', 'Commands', 'Tech English', 'Video vocabulary'] as d}<option>{d}</option>{/each}</select>
			</label>
			<label class="field" for="day" style="flex:0 0 110px">Day (optional)<input id="day" name="day" type="number" min="1" max="63" /></label>
			<label class="field" for="topic" style="flex:2">Topic
				<select id="topic" name="topic"><option value="">—</option>{#each ALL_TOPICS as t}<option value={t.code}>{t.code} {t.label.slice(0, 50)}</option>{/each}</select>
			</label>
		</div>
		{#if form?.error}<p class="flash err">{form.error}</p>{/if}
		{#if form?.added}<p class="flash">Card added.</p>{/if}
		<button class="btn primary">Add</button>
	</form>
</div>
