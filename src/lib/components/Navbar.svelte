<script lang="ts">
	import type { themes } from '$lib/themes';
	import type { AuthUser } from '$lib/types/db';
	import { ThemeController } from '.';

	export let user: AuthUser | null;
	export let currentTheme: (typeof themes)[number] | undefined;
</script>

<header class="navbar sticky top-0 z-10 bg-base-100 bg-opacity-80 shadow-sm backdrop-blur-md">
	<div class="navbar-start w-full justify-between sm:justify-start lg:w-1/2">
		<div class="dropdown">
			<div tabindex="0" role="button" class="btn btn-ghost lg:hidden" aria-label="Menu">
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
				class="menu dropdown-content menu-md z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
			>
				<li><a href="/rules">Rules</a></li>
				{#if user}
					<li><a href="/predictions">Predictions</a></li>
				{/if}
				<li><a href="/leaderboard">Leaderboard</a></li>
				<li><a href="/sweepstake">Sweepstake</a></li>
				<li><a href="/logout">Sign Out</a></li>
			</ul>
		</div>
		<a class="btn btn-ghost text-xl" href="/">
			<span class="text-[#AD1313]">Præsto</span> Predictor</a
		>
	</div>
	<div class="navbar-center hidden lg:flex">
		<ul class="menu menu-horizontal px-1">
			<li><a href="/rules">Rules</a></li>
			{#if user}
				<li><a href="/predictions">Predictions</a></li>
			{/if}
			<li><a href="/leaderboard">Leaderboard</a></li>
			<li><a href="/sweepstake">Sweepstake</a></li>
		</ul>
	</div>
	<div class="navbar-end hidden sm:inline-flex">
		<ThemeController {currentTheme} />
		{#if user}
			<a class="btn hidden sm:inline-flex" href="/logout">Sign Out</a>
		{:else}
			<a class="btn hidden sm:inline-flex" href="/login/azure">Sign In</a>
		{/if}
	</div>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
		view-transition-name: header;
	}
</style>
