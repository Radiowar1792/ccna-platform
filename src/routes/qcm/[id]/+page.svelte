<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	import { ALL_TOPICS } from '$lib/data/topics';
	let { data } = $props();

	const qs = $derived(data.questions);
	let answers = $state<Record<number, { chosen: number[]; correct: boolean }>>({ ...data.answers });
	const firstUnanswered = data.questions.findIndex((q) => !data.answers[q.id]);
	let i = $state(firstUnanswered === -1 ? 0 : firstUnanswered);
	let picked = $state<number[]>([]);
	let feedback = $state<{ correct: boolean; answer: number[] } | null>(null);
	let busy = $state(false);
	let showFr = $state(true);
	const q = $derived(qs[i]);
	const exam = $derived(data.attempt.mode === 'exam');
	const answeredCount = $derived(Object.keys(answers).length);

	// Exam mode timer: 72 s per question (120 min for ~100 questions).
	const limit = data.questions.length * 72;
	let left = $state(limit - Math.floor((Date.now() - new Date(data.attempt.startedAt).getTime()) / 1000));
	onMount(() => {
		if (!exam || data.attempt.finished) return;
		const t = setInterval(() => {
			left--;
			if (left <= 0) { clearInterval(t); finish(); }
		}, 1000);
		return () => clearInterval(t);
	});
	const mmss = (s: number) => `${Math.floor(Math.max(0, s) / 60)}:${String(Math.max(0, s) % 60).padStart(2, '0')}`;

	function toggle(k: number) {
		if (feedback) return;
		if (q.n > 1) picked = picked.includes(k) ? picked.filter((x) => x !== k) : [...picked, k];
		else picked = [k];
	}
	async function submit() {
		if (!picked.length || busy) return;
		busy = true;
		const r = await fetch('/api/quiz', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ op: 'answer', attempt: data.attempt.id, question: q.id, chosen: picked }) });
		const res = await r.json();
		answers[q.id] = { chosen: picked, correct: res.correct };
		busy = false;
		if (exam) next();
		else feedback = res;
	}
	function next() {
		feedback = null;
		picked = [];
		if (i < qs.length - 1) i++;
		else finish();
	}
	async function finish() {
		await fetch('/api/quiz', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ op: 'finish', attempt: data.attempt.id }) });
		await invalidateAll();
	}
	const L = 'ABCDE';
	const topicLabel = (c: string) => ALL_TOPICS.find((t) => t.code === c)?.label ?? '';
	const score = $derived(data.attempt.total ? Math.round((100 * data.attempt.correct) / data.attempt.total) : 0);
</script>

<svelte:head><title>Quiz · CCNA Goal</title></svelte:head>

<div class="stack quiz">
	{#if !data.attempt.finished}
		<header class="row">
			<a class="btn small ghost" href="/qcm">← Quiz</a>
			<span class="spacer"></span>
			<span class="mono small">Question {i + 1}/{qs.length}</span>
			{#if exam}<span class="pill {left < 300 ? 'red' : ''} mono">{mmss(left)}</span>{/if}
		</header>
		<div class="bar"><i style="width:{(100 * answeredCount) / qs.length}%"></i></div>

		<div class="card">
			<div class="row small muted"><span class="mono">{q.topic}</span><span>{topicLabel(q.topic)}</span></div>
			<p class="stem">{q.stem}{#if q.n > 1 && !/choose/i.test(q.stem)} <b>(Choose {q.n === 2 ? 'two' : q.n === 3 ? 'three' : q.n}.)</b>{/if}</p>
			<div class="opts">
				{#each q.options as o, k}
					{@const isAns = feedback?.answer.includes(k)}
					{@const isPicked = picked.includes(k)}
					<button class="opt" class:picked={isPicked && !feedback} class:ok={feedback && isAns} class:ko={feedback && isPicked && !isAns} onclick={() => toggle(k)} disabled={!!feedback}>
						<span class="letter mono">{L[k]}</span><span>{o}</span>
					</button>
				{/each}
			</div>
			{#if feedback}
				<div class="flash {feedback.correct ? '' : 'err'}"><b>{feedback.correct ? 'Correct.' : 'Incorrect.'}</b> Right answer: {feedback.answer.map((a) => L[a]).join(', ')}</div>
				{#if q.explanation}
					<button class="btn ghost small" onclick={() => (showFr = !showFr)}>{showFr ? 'Hide' : 'Show'} the explanation (FR)</button>
					{#if showFr}<p class="expl" lang="fr">{q.explanation}</p>{/if}
				{/if}
				<div class="row"><span class="spacer"></span><button class="btn primary" onclick={next}>{i < qs.length - 1 ? 'Next question' : 'See the result'}</button></div>
			{:else}
				<div class="row">
					{#if exam}<button class="btn ghost small" onclick={finish}>Finish now</button>{/if}
					<span class="spacer"></span>
					<button class="btn primary" onclick={submit} disabled={!picked.length || busy || (q.n > 1 && picked.length !== q.n)}>{exam ? 'Submit and continue' : 'Submit'}</button>
				</div>
			{/if}
		</div>
	{:else}
		<header class="row"><a class="btn small ghost" href="/qcm">← Quiz</a><span class="spacer"></span><a class="btn primary small" href="/qcm">New quiz</a></header>
		<div class="card result">
			<span class="pill {score >= 85 ? 'green' : score >= 70 ? 'amber' : 'red'}">{data.attempt.mode === 'exam' ? 'Exam' : 'Practice'}</span>
			<h1 class="mono">{data.attempt.correct}/{data.attempt.total} · {score}%</h1>
			<p class="muted">{score >= 85 ? 'Goal reached on this set.' : score >= 70 ? 'Not bad. Read the explanations below and set the missed topics to amber.' : 'These topics need more work: rewatch the matching video, then take a targeted quiz.'} Time: {Math.round((data.attempt.duration ?? 0) / 60)} min.</p>
		</div>
		{#each qs as qq, k}
			{@const a = data.answers[qq.id]}
			<div class="card review" class:wrong={!a?.correct}>
				<div class="row small"><span class="mono muted">{k + 1}. {qq.topic}</span><span class="spacer"></span><span class="pill {a?.correct ? 'green' : 'red'}">{a ? (a.correct ? 'Correct' : 'Wrong') : 'No answer'}</span></div>
				<p class="stem small-stem">{qq.stem}</p>
				<ul class="ans">
					{#each qq.options as o, j}
						<li class:ok={qq.answer.includes(j)} class:ko={a?.chosen.includes(j) && !qq.answer.includes(j)}><span class="mono">{L[j]}</span> {o}{#if a?.chosen.includes(j)} <span class="muted small">(your answer)</span>{/if}</li>
					{/each}
				</ul>
				{#if qq.explanation}<p class="expl" lang="fr">{qq.explanation}</p>{/if}
			</div>
		{/each}
	{/if}
</div>

<style>
	.quiz { max-width: 820px; margin: 0 auto; }
	.stem { font-size: 17px; font-weight: 500; white-space: pre-wrap; }
	.small-stem { font-size: 15px; }
	.opts { display: flex; flex-direction: column; gap: 6px; }
	.opt { display: flex; gap: 12px; align-items: flex-start; text-align: left; border: 1px solid var(--line); background: var(--panel2); border-radius: 8px; padding: 10px 12px; }
	.opt:hover:not(:disabled) { border-color: var(--muted); }
	.opt:disabled { cursor: default; }
	.opt.picked { border-color: var(--accent); background: var(--accent-soft); }
	.opt.ok { border-color: var(--green); background: var(--green-soft); }
	.opt.ko { border-color: var(--danger); background: var(--danger-soft); }
	.letter { font-weight: 600; color: var(--muted); }
	.expl { background: var(--panel2); border-left: 3px solid var(--accent); padding: 8px 12px; border-radius: 4px; font-size: 14px; }
	.result h1 { font-size: 34px; }
	.review.wrong { border-left: 3px solid var(--danger); }
	.ans { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 3px; font-size: 14px; }
	.ans li { padding: 4px 8px; border-radius: 4px; }
	.ans li.ok { background: var(--green-soft); }
	.ans li.ko { background: var(--danger-soft); }
</style>
