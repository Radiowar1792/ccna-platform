<script lang="ts">
	import { COURSE, JEREMY_PLAYLIST, searchUrl } from '$lib/data/videos';
	import { ALL_TOPICS } from '$lib/data/topics';
	import { post } from '$lib/api';
	import LessonPanel from '$lib/components/LessonPanel.svelte';
	import { lessonFor } from '$lib/data/lessons';
	let { data } = $props();
	const v = $derived(data.videos.find((x) => x.day === data.day)!);
	const course = $derived(COURSE.find((c) => c.day === data.day)!);
	const lesson = $derived(lessonFor(data.day));
	let url = $state('');
	let msg = $state('');
	let syncing = $state(false);
	const blocks = [
		{ name: 'Fundamentals', from: 1, to: 15 },
		{ name: 'Switching', from: 16, to: 23 },
		{ name: 'Routing', from: 24, to: 33 },
		{ name: 'Security and services', from: 34, to: 51 },
		{ name: 'Architecture, wireless, automation', from: 52, to: 63 }
	];
	const watched = $derived(data.videos.filter((x) => x.watched_at).length);

	async function sync() {
		syncing = true;
		msg = '';
		try {
			const r = await post<{ matched: number; total: number; method: string }>('/api/videos', { op: 'sync' });
			msg = `${r.matched} videos linked out of ${r.total} found (${r.method}).`;
		} catch (e) {
			msg = (e as Error).message;
		}
		syncing = false;
	}
	async function saveUrl() {
		try {
			await post('/api/videos', { day: data.day, url });
			url = '';
			msg = 'Video linked.';
		} catch (e) {
			msg = (e as Error).message;
		}
	}
</script>

<svelte:head><title>Day {data.day} · Videos · CCNA Goal</title></svelte:head>

<div class="stack">
	<header class="row">
		<h1>Jeremy's IT Lab videos</h1>
		<span class="spacer"></span>
		<span class="mono small muted">{watched}/63 watched</span>
	</header>

	<div class="layout">
		<div class="stack">
			<div class="player">
				{#if v.youtube_id}
					<iframe src="https://www.youtube-nocookie.com/embed/{v.youtube_id}?rel=0&modestbranding=1&cc_load_policy=1" title="Day {v.day} – {v.title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
				{:else}
					<iframe src="https://www.youtube-nocookie.com/embed/videoseries?list={JEREMY_PLAYLIST}&rel=0" title="Playlist Free CCNA" allow="encrypted-media; picture-in-picture" allowfullscreen></iframe>
				{/if}
			</div>
			<div class="card">
				<div class="row">
					<span class="pill">Day {v.day}</span>
					<h2>{v.title}</h2>
					<span class="spacer"></span>
					<label class="row small" style="gap:6px"><input type="checkbox" checked={!!v.watched_at} onchange={(e) => post('/api/videos', { day: v.day, watched: e.currentTarget.checked })} /> Watched</label>
				</div>
				<div class="row small">
					{#each course.topics as t}
						<a class="pill light" href="/themes" title={ALL_TOPICS.find((x) => x.code === t)?.label}>{t}</a>
					{/each}
					<span class="spacer"></span>
					<a class="btn small" href="?day={Math.max(1, v.day - 1)}" data-sveltekit-noscroll>← Day {Math.max(1, v.day - 1)}</a>
					<a class="btn small primary" href="?day={Math.min(63, v.day + 1)}" data-sveltekit-noscroll>Day {Math.min(63, v.day + 1)} →</a>
				</div>
				<p class="small muted">Tip: at work without sound, turn on subtitles (CC button) and set the speed to 1.25×. The Packet Tracer lab is linked in each video description on YouTube.</p>
				{#if !v.youtube_id}
					<div class="flash">
						This video is not linked yet, so the player shows the whole playlist. Click "Sync playlist" or paste the video link.
						<a href={searchUrl(v.day)} target="_blank" rel="noopener">Search Day {v.day} on YouTube</a>
					</div>
				{/if}
				<form class="row" onsubmit={(e) => { e.preventDefault(); saveUrl(); }}>
					<input type="url" bind:value={url} placeholder="Paste a YouTube link for Day {v.day}" style="flex:1;min-width:200px" />
					<button class="btn small">Link</button>
					<button type="button" class="btn small" onclick={sync} disabled={syncing}>{syncing ? 'Syncing…' : 'Sync playlist'}</button>
				</form>
				{#if msg}<p class="small muted">{msg}</p>{/if}
			</div>
			{#if lesson}
				<LessonPanel {lesson} best={data.scores[data.day]} />
			{/if}
			<div class="card fcbox">
				<div class="row">
					<h3>Flashcards · Day {v.day}</h3>
					<span class="spacer"></span>
					<span class="mono small muted">{data.cards.total ?? 0} cards · {data.cards.new ?? 0} new · {data.cards.due ?? 0} due</span>
				</div>
				{#if !v.watched_at && data.unlockByVideo}
					<p class="small muted">Tick "Watched" above to unlock this Day's cards, like Jeremy's Anki deck.</p>
				{:else}
					<p class="small muted">Study this Day's cards now, while the video is fresh. Then they come back automatically in your daily reviews.</p>
				{/if}
				<div class="row"><a class="btn primary small" class:disabled={!v.watched_at && data.unlockByVideo} href="/flashcards/reviser?day={v.day}">Study Day {v.day} cards</a></div>
			</div>
		</div>

		<div class="list">
			{#each blocks as b}
				<div class="blk">{b.name}</div>
				{#each data.videos.filter((x) => x.day >= b.from && x.day <= b.to) as x}
					<a class="it" class:cur={x.day === data.day} class:seen={!!x.watched_at} href="?day={x.day}" data-sveltekit-noscroll>
						<span class="mono d">{x.day}</span>
						<span class="t">{x.title}</span>
						{#if data.scores[x.day]}<span class="qs mono" class:perfect={data.scores[x.day].best === data.scores[x.day].total}>{data.scores[x.day].best}/{data.scores[x.day].total}</span>{/if}
						{#if x.watched_at}<svg viewBox="0 0 16 16" width="14" height="14" aria-label="watched"><path d="M3 8.5l3 3 7-7" fill="none" stroke="var(--green)" stroke-width="2"/></svg>{/if}
					</a>
				{/each}
			{/each}
		</div>
	</div>
</div>

<style>
	.layout { display: grid; grid-template-columns: minmax(0, 1fr) 300px; gap: 20px; align-items: start; }
	@media (max-width: 1000px) { .layout { grid-template-columns: 1fr; } .list { max-height: 420px; } }
	.player { aspect-ratio: 16 / 9; max-width: 100%; background: #000; border-radius: var(--r); overflow: hidden; border: 1px solid var(--line); }
	.player iframe { width: 100%; height: 100%; border: 0; display: block; }
	.list { background: var(--panel); border: 1px solid var(--line); border-radius: var(--r); padding: 8px; max-height: calc(100dvh - 140px); overflow-y: auto; position: sticky; top: 16px; }
	.blk { font-family: var(--f-display); font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); padding: 10px 6px 4px; }
	.it { display: grid; grid-template-columns: 26px minmax(0, 1fr) auto auto; gap: 8px; align-items: center; padding: 5px 6px; border-radius: 5px; color: var(--ink); text-decoration: none; font-size: 14px; }
	.it:hover { background: var(--panel2); }
	.it.cur { background: var(--accent-soft); color: var(--accent); font-weight: 600; }
	.it.seen .t { color: var(--muted); }
	.fcbox .disabled { opacity: 0.5; pointer-events: none; }
	.qs { font-size: 11px; color: var(--amber); }
	.qs.perfect { color: var(--green); }
	.d { font-size: 12px; color: var(--muted); text-align: right; }
	.t { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
</style>
