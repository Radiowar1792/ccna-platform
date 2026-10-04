<script lang="ts">
	import { enhance } from '$app/forms';
	import { DOMAINS, ALL_TOPICS } from '$lib/data/topics';
	import { fmtShort } from '$lib/dates';
	let { data, form } = $props();
	let mode = $state('train');
	const total = $derived(Object.values(data.counts).reduce((a, b) => a + b, 0));
</script>

<svelte:head><title>Quiz · CCNA Goal</title></svelte:head>

<div class="stack">
	<header class="row"><h1>Quiz</h1><span class="spacer"></span><span class="mono small muted">{total} questions in the bank</span></header>
	<p class="muted">Questions are in English, like the real exam, with a detailed explanation in French. Practice mode: feedback after each question. Exam mode: timer (72 s per question, the real exam pace) and feedback at the end.</p>

	<div class="grid2">
		<form class="card" method="POST" action="?/start">
			<h3>New quiz</h3>
			<label class="field" for="domain">Domain
				<select id="domain" name="domain">
					<option value="">All domains</option>
					{#each DOMAINS as d}<option value={d.id} selected={data.preset === d.id}>{d.id}.0 {d.name} ({data.counts[d.id] ?? 0})</option>{/each}
				</select>
			</label>
			<div class="row">
				<label class="field" for="count" style="flex:1">Questions<input id="count" name="count" type="number" min="5" max="120" value="10" /></label>
				<label class="field" for="pick" style="flex:2">Question selection
					<select id="pick" name="pick"><option value="weak">My mistakes and unseen questions first</option><option value="random">Random</option></select>
				</label>
			</div>
			<input type="hidden" name="mode" value={mode} />
			<div class="seg" role="group" aria-label="Mode">
				<button type="button" aria-pressed={mode === 'train'} onclick={() => (mode = 'train')}>Practice</button>
				<button type="button" aria-pressed={mode === 'exam'} onclick={() => (mode = 'exam')}>Timed exam</button>
			</div>
			{#if form?.error}<p class="flash err">{form.error}</p>{/if}
			<button class="btn primary">Start</button>
		</form>

		<div class="card">
			<h3>Score by domain</h3>
			{#each DOMAINS as d}
				{@const s = data.byDomain[d.id]}
				{@const pct = s ? Math.round((100 * s.ok) / s.n) : 0}
				<div class="dom">
					<span class="small"><b>{d.id}.0</b> {d.name}</span>
					<div class="bar" class:green={pct >= 85}><i style="width:{pct}%"></i></div>
					<span class="mono small muted">{s ? `${pct}% · ${s.n}` : '–'}</span>
				</div>
			{/each}
		</div>
	</div>

	{#if data.attempts.length}
		<div class="card">
			<h3>Recent quizzes</h3>
			<div class="tablewrap"><table>
				<thead><tr><th>Date</th><th>Mode</th><th>Domain</th><th>Score</th><th>Time</th><th></th></tr></thead>
				<tbody>
					{#each data.attempts as a}
						{@const f = JSON.parse(a.filter ?? '{}')}
						{@const pct = Math.round((100 * a.correct) / a.total)}
						<tr>
							<td class="num">{fmtShort(new Date(a.started_at))}</td>
							<td>{a.mode === 'exam' ? 'Exam' : 'Practice'}</td>
							<td>{f.domain ? `${f.domain}.0` : 'All'}</td>
							<td class="num"><span class="pill {pct >= 85 ? 'green' : pct >= 70 ? 'amber' : 'red'}">{a.correct}/{a.total} · {pct}%</span></td>
							<td class="num">{Math.round(a.duration_s / 60)} min</td>
							<td><a class="small" href="/qcm/{a.id}">Review</a></td>
						</tr>
					{/each}
				</tbody>
			</table></div>
		</div>
	{/if}

	<details class="card">
		<summary><b>Add my own question</b> <span class="muted small">(during class or after a mistake in a practice exam)</span></summary>
		<form method="POST" action="?/add" class="stack-s" use:enhance>
			<label class="field" for="q-topic">Topic<select id="q-topic" name="topic">{#each ALL_TOPICS as t}<option value={t.code}>{t.code} {t.label.slice(0, 60)}</option>{/each}</select></label>
			<label class="field" for="q-stem">Question (in English)<textarea id="q-stem" name="stem" required></textarea></label>
			{#each [0, 1, 2, 3, 4] as i}
				<div class="row opt"><input type="checkbox" name="correct" value={i} id="c{i}" aria-label="Answer {i + 1} is correct" /><input type="text" name="opt{i}" placeholder="Answer {i + 1}{i > 1 ? ' (optional)' : ''}" /></div>
			{/each}
			<label class="field" for="q-exp">Explanation (French is fine)<textarea id="q-exp" name="explanation"></textarea></label>
			{#if form?.addError}<p class="flash err">{form.addError}</p>{/if}
			{#if form?.added}<p class="flash">Question added.</p>{/if}
			<button class="btn primary">Add question</button>
		</form>
	</details>
</div>

<style>
	.dom { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr) 70px; gap: 10px; align-items: center; }
	.opt { flex-wrap: nowrap; }
	.opt input[type='checkbox'] { width: 18px; height: 18px; flex: none; accent-color: var(--green); }
	summary { cursor: pointer; }
	details[open] summary { margin-bottom: 8px; }
</style>
