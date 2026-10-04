<script lang="ts">
	let { form } = $props();
</script>

<svelte:head><title>Connexion · Objectif CCNA</title></svelte:head>

<div class="wrap">
	<form method="POST" class="card">
		<div class="prompt"><b>User Access Verification</b></div>
		<h1>Objectif CCNA</h1>
		<label class="field" for="pw">Password:
			<input id="pw" name="password" type="password" autocomplete="current-password" required />
		</label>
		{#if form?.error}<p class="flash err">{form.error}</p>{/if}
		<button class="btn primary">Se connecter</button>
	</form>
</div>

<style>
	.wrap { min-height: 100dvh; display: grid; place-items: center; padding: 16px; }
	form { width: min(360px, 100%); }
</style>
