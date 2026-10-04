<script lang="ts">
	import { enhance } from '$app/forms';
	import Heatmap from '$lib/components/Heatmap.svelte';
	import LineChart from '$lib/components/LineChart.svelte';
	import BarChart from '$lib/components/BarChart.svelte';
	import { DOMAINS } from '$lib/data/topics';
	import { fmtShort, ymd } from '$lib/dates';
	let { data, form } = $props();
	const s = $derived(data.s);

	const qTotal = $derived(s.quiz.totals.n ?? 0);
	const qPct = $derived(qTotal ? Math.round((100 * (s.quiz.totals.ok ?? 0)) / qTotal) : 0);
	const weekLabels = $derived(s.time.weeks.map((w) => fmtShort(w)));
	const sum = (a: number[]) => a.reduce((x, y) => x + y, 0);
	const hoursThisWeek = $derived(Math.round((s.time.sessions.at(-1)! + s.time.cards.at(-1)! + s.time.quiz.at(-1)! + s.time.drills.at(-1)!) / 6) / 10);
	const totalHours = $derived(Math.round((sum(s.time.sessions) + sum(s.time.cards) + sum(s.time.quiz) + sum(s.time.drills)) / 6) / 10);
	const st = $derived(s.flash.states);
	const stateParts = $derived([
		{ name: 'New', v: st.new ?? 0, color: 'var(--led-off)' },
		{ name: 'Learning', v: st.learning ?? 0, color: 'var(--s2)' },
		{ name: 'Young (< 21 d)', v: st.young ?? 0, color: 'var(--s1)' },
		{ name: 'Mature (≥ 21 d)', v: st.mature ?? 0, color: 'var(--s3)' },
		{ name: 'Suspended', v: st.suspended ?? 0, color: 'var(--s4)' }
	]);
	const ratingTotal = $derived(sum(s.flash.ratings));
	const domainReady = (id: string) => {
		const d = DOMAINS.find((x) => x.id === id)!;
		const v = d.topics.reduce((a, [c]) => a + ((data.topics[c]?.status ?? 0) === 2 ? 1 : (data.topics[c]?.status ?? 0) === 1 ? 0.4 : 0), 0);
		return Math.round((100 * v) / d.topics.length);
	};
	let topicSort = $state<'code' | 'pct' | 'n'>('code');
	const topicRows = $derived(
		[...s.quiz.topicRows].sort((a, b) => (topicSort === 'code' ? 0 : topicSort === 'n' ? b.n - a.n : (a.pct ?? 101) - (b.pct ?? 101)))
	);
	const LED = ['To learn', 'To review', 'Mastered'];
	const SECTIONS = [['overview', 'Overview'], ['time', 'Study time'], ['cards', 'Flashcards'], ['quiz', 'Quizzes'], ['lessons', 'Lessons'], ['subnet', 'Subnetting'], ['plan', 'Plan & videos'], ['exams', 'Practice exams']];
	const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
</script>

<svelte:head><title>Stats · CCNA Goal</title></svelte:head>

<div class="stack">
	<header class="stack-s">
		<h1>Statistics</h1>
		<nav class="seg jump" aria-label="Sections">{#each SECTIONS as [id, name]}<a href="#{id}">{name}</a>{/each}</nav>
	</header>

	<section id="overview" class="stack">
		<div class="strip">
			<div class="cell"><span class="lbl">Readiness</span><span class="val">{data.readiness}%</span><span class="sub">weighted by exam topics</span></div>
			<div class="cell"><span class="lbl">Quiz accuracy</span><span class="val">{qPct}%</span><span class="sub">{qTotal} answers · {s.quiz.attempts} quizzes</span></div>
			<div class="cell"><span class="lbl">Study time</span><span class="val">{totalHours} h</span><span class="sub">12 weeks · {hoursThisWeek} h this week</span></div>
			<div class="cell"><span class="lbl">Videos</span><span class="val">{s.plan.watched}/63</span><span class="sub">plan: {s.plan.plannedNow} by now</span></div>
			<div class="cell"><span class="lbl">Streak</span><span class="val">{data.streak} d</span><span class="sub">tasks done: {s.plan.taskRate}%</span></div>
		</div>
		<div class="card">
			<h3>Consistency since October</h3>
			<Heatmap days={data.heat} weeks={39} />
		</div>
	</section>

	<section id="time" class="stack">
		<h2>Study time</h2>
		<div class="card">
			<h3>Minutes per week, by activity</h3>
			<p class="small muted">Flashcards, quizzes and subnetting are timed automatically. "Logged sessions" is the time you enter on the home page (videos, labs, Netacad).</p>
			<BarChart labels={weekLabels} unit=" min" height={220} label="Study minutes per week by activity" series={[
				{ name: 'Logged sessions', color: 'var(--s1)', values: s.time.sessions },
				{ name: 'Flashcards', color: 'var(--s2)', values: s.time.cards },
				{ name: 'Quizzes', color: 'var(--s3)', values: s.time.quiz },
				{ name: 'Subnetting', color: 'var(--s4)', values: s.time.drills }
			]} />
		</div>
		<div class="grid2">
			<div class="card">
				<h3>Daily activity, last 30 days</h3>
				<BarChart labels={s.daily.days.map((d) => fmtShort(d))} label="Items done per day" series={[
					{ name: 'Cards', color: 'var(--s1)', values: s.daily.cards },
					{ name: 'Questions', color: 'var(--s2)', values: s.daily.questions },
					{ name: 'Subnet drills', color: 'var(--s3)', values: s.daily.drills }
				]} />
			</div>
			<div class="card">
				<h3>When you study</h3>
				<BarChart labels={dayNames} label="Activity by day of the week" series={[{ name: 'Activity', color: 'var(--s1)', values: s.weekdays }]} height={140} />
				<BarChart labels={s.hours.map((_, h) => `${h}h`)} label="Activity by hour of the day" series={[{ name: 'Activity', color: 'var(--s3)', values: s.hours }]} height={140} every={3} />
			</div>
		</div>
	</section>

	<section id="cards" class="stack">
		<h2>Flashcards</h2>
		<div class="grid2">
			<div class="card">
				<h3>Card states</h3>
				<div class="hbar" role="img" aria-label="Card states">
					{#each stateParts as p}{#if p.v}<span style="flex:{p.v};background:{p.color}" title="{p.name}: {p.v}"></span>{/if}{/each}
				</div>
				<table>
					<tbody>
						{#each stateParts as p}<tr><td><i class="dot" style="background:{p.color}"></i>{p.name}</td><td class="num">{p.v}</td><td class="num muted">{st.total ? Math.round((100 * p.v) / st.total) : 0}%</td></tr>{/each}
						<tr><td><b>Total</b></td><td class="num"><b>{st.total}</b></td><td></td></tr>
					</tbody>
				</table>
			</div>
			<div class="card">
				<h3>Your answers</h3>
				<BarChart labels={['Again', 'Hard', 'Good', 'Easy']} label="Answer buttons pressed" height={160} series={[{ name: 'Answers', color: 'var(--s1)', values: s.flash.ratings }]} />
				<p class="small muted">{ratingTotal} reviews · "Again" {ratingTotal ? Math.round((100 * s.flash.ratings[0]) / ratingTotal) : 0}% · average answer time {Math.round(s.flash.avgMs / 100) / 10} s</p>
			</div>
		</div>
		<div class="grid2">
			<div class="card">
				<h3>Retention per week</h3>
				<p class="small muted">Share of reviews on learned cards that you remembered. Around 90% is ideal: lower means too many new cards, higher means you could add more.</p>
				<LineChart points={s.flash.retention} target={90} label="Retention per week" />
			</div>
			<div class="card">
				<h3>Decks</h3>
				<div class="tablewrap"><table>
					<thead><tr><th>Deck</th><th>Cards</th><th>New</th><th>Mature</th><th>Lapses</th></tr></thead>
					<tbody>{#each s.flash.byDeck as d}<tr><td>{d.deck}</td><td class="num">{d.total}</td><td class="num">{d.new}</td><td class="num">{d.mature}</td><td class="num">{d.lapses ?? 0}</td></tr>{/each}</tbody>
				</table></div>
				{#if s.flash.hardest.length}
					<h3>Hardest cards</h3>
					<div class="tablewrap"><table>
						<thead><tr><th>Card</th><th>Day</th><th>Lapses</th></tr></thead>
						<tbody>{#each s.flash.hardest as c}<tr><td class="clip">{c.front}</td><td class="num">{c.day ?? '—'}</td><td class="num">{c.lapses}</td></tr>{/each}</tbody>
					</table></div>
				{/if}
			</div>
		</div>
	</section>

	<section id="quiz" class="stack">
		<h2>Quizzes</h2>
		<div class="card">
			<h3>Quiz scores over time</h3>
			<LineChart label="Quiz scores" target={85} area={false} lines={[
				{ name: 'Practice', color: 'var(--s1)', points: s.quiz.practice.slice(-30) },
				...(s.quiz.exam.length ? [{ name: 'Timed exam', color: 'var(--s2)', points: s.quiz.exam.slice(-30) }] : [])
			]} />
		</div>
		<div class="grid2">
			<div class="card">
				<h3>Domains: readiness vs quiz</h3>
				<p class="small muted">Blue = topics mastered (Topics page). Green = quiz accuracy. Weight = share of the real exam.</p>
				{#each DOMAINS as d}
					{@const q = s.quiz.byDomain[d.id]}
					{@const qp = q ? Math.round((100 * q.ok) / q.n) : 0}
					<div class="dom">
						<div class="row small"><b>{d.id}.0 {d.name}</b><span class="spacer"></span><span class="mono muted">{d.weight}%</span></div>
						<div class="two">
							<div class="bar"><i style="width:{domainReady(d.id)}%"></i></div><span class="mono small">{domainReady(d.id)}%</span>
							<div class="bar green"><i style="width:{qp}%"></i></div><span class="mono small">{q ? qp + '%' : '–'}</span>
						</div>
					</div>
				{/each}
			</div>
			<div class="card">
				<h3>Weakest topics</h3>
				{#if s.quiz.weakest.length}
					<div class="tablewrap"><table>
						<thead><tr><th>Topic</th><th>Answers</th><th>Accuracy</th><th></th></tr></thead>
						<tbody>{#each s.quiz.weakest as t}<tr><td><span class="mono muted">{t.code}</span> {t.label}</td><td class="num">{t.n}</td><td class="num"><span class="pill {t.pct! >= 85 ? 'green' : t.pct! >= 70 ? 'amber' : 'red'}">{t.pct}%</span></td><td><a class="small" href="/qcm?domain={t.domain}">Practice</a></td></tr>{/each}</tbody>
					</table></div>
				{:else}<p class="empty">Answer at least 2 questions per topic to see your weak spots.</p>{/if}
			</div>
		</div>
		<details class="card">
			<summary><b>All 53 topics</b> <span class="small muted">· bank size, your answers, accuracy and LED</span></summary>
			<div class="row small"><span class="muted">Sort by</span>
				<div class="seg">
					<button aria-pressed={topicSort === 'code'} onclick={() => (topicSort = 'code')}>Topic</button>
					<button aria-pressed={topicSort === 'pct'} onclick={() => (topicSort = 'pct')}>Accuracy</button>
					<button aria-pressed={topicSort === 'n'} onclick={() => (topicSort = 'n')}>Answers</button>
				</div>
			</div>
			<div class="tablewrap"><table>
				<thead><tr><th>Topic</th><th>In bank</th><th>Answers</th><th>Accuracy</th><th>LED</th></tr></thead>
				<tbody>{#each topicRows as t}<tr>
					<td><span class="mono muted">{t.code}</span> {t.label}</td><td class="num">{t.bank}</td><td class="num">{t.n}</td>
					<td class="num">{t.pct === null ? '–' : t.pct + '%'}</td>
					<td><span class="led" data-s={t.status} title={LED[t.status]}><span></span></span></td>
				</tr>{/each}</tbody>
			</table></div>
		</details>
	</section>

	<section id="lessons" class="stack">
		<h2>Lesson mini quizzes</h2>
		<div class="card">
			<div class="row small muted">
				<span><b class="mono">{s.lessons.done}</b>/63 done</span>
				<span><b class="mono">{s.lessons.perfect}</b> perfect</span>
				<span>first-try accuracy: <b class="mono">{s.lessons.firstTry === null ? '–' : s.lessons.firstTry + '%'}</b></span>
				<span class="spacer"></span>
				<span class="legend-l"><i class="c0"></i>not done <i class="c1"></i>0–1/3 <i class="c2"></i>2/3 <i class="c3"></i>3/3</span>
			</div>
			<div class="lgrid">
				{#each s.lessons.cells as c}
					<a href="/videos?day={c.day}" class="lc c{c.best === null ? 0 : c.best === c.total ? 3 : c.best === c.total - 1 ? 2 : 1}" title="Day {c.day}: {c.best === null ? 'not done' : `best ${c.best}/${c.total}, ${c.tries} ${c.tries > 1 ? 'tries' : 'try'}`}">{c.day}</a>
				{/each}
			</div>
		</div>
	</section>

	<section id="subnet" class="stack">
		<h2>Subnetting</h2>
		<div class="grid2">
			<div class="card">
				<h3>Accuracy per day</h3>
				<LineChart points={s.subnet.accuracy} target={90} label="Subnetting accuracy per day" />
			</div>
			<div class="card">
				<h3>Average time per correct answer</h3>
				<LineChart points={s.subnet.speed} target={30} max={Math.max(60, ...s.subnet.speed.map((x) => x.v))} unit=" s" label="Average seconds per correct subnet" area={false} />
				<p class="small muted">{s.subnet.total} drills · {s.subnet.ok} correct · best time {Number.isFinite(s.subnet.best) ? Math.round(s.subnet.best / 1000) + ' s' : '–'}. Goal: under 30 s.</p>
			</div>
		</div>
	</section>

	<section id="plan" class="stack">
		<h2>Plan & videos</h2>
		<div class="grid2">
			<div class="card">
				<h3>Videos watched vs plan</h3>
				<LineChart label="Videos watched compared with the plan" max={63} unit="" area={false} lines={[
					{ name: 'Planned', color: 'var(--s4)', points: s.plan.planned },
					{ name: 'Watched', color: 'var(--s1)', points: s.plan.actual }
				]} />
			</div>
			<div class="card">
				<h3>Tasks done per week</h3>
				<BarChart labels={s.plan.weeks.map((w) => `W${w.i + 1}`)} unit="%" max={100} label="Share of tasks done each week" series={[{ name: 'Tasks done', color: 'var(--s3)', values: s.plan.weeks.map((w) => (w.i <= s.plan.current ? w.pct : 0)) }]} />
				<p class="small muted">Week {s.plan.current + 1} of {s.plan.weeks.length}. Overall: {s.plan.taskRate}% of tasks done so far.</p>
			</div>
		</div>
	</section>

	<section id="exams" class="card">
		<h2>Practice exams</h2>
		<p class="small muted">Full exams in real conditions (Netacad, PDF, Boson…). Over 85% on never-seen questions means you are ready.</p>
		<LineChart points={data.mocks.map((m) => ({ date: m.date, v: m.score }))} target={85} label="Practice exam scores" />
		<form method="POST" action="?/addMock" class="mock" use:enhance>
			<label class="field" for="m-date">Date<input id="m-date" name="date" type="date" value={ymd()} required /></label>
			<label class="field" for="m-src">Source<select id="m-src" name="source">{#each ['Netacad ENSA – CCNA practice exam', 'Netacad (checkpoint / final)', 'Examsdigest PDF', 'Platform exam mode', 'Boson ExSim', 'Other'] as x}<option>{x}</option>{/each}</select></label>
			<label class="field" for="m-score">Score (%)<input id="m-score" name="score" type="number" min="0" max="100" required /></label>
			<button class="btn primary">Add</button>
		</form>
		{#if form?.error}<p class="flash err">{form.error}</p>{/if}
		{#if data.mocks.length}
			<div class="tablewrap"><table>
				<thead><tr><th>Date</th><th>Source</th><th>Score</th><th></th></tr></thead>
				<tbody>
					{#each [...data.mocks].reverse() as m}
						<tr><td class="num">{fmtShort(m.date)}</td><td>{m.source}</td><td class="num"><span class="pill {m.score >= 85 ? 'green' : m.score >= 70 ? 'amber' : 'red'}">{m.score}%</span></td>
							<td><form method="POST" action="?/deleteMock" use:enhance><input type="hidden" name="id" value={m.id} /><button class="btn ghost small danger">Delete</button></form></td></tr>
					{/each}
				</tbody>
			</table></div>
		{/if}
	</section>
</div>

<style>
	section { scroll-margin-top: 70px; }
	.jump { overflow-x: auto; flex-wrap: nowrap; max-width: 100%; }
	.jump a { white-space: nowrap; }
	.hbar { display: flex; height: 14px; border-radius: 4px; overflow: hidden; gap: 2px; background: var(--panel); }
	.hbar span { min-width: 3px; }
	.dot { width: 10px; height: 10px; border-radius: 2px; display: inline-block; margin-right: 6px; vertical-align: -1px; }
	.dom { display: flex; flex-direction: column; gap: 4px; padding: 6px 0; border-top: 1px solid var(--line); }
	.dom:first-of-type { border-top: 0; }
	.two { display: grid; grid-template-columns: minmax(0, 1fr) 46px; gap: 4px 10px; align-items: center; }
	.clip { max-width: 260px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
	.lgrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(38px, 1fr)); gap: 4px; }
	.lc { aspect-ratio: 1; display: grid; place-items: center; border-radius: 5px; font-family: var(--f-mono); font-size: 12px; text-decoration: none; color: var(--ink); border: 1px solid var(--line); }
	.lc:hover { border-color: var(--muted); }
	.c0 { background: var(--panel2); color: var(--muted); }
	.c1 { background: var(--danger-soft); }
	.c2 { background: var(--amber-soft); }
	.c3 { background: var(--green-soft); border-color: var(--green); }
	.legend-l { display: inline-flex; gap: 6px; align-items: center; }
	.legend-l i { width: 12px; height: 12px; border-radius: 3px; display: inline-block; border: 1px solid var(--line); margin-left: 6px; }
	.mock { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; align-items: end; }
	@media (max-width: 640px) { .mock { grid-template-columns: 1fr 1fr; } }
	summary { cursor: pointer; }
	details[open] summary { margin-bottom: 8px; }
</style>
