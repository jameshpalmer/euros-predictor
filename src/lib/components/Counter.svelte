<script lang="ts">
	import { spring, type Spring } from 'svelte/motion';

	let count = -1;

	const displayed_count = spring() satisfies Spring<number>;
	$: displayed_count.set(count);
	$: offset = modulo($displayed_count, 1);

	function modulo(n: number, m: number) {
		// handle negative numbers
		return ((n % m) + m) % m;
	}
</script>

<div class="flex">
	<button
		class="flex w-[2em] touch-manipulation items-center justify-center rounded-lg stroke-gray-600 text-2xl hover:bg-gray-100 disabled:stroke-gray-200 disabled:hover:bg-transparent"
		on:pointerdown={() => {
			if (count > 0) count -= 1;
		}}
		aria-label="Decrease by one"
		disabled={count <= 0}
	>
		<svg class="h-1/4 w-1/4" aria-hidden="true" viewBox="0 0 1 1">
			<path d="M0,0.5 L1,0.5" class="stroke-2" />
		</svg>
	</button>

	<div class="relative h-[4em] w-[4em] select-none overflow-hidden text-center">
		<div class="absolute h-full w-full" style="transform: translate(0, {100 * offset}%)">
			<strong
				class="absolute -top-full flex h-full w-full select-none items-center justify-center text-5xl font-normal"
				aria-hidden="true"
			>
				{Math.floor($displayed_count + 1) === -1 ? '?' : Math.floor($displayed_count + 1)}
			</strong>
			<strong class="absolute flex h-full w-full items-center justify-center text-5xl font-normal">
				{Math.floor($displayed_count) === -1 ? '?' : Math.floor($displayed_count)}
			</strong>
		</div>
	</div>

	<button
		class="flex w-[2em] touch-manipulation items-center justify-center rounded-lg stroke-gray-600 text-2xl hover:bg-gray-100 disabled:stroke-gray-200 disabled:hover:bg-transparent"
		on:pointerdown={() => {
			if (count < 10) count += 1;
		}}
		aria-label="Increase by one"
		disabled={count >= 10}
	>
		<svg class="h-1/4 w-1/4" aria-hidden="true" viewBox="0 0 1 1">
			<path d="M0,0.5 L1,0.5 M0.5,0 L0.5,1" class="stroke-2" />
		</svg>
	</button>
</div>

<style>
	path {
		vector-effect: non-scaling-stroke;
	}
</style>
