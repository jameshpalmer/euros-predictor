<script lang="ts">
	import type { AuthUser } from '$lib/types/db';

	export let user: AuthUser | null;
</script>

<div class="navbar bg-base-100">
	<div class="navbar-start">
		<div class="dropdown">
			<div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h8m-8 6h16"
					/></svg
				>
			</div>
			<ul
				tabindex="-1"
				class="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
			>
				<li><a href="/rules">Rules</a></li>
				{#if user}
					<li><a href="/predictions">Predictions</a></li>
				{/if}
				<li><a href="/leaderboard">Leaderboard</a></li>
			</ul>
		</div>
		<a class="btn btn-ghost text-xl" href="/">Praesto Predictor</a>
	</div>
	<div class="navbar-center hidden lg:flex">
		<ul class="menu menu-horizontal px-1">
			<li><a href="/rules">Rules</a></li>
			{#if user}
				<li><a href="/predictions">Predictions</a></li>
			{/if}
			<li><a href="/leaderboard">Leaderboard</a></li>
		</ul>
	</div>
	<div class="navbar-end">
		{#if user}
			<a class="btn" href="/logout">Sign Out</a>
		{:else}
			<a class="btn" href="/login/azure">Sign In</a>
		{/if}
	</div>
</div>
