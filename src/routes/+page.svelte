<script lang="ts">
	import WeekCard from '$lib/components/WeekCard.svelte';
	import Heatmap from '$lib/components/Heatmap.svelte';
	import SessionForm from '$lib/components/SessionForm.svelte';
	import { WEEKS } from '$lib/data/plan';
	import { fmtLong, fmtShort, parseYmd } from '$lib/dates';
	import { post } from '$lib/api';

	let { data } = $props();
	const today = new Date();
	const dow = (today.getDay() + 6) % 7; // 0 = Monday
	const daysLeft = $derived(Math.ceil((parseYmd(data.examDate).getTime() + 9 * 3600e3 - Date.now()) / 86400e3));
	const w = $derived(WEEKS[data.week]);
	const nextInWeek = $derived(data.weekVideos.find((v) => !v.watched_at));

	// What to do today, depending on the day of the week.
	const focus = $derived.by(() => {
		if (w.kind === 'maintain') return { title: 'Maintenance mode', text: 'BTS comes first. Just do today\'s flashcards.', href: '/flashcards', cta: 'Review flashcards' };
		if (dow <= 2) {
			const v = nextInWeek ?? data.nextVideo;
			return v
				? { title: `Today's video · Day ${v.day}`, text: `${v.title}. Watch it in your free time, then read the lesson and do the mini quiz.`, href: `/videos?day=${v.day}`, cta: 'Watch' }
				: { title: 'Videos up to date', text: 'You watched all of this week\'s videos. Work on the labs.', href: '/qcm', cta: 'Take a quiz' };
		}
		if (dow <= 4) return { title: 'Lab day', text: 'At school: redo this week\'s labs in Packet Tracer, then a short quiz.', href: '/qcm', cta: '10-question quiz' };
		return data.solo
			? { title: 'Weekend with your son', text: 'One short session during his nap: flashcards and a quick reread. The rest can wait.', href: '/flashcards', cta: 'Flashcards' }
			: { title: 'Long weekend session', text: 'Redo one lab without the solution, then the weekly quiz.', href: '/qcm', cta: 'Start the quiz' };
	});
</script>

<svelte:head><title>Home · CCNA Goal</title></svelte:head>

<div class="stack">
	<header class="stack-s">
		<div class="prompt"><b>ccna-lab#</b> show progress 200-301</div>
		<div class="row">
			<h1>Hi Batiste</h1>
			<span class="spacer"></span>
			<span class="muted small" style="text-transform:capitalize">{fmtLong(today)}</span>
		</div>
	</header>

	<section class="strip" aria-label="Summary">
		<a class="cell" href="/planning"><span class="lbl">Exam</span><span class="val">{daysLeft > 0 ? `D-${daysLeft}` : 'Exam day'}</span><span class="sub">{fmtShort(data.examDate)} {data.examDate.slice(0, 4)}</span></a>
		<a class="cell" href="/planning"><span class="lbl">Week</span><span class="val">{data.week + 1}/{WEEKS.length}</span><span class="sub">{w.title}</span></a>
		<a class="cell" href="/flashcards"><span class="lbl">Cards due</span><span class="val">{data.due}</span><span class="sub">{data.fresh} new cards waiting</span></a>
		<a class="cell" href="/stats"><span class="lbl">Streak</span><span class="val">{data.streak} d</span><span class="sub">days in a row</span></a>
		<a class="cell" href="/themes"><span class="lbl">Readiness</span><span class="val">{data.readiness}%</span><span class="sub">{data.lastMock ? `last practice exam: ${data.lastMock.score}%` : 'weighted by exam topics'}</span></a>
	</section>

	<div class="grid2">
		<div class="card focus">
			<span class="pill">Today</span>
			<h2>{focus.title}</h2>
			<p class="muted">{focus.text}</p>
			<div class="row">
				<a class="btn primary" href={focus.href}>{focus.cta}</a>
				{#if data.due > 0 && focus.href !== '/flashcards'}<a class="btn" href="/flashcards/reviser">{data.due} cards due</a>{/if}
				<a class="btn" href="/subnetting">Subnetting 10 min</a>
			</div>
		</div>
		<div class="card">
			<div class="row"><h3>Activity</h3><span class="spacer"></span><a class="small" href="/stats">All stats</a></div>
			<Heatmap days={data.heat} weeks={20} />
			<p class="small muted">{data.totals.reviews} card reviews · {data.totals.answers.n ?? 0} quiz answers · {data.totals.videos}/63 videos · {Math.round(data.totals.minutes / 60)} h of logged sessions</p>
		</div>
	</div>

	<WeekCard index={data.week} solo={data.solo} done={data.done} />

	{#if data.weekVideos.length}
		<div class="card">
			<h3>This week's videos</h3>
			<ul class="tasks">
				{#each data.weekVideos as v}
					<li class="task" class:done={!!v.watched_at}>
						<input id="v{v.day}" type="checkbox" checked={!!v.watched_at} onchange={(e) => post('/api/videos', { day: v.day, watched: e.currentTarget.checked })} />
						<label for="v{v.day}"><span class="when">Day {v.day}</span>{v.title}</label>
						<a class="small" style="margin-left:auto" href="/videos?day={v.day}">Watch</a>
					</li>
				{/each}
			</ul>
		</div>
	{/if}

	<div class="card">
		<h3>Log a study session</h3>
		<p class="small muted">Flashcards, quizzes and subnetting drills are counted automatically. Log the rest here: videos, labs, Netacad.</p>
		<SessionForm />
		{#if data.sessions.length}
			<div class="tablewrap"><table>
				<thead><tr><th>Date</th><th>Activity</th><th>Time</th><th>Note</th><th></th></tr></thead>
				<tbody>
					{#each data.sessions as s}
						<tr><td class="num">{fmtShort(s.date)}</td><td>{s.activity}</td><td class="num">{s.minutes} min</td><td class="muted">{s.note}</td>
							<td><button class="btn ghost small danger" onclick={() => post('/api/session', { op: 'delete', id: s.id })}>Delete</button></td></tr>
					{/each}
				</tbody>
			</table></div>
		{/if}
	</div>
</div>

<style>
	.focus { border-color: var(--accent); }
</style>
