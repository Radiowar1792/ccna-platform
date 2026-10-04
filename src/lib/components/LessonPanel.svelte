<script lang="ts">
	import type { Lesson } from '$lib/data/lessons';
	import { post } from '$lib/api';

	let { lesson, best }: { lesson: Lesson; best?: { best: number; total: number; tries: number } } = $props();

	let showHint = $state(false);
	let showFr = $state(false);
	let hideFr = $state(false);
	let speaking = $state(false);
	// Quiz state, reset when the lesson changes.
	let picks = $state<(number | null)[]>([]);
	let saved = $state(false);
	$effect(() => {
		lesson.day;
		picks = lesson.quiz.map(() => null);
		saved = false;
		showHint = false;
		showFr = false;
		stopSpeaking();
	});

	const answered = $derived(picks.filter((p) => p !== null).length);
	const score = $derived(picks.reduce<number>((a, p, i) => a + (p === lesson.quiz[i]?.a ? 1 : 0), 0));
	const finished = $derived(picks.length > 0 && answered === lesson.quiz.length);

	$effect(() => {
		if (finished && !saved) {
			saved = true;
			post('/api/lesson', { day: lesson.day, correct: score, total: lesson.quiz.length });
		}
	});

	function retry() {
		picks = lesson.quiz.map(() => null);
		saved = false;
	}

	// Read the summary aloud with the browser's English voice (listening practice).
	function speak() {
		if (typeof speechSynthesis === 'undefined') return;
		if (speaking) return stopSpeaking();
		const u = new SpeechSynthesisUtterance(`${lesson.summary} ${lesson.points.join(' ')}`);
		u.lang = 'en-US';
		u.rate = 0.9;
		const voice = speechSynthesis.getVoices().find((v) => v.lang.startsWith('en'));
		if (voice) u.voice = voice;
		u.onend = () => (speaking = false);
		speaking = true;
		speechSynthesis.speak(u);
	}
	function stopSpeaking() {
		if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel();
		speaking = false;
	}
	const L = 'ABCD';
</script>

<section class="card lesson" aria-labelledby="lesson-title">
	<div class="row">
		<span class="pill">Lesson · Day {lesson.day}</span>
		<h2 id="lesson-title">Summary</h2>
		<span class="spacer"></span>
		<button class="btn small" onclick={speak} aria-pressed={speaking}>
			<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9zM16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
			{speaking ? 'Stop' : 'Listen'}
		</button>
	</div>
	<p class="summary">{lesson.summary}</p>

	<div class="cols">
		<div class="stack-s">
			<h3>Key points</h3>
			<ul class="points">
				{#each lesson.points as p}<li>{p}</li>{/each}
			</ul>
			{#if lesson.commands?.length}
				<h3>Commands</h3>
				<pre class="cli">{lesson.commands.join('\n')}</pre>
			{/if}
		</div>
		<div class="stack-s">
			<div class="row">
				<h3>Vocabulary</h3>
				<span class="spacer"></span>
				<label class="row small muted" style="gap:6px"><input type="checkbox" bind:checked={hideFr} /> Hide French (test yourself)</label>
			</div>
			<table class="vocab">
				<tbody>
					{#each lesson.vocab as [en, fr]}
						<tr>
							<td class="en">{en}</td>
							<td class="fr" class:blur={hideFr} tabindex={hideFr ? 0 : -1}>{fr}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>

	<div class="row helpers">
		<button class="btn small" aria-expanded={showHint} onclick={() => (showHint = !showHint)}>
			<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>
			Hint
		</button>
		<button class="btn small" aria-expanded={showFr} onclick={() => (showFr = !showFr)}>Pas compris ? Explication en français</button>
	</div>
	{#if showHint}<p class="box hint">{lesson.hint}</p>{/if}
	{#if showFr}<p class="box fr-box" lang="fr">{lesson.fr}</p>{/if}

	<div class="quiz stack-s">
		<div class="row">
			<h3>Mini quiz</h3>
			<span class="spacer"></span>
			{#if best}<span class="pill {best.best === best.total ? 'green' : 'amber'} mono">Best: {best.best}/{best.total}</span>{/if}
		</div>
		{#each lesson.quiz as q, i}
			{@const pick = picks[i]}
			<div class="qq">
				<p class="qtext"><span class="mono muted">{i + 1}.</span> {q.q}</p>
				<div class="opts">
					{#each q.o as o, k}
						<button class="opt" class:ok={pick !== null && k === q.a} class:ko={pick === k && k !== q.a} disabled={pick !== null} onclick={() => (picks[i] = k)}>
							<span class="mono letter">{L[k]}</span>{o}
						</button>
					{/each}
				</div>
				{#if pick !== null}
					<p class="why small" lang="fr"><b>{pick === q.a ? 'Correct.' : 'Not quite.'}</b> {q.why}</p>
				{/if}
			</div>
		{/each}
		{#if finished}
			<div class="row">
				<span class="pill {score === lesson.quiz.length ? 'green' : score >= 2 ? 'amber' : 'red'} mono">Score: {score}/{lesson.quiz.length}</span>
				<span class="small muted">{score === lesson.quiz.length ? 'Perfect. Move on to the lab.' : 'Read the summary again, then retry.'}</span>
				<span class="spacer"></span>
				<button class="btn small" onclick={retry}>Retry</button>
			</div>
		{/if}
	</div>
</section>

<style>
	.lesson { gap: 14px; }
	.summary { font-size: 16px; line-height: 1.65; max-width: 75ch; }
	.cols { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 20px; }
	@media (max-width: 760px) { .cols { grid-template-columns: 1fr; } }
	.points { margin: 0; padding-left: 18px; display: flex; flex-direction: column; gap: 4px; }
	.cli { margin: 0; background: var(--panel2); border: 1px solid var(--line); border-radius: 6px; padding: 10px 12px; font-family: var(--f-mono); font-size: 13px; overflow-x: auto; white-space: pre; }
	.vocab td { padding: 6px 4px; }
	.vocab .en { font-weight: 600; width: 50%; }
	.vocab .fr { color: var(--muted); transition: filter 0.15s; }
	.vocab .fr.blur { filter: blur(5px); cursor: pointer; }
	.vocab .fr.blur:hover, .vocab .fr.blur:focus { filter: none; }
	.helpers { gap: 8px; }
	.box { padding: 10px 14px; border-radius: 6px; font-size: 14px; line-height: 1.6; }
	.hint { background: var(--amber-soft); border-left: 3px solid var(--amber); }
	.fr-box { background: var(--panel2); border-left: 3px solid var(--accent); }
	.quiz { border-top: 1px solid var(--line); padding-top: 12px; }
	.qq { display: flex; flex-direction: column; gap: 6px; }
	.qtext { font-weight: 500; }
	.opts { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; }
	@media (max-width: 600px) { .opts { grid-template-columns: 1fr; } }
	.opt { display: flex; gap: 10px; align-items: flex-start; text-align: left; border: 1px solid var(--line); background: var(--panel2); border-radius: 6px; padding: 8px 10px; font-size: 14px; }
	.opt:hover:not(:disabled) { border-color: var(--muted); }
	.opt:disabled { cursor: default; }
	.opt.ok { border-color: var(--green); background: var(--green-soft); }
	.opt.ko { border-color: var(--danger); background: var(--danger-soft); }
	.letter { color: var(--muted); font-weight: 600; }
	.why { background: var(--panel2); border-radius: 4px; padding: 6px 10px; }
</style>
