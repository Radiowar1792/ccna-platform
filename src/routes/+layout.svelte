<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	let { data, children } = $props();

	const NAV = [
		{ href: '/', label: 'Accueil', icon: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z' },
		{ href: '/planning', label: 'Planning', icon: 'M4 6h16M4 12h16M4 18h10' },
		{ href: '/calendrier', label: 'Calendrier', icon: 'M4 6h16v14H4zM4 10h16M9 3v4M15 3v4' },
		{ href: '/videos', label: 'Vidéos', icon: 'M4 6h16v12H4zM10 9l5 3-5 3z' },
		{ href: '/flashcards', label: 'Flashcards', icon: 'M5 7h11v12H5zM8 4h11v12' },
		{ href: '/qcm', label: 'QCM', icon: 'M9 6h11M9 12h11M9 18h11M4 6h1M4 12h1M4 18h1' },
		{ href: '/subnetting', label: 'Subnetting', icon: 'M4 12h4l2-6 4 12 2-6h4' },
		{ href: '/themes', label: 'Thèmes', icon: 'M5 5h4v4H5zM5 15h4v4H5zM13 6h7M13 16h7' },
		{ href: '/stats', label: 'Stats', icon: 'M5 19V11M10 19V5M15 19v-6M20 19V9' }
	];
	const active = (href: string) => (href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href));
	const bare = $derived(page.url.pathname.startsWith('/login'));
</script>

{#if bare}
	{@render children()}
{:else}
	<div class="shell">
		<aside class="side">
			<a class="brand" href="/">
				<svg viewBox="0 0 64 64" width="28" height="28" aria-hidden="true"><rect width="64" height="64" rx="12" fill="var(--accent)"/><g fill="var(--accent-ink)"><circle cx="18" cy="33" r="3.4"/><circle cx="28" cy="33" r="3.4"/><circle cx="38" cy="33" r="3.4" fill="var(--green)"/><circle cx="48" cy="33" r="3.4" fill="var(--amber)"/></g></svg>
				<span>Objectif CCNA</span>
			</a>
			<nav>
				{#each NAV as n}
					<a href={n.href} aria-current={active(n.href) ? 'page' : undefined}>
						<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d={n.icon} fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/></svg>
						<span>{n.label}</span>
						{#if n.href === '/flashcards' && data.due > 0}<b class="badge">{data.due}</b>{/if}
					</a>
				{/each}
			</nav>
			{#if data.auth}
				<form method="POST" action="/login?/logout" class="logout"><button class="btn ghost small">Se déconnecter</button></form>
			{/if}
		</aside>
		<main class="main">
			{@render children()}
		</main>
	</div>
{/if}

<style>
	.shell { display: grid; grid-template-columns: 220px minmax(0, 1fr); min-height: 100dvh; }
	.side { position: sticky; top: 0; height: 100dvh; border-right: 1px solid var(--line); background: var(--panel); padding: 18px 12px; display: flex; flex-direction: column; gap: 18px; }
	.brand { display: flex; gap: 10px; align-items: center; font-family: var(--f-display); font-weight: 700; font-size: 19px; color: var(--ink); text-decoration: none; padding: 0 6px; }
	nav { display: flex; flex-direction: column; gap: 2px; }
	nav a { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 6px; color: var(--muted); text-decoration: none; font-weight: 500; }
	nav a:hover { background: var(--panel2); color: var(--ink); }
	nav a[aria-current='page'] { background: var(--accent-soft); color: var(--accent); }
	.badge { margin-left: auto; font-family: var(--f-mono); font-size: 11px; background: var(--amber); color: #1b1200; border-radius: 99px; padding: 0 7px; }
	.logout { margin-top: auto; }
	.main { padding: 24px clamp(16px, 3vw, 36px) 64px; max-width: 1180px; width: 100%; }

	@media (max-width: 860px) {
		.shell { grid-template-columns: 1fr; }
		.side { position: sticky; top: 0; z-index: 10; height: auto; flex-direction: row; align-items: center; padding: 8px 12px; padding-top: calc(8px + env(safe-area-inset-top, 0px)); border-right: 0; border-bottom: 1px solid var(--line); gap: 10px; }
		.brand span { display: none; }
		nav { flex-direction: row; overflow-x: auto; scrollbar-width: none; }
		nav a { padding: 6px 9px; white-space: nowrap; font-size: 14px; }
		nav a svg { display: none; }
		.logout { display: none; }
		.main { padding: 16px 16px 64px; }
	}
</style>
