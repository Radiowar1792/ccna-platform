<script lang="ts">
	import { DOMAINS } from '$lib/data/topics';
	import { COURSE } from '$lib/data/videos';
	import { post } from '$lib/api';
	let { data } = $props();
	const LABELS = ['To learn', 'To review', 'Mastered'];
	let open = $state<string | null>(null);
	let saved = $state('');
	let timer: ReturnType<typeof setTimeout>;
	function saveNote(code: string, note: string) {
		clearTimeout(timer);
		saved = 'Saving…';
		timer = setTimeout(async () => {
			await post('/api/topics', { code, note }, false);
			saved = 'Saved';
		}, 600);
	}
	const videosFor = (code: string) => COURSE.filter((c) => c.topics.includes(code));
</script>

<svelte:head><title>Topics · CCNA Goal</title></svelte:head>

<div class="stack">
	<header class="stack-s">
		<div class="row"><h1>Exam topics</h1><span class="spacer"></span><span class="mono">{data.readiness}% ready</span></div>
		<p class="muted">The 53 official CCNA 200-301 v1.1 topics. Click the LED to change its state, and open "Notes" to write down commands and traps.</p>
		<div class="row small muted">
			<span class="row" style="gap:6px"><span class="led" data-s="0"><span></span></span>To learn</span>
			<span class="row" style="gap:6px"><span class="led" data-s="1"><span></span></span>To review</span>
			<span class="row" style="gap:6px"><span class="led" data-s="2"><span></span></span>Mastered</span>
		</div>
	</header>

	{#each DOMAINS as d}
		{@const green = d.topics.filter(([c]) => data.topics[c]?.status === 2).length}
		{@const q = data.quiz[d.id]}
		<section class="card">
			<div class="row">
				<h2>{d.id}.0 {d.name}</h2>
				<span class="spacer"></span>
				<span class="mono small muted">{d.weight}% of the exam · {green}/{d.topics.length}{q ? ` · quiz ${Math.round((100 * q.ok) / q.n)}%` : ''}</span>
				<a class="btn small" href="/qcm?domain={d.id}">Quiz {d.id}.0</a>
			</div>
			<div class="bar green"><i style="width:{(100 * green) / d.topics.length}%"></i></div>
			<div>
				{#each d.topics as [code, label]}
					{@const st = data.topics[code]?.status ?? 0}
					{@const note = data.topics[code]?.note ?? ''}
					<div class="topic">
						<button class="led" data-s={st} title={LABELS[st]} aria-label="{code}: {LABELS[st]}, click to change" onclick={() => post('/api/topics', { code, status: (st + 1) % 3 })}><span></span></button>
						<div class="lbl"><span class="code mono">{code}</span>{label}</div>
						<button class="btn ghost small" onclick={() => (open = open === code ? null : code)}>{open === code ? 'Close' : note.trim() ? 'Notes ●' : 'Notes'}</button>
						{#if open === code}
							<div class="more">
								<textarea id="note-{code}" value={note} oninput={(e) => saveNote(code, e.currentTarget.value)} placeholder="e.g. show ip ospf neighbor → state should be FULL"></textarea>
								<div class="row small">
									<span class="muted">{saved}</span>
									<span class="spacer"></span>
									{#each videosFor(code) as v}<a href="/videos?day={v.day}">Day {v.day}</a>{/each}
								</div>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</section>
	{/each}
</div>

<style>
	.topic { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; gap: 10px; align-items: start; padding: 7px 2px; border-top: 1px solid var(--line); }
	.topic:first-child { border-top: 0; }
	.lbl { padding-top: 1px; }
	.code { font-size: 12px; color: var(--muted); margin-right: 8px; }
	.more { grid-column: 2 / 4; display: flex; flex-direction: column; gap: 6px; }
</style>
