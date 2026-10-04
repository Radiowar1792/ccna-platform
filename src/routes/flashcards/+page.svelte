<script lang="ts">
	import { enhance } from '$app/forms';
	import { ALL_TOPICS } from '$lib/data/topics';
	import { fmtShort } from '$lib/dates';
	let { data, form } = $props();
	const totalDue = $derived(data.decks.reduce((a, d) => a + Number(d.due), 0));
	const max = $derived(Math.max(10, ...data.last14.map((x) => x.n)));
</script>

<svelte:head><title>Flashcards · Objectif CCNA</title></svelte:head>

<div class="stack">
	<header class="row">
		<h1>Flashcards</h1>
		<span class="spacer"></span>
		<a class="btn" href="/flashcards/cartes">Gérer les cartes</a>
		<a class="btn primary" href="/flashcards/reviser">Réviser tout{totalDue ? ` (${totalDue})` : ''}</a>
	</header>
	<p class="muted">Répétition espacée avec l'algorithme FSRS, le même que celui d'Anki. Chaque jour : les cartes dues + 15 nouvelles cartes maximum.</p>

	<div class="grid3">
		{#each data.decks as d}
			<div class="card">
				<h3>{d.deck}</h3>
				<div class="row mono small">
					<span class="pill amber">{d.due} dues</span>
					<span class="pill">{d.new} nouvelles</span>
					<span class="muted">{d.total} cartes</span>
				</div>
				<a class="btn small" href="/flashcards/reviser?deck={encodeURIComponent(d.deck)}">Réviser ce paquet</a>
			</div>
		{/each}
	</div>

	<div class="grid2">
		<div class="card">
			<h3>Cartes révisées, 14 derniers jours</h3>
			<div class="bars" role="img" aria-label="Cartes révisées par jour">
				{#each data.last14 as b}
					<div class="b" title="{fmtShort(b.d)} : {b.n}"><i style="height:{(100 * b.n) / max}%"></i><span class="mono">{b.n || ''}</span></div>
				{/each}
			</div>
			<div class="row small muted"><span>{fmtShort(data.last14[0].d)}</span><span class="spacer"></span><span>aujourd'hui</span></div>
		</div>
		<form class="card" method="POST" action="?/add" use:enhance>
			<h3>Ajouter une carte</h3>
			<label class="field" for="front">Recto (question, en anglais de préférence)<textarea id="front" name="front" required style="min-height:60px"></textarea></label>
			<label class="field" for="back">Verso (réponse)<textarea id="back" name="back" required style="min-height:60px"></textarea></label>
			<div class="row">
				<label class="field" for="deck" style="flex:1">Paquet
					<select id="deck" name="deck">{#each ['Concepts', 'Commandes', 'Anglais technique', 'Mes cartes'] as d}<option>{d}</option>{/each}</select>
				</label>
				<label class="field" for="topic" style="flex:1">Thème
					<select id="topic" name="topic"><option value="">—</option>{#each ALL_TOPICS as t}<option value={t.code}>{t.code} {t.label.slice(0, 40)}</option>{/each}</select>
				</label>
			</div>
			{#if form?.error}<p class="flash err">{form.error}</p>{/if}
			{#if form?.added}<p class="flash">Carte ajoutée.</p>{/if}
			<button class="btn primary">Ajouter</button>
		</form>
	</div>
</div>

<style>
	.bars { display: grid; grid-template-columns: repeat(14, 1fr); gap: 4px; height: 120px; align-items: end; }
	.b { height: 100%; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; gap: 2px; position: relative; }
	.b i { width: 100%; background: var(--accent); border-radius: 3px 3px 0 0; min-height: 2px; display: block; }
	.b span { font-size: 10px; color: var(--muted); }
</style>
