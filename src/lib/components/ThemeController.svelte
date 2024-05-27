<script lang="ts">
	import { themes } from '$lib/themes';

	export let currentTheme: (typeof themes)[number] | undefined;

	function toggleTheme() {
		const theme = currentTheme === 'light' ? 'dark' : 'light';
		document.documentElement.setAttribute('data-theme', theme);
		window.localStorage.setItem('theme', theme);
		document.cookie = `theme=${theme}; path=/; SameSite=Strict;`;
		currentTheme = theme;
	}
</script>

<label class="swap swap-rotate hidden pr-4 sm:inline-grid" for="theme-controller">
	<!-- this hidden checkbox controls the state -->
	<input
		type="checkbox"
		class="theme-controller"
		value={currentTheme}
		on:change={toggleTheme}
		checked={currentTheme === 'dark'}
		aria-label="Toggle theme"
	/>
	<!-- sun icon -->
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="1.5"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="swap-off h-7 w-7"
	>
		<circle cx="12" cy="12" r="4" />
		<path d="M12 2v2" />
		<path d="M12 20v2" />
		<path d="m4.93 4.93 1.41 1.41" />
		<path d="m17.66 17.66 1.41 1.41" />
		<path d="M2 12h2" />
		<path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" />
		<path d="m19.07 4.93-1.41 1.41" />
	</svg>
	<!-- moon icon -->
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="1.5"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="swap-on h-7 w-7"
	>
		<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
	</svg>
</label>
