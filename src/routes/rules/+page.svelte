<script lang="ts">
	export let data;

	$: user = data.user;
</script>

<div class="container mx-auto">
	<article class="prose">
		{#if !user}
			<p><a href="login/azure" class="underline">Sign in</a> to get started!</p>
		{/if}
		<p>Rules go here.</p>
	</article>
</div>
