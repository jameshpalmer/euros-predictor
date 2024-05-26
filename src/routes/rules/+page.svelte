<script lang="ts">
	export let data;

	$: user = data.user;
</script>

{#if !user}
	<div class="container mx-auto p-4">
		<p><a href="login/azure" class="underline">Sign in</a> to get started!</p>
	</div>
{/if}
