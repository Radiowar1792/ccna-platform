<script lang="ts">
	import WeekCard from '$lib/components/WeekCard.svelte';
	import Heatmap from '$lib/components/Heatmap.svelte';
	import SessionForm from '$lib/components/SessionForm.svelte';
	import { WEEKS } from '$lib/data/plan';
	import { fmtLong, fmtShort, parseYmd } from '$lib/dates';
	import { post } from '$lib/api';

	let { data } = $props();
	const today = new Date();
	const dow = (today.getDay() + 6) % 7; // 0 = lundi
	const daysLeft = $derived(Math.ceil((parseYmd(data.examDate).getTime() + 9 * 3600e3 - Date.now()) / 86400e3));
	const w = $derived(WEEKS[data.week]);
	const nextInWeek = $derived(data.weekVideos.find((v) => !v.watched_at));

	// Ce qu'il faut faire aujourd'hui, selon le jour de la semaine.
	const focus = $derived.by(() => {
		if (w.kind === 'maintain') return { title: 'Mode maintien', text: 'Priorité au BTS. Juste tes flashcards du jour.', href: '/flashcards', cta: 'Réviser les flashcards' };
		if (dow <= 2) {
			const v = nextInWeek ?? data.nextVideo;
			return v
				? { title: `Vidéo du jour · Day ${v.day}`, text: `${v.title}. Dans tes temps morts, avec des notes.`, href: `/videos?day=${v.day}`, cta: 'Regarder' }
				: { title: 'Vidéos à jour', text: 'Toutes les vidéos de la semaine sont vues. Avance sur les labs.', href: '/qcm', cta: 'Faire un QCM' };
		}
		if (dow <= 4) return { title: 'Jour de labs', text: 'À l’école : refais dans Packet Tracer les labs des vidéos de la semaine, puis un QCM court.', href: '/qcm', cta: 'QCM de 10 questions' };
		return data.solo
			? { title: 'Week-end avec ton fils', text: 'Une session courte pendant la sieste : flashcards et relecture. Le reste peut attendre.', href: '/flashcards', cta: 'Flashcards' }
			: { title: 'Session longue du week-end', text: 'Un lab refait sans solution, puis le QCM de la semaine.', href: '/qcm', cta: 'Lancer le QCM' };
	});
</script>

<svelte:head><title>Accueil · Objectif CCNA</title></svelte:head>

<div class="stack">
	<header class="stack-s">
		<div class="prompt"><b>ccna-lab#</b> show progress 200-301</div>
		<div class="row">
			<h1>Bonjour Batiste</h1>
			<span class="spacer"></span>
			<span class="muted small" style="text-transform:capitalize">{fmtLong(today)}</span>
		</div>
	</header>

	<section class="strip" aria-label="Résumé">
		<a class="cell" href="/planning"><span class="lbl">Examen</span><span class="val">{daysLeft > 0 ? `J-${daysLeft}` : 'Jour J'}</span><span class="sub">{fmtShort(data.examDate)} {data.examDate.slice(0, 4)}</span></a>
		<a class="cell" href="/planning"><span class="lbl">Semaine</span><span class="val">{data.week + 1}/{WEEKS.length}</span><span class="sub">{w.title}</span></a>
		<a class="cell" href="/flashcards"><span class="lbl">Flashcards dues</span><span class="val">{data.due}</span><span class="sub">{data.fresh} nouvelles en réserve</span></a>
		<a class="cell" href="/stats"><span class="lbl">Série</span><span class="val">{data.streak} j</span><span class="sub">jours d'affilée</span></a>
		<a class="cell" href="/themes"><span class="lbl">Préparation</span><span class="val">{data.readiness} %</span><span class="sub">{data.lastMock ? `dernier blanc : ${data.lastMock.score} %` : 'thèmes pondérés'}</span></a>
	</section>

	<div class="grid2">
		<div class="card focus">
			<span class="pill">Aujourd'hui</span>
			<h2>{focus.title}</h2>
			<p class="muted">{focus.text}</p>
			<div class="row">
				<a class="btn primary" href={focus.href}>{focus.cta}</a>
				{#if data.due > 0 && focus.href !== '/flashcards'}<a class="btn" href="/flashcards/reviser">{data.due} flashcards dues</a>{/if}
				<a class="btn" href="/subnetting">Subnetting 10 min</a>
			</div>
		</div>
		<div class="card">
			<div class="row"><h3>Activité</h3><span class="spacer"></span><a class="small" href="/stats">Toutes les stats</a></div>
			<Heatmap days={data.heat} weeks={20} />
			<p class="small muted">{data.totals.reviews} révisions de cartes · {data.totals.answers.n ?? 0} questions · {data.totals.videos}/63 vidéos · {Math.round(data.totals.minutes / 60)} h de sessions notées</p>
		</div>
	</div>

	<WeekCard index={data.week} solo={data.solo} done={data.done} />

	{#if data.weekVideos.length}
		<div class="card">
			<h3>Vidéos de la semaine</h3>
			<ul class="tasks">
				{#each data.weekVideos as v}
					<li class="task" class:done={!!v.watched_at}>
						<input id="v{v.day}" type="checkbox" checked={!!v.watched_at} onchange={(e) => post('/api/videos', { day: v.day, watched: e.currentTarget.checked })} />
						<label for="v{v.day}"><span class="when">Day {v.day}</span>{v.title}</label>
						<a class="small" style="margin-left:auto" href="/videos?day={v.day}">Regarder</a>
					</li>
				{/each}
			</ul>
		</div>
	{/if}

	<div class="card">
		<h3>Noter une session de travail</h3>
		<p class="small muted">Les flashcards, QCM et exercices de subnetting sont comptés tout seuls. Note ici le reste : vidéos, labs, Netacad.</p>
		<SessionForm />
		{#if data.sessions.length}
			<div class="tablewrap"><table>
				<thead><tr><th>Date</th><th>Activité</th><th>Durée</th><th>Note</th><th></th></tr></thead>
				<tbody>
					{#each data.sessions as s}
						<tr><td class="num">{fmtShort(s.date)}</td><td>{s.activity}</td><td class="num">{s.minutes} min</td><td class="muted">{s.note}</td>
							<td><button class="btn ghost small danger" onclick={() => post('/api/session', { op: 'delete', id: s.id })}>Supprimer</button></td></tr>
					{/each}
				</tbody>
			</table></div>
		{/if}
	</div>
</div>

<style>
	.focus { border-color: var(--accent); }
</style>
