<script lang="ts">
	import { spring, type Spring } from 'svelte/motion';
	import { fly } from 'svelte/transition';

	export let count: number | null;
	export let updatePrediction: () => void;
	export let initialisePrediction: () => void;

	$: numericCount = count ?? -1;

	const displayedCount = spring() satisfies Spring<number>;
	$: displayedCount.set(numericCount);
	$: offset = modulo($displayedCount, 1);

	function modulo(n: number, m: number) {
		// handle negative numbers
		return ((n % m) + m) % m;
	}

	let isHovered = false;
</script>

<div
	class="flex"
	on:mouseenter={() => (isHovered = true)}
	on:mouseleave={() => (isHovered = false)}
	aria-hidden="true"
>
	<button
		class="button flex w-0 touch-manipulation items-center justify-center overflow-hidden rounded-lg stroke-base-content text-2xl opacity-0 transition-all duration-300 hover:bg-neutral disabled:stroke-neutral disabled:hover:bg-transparent group-hover:w-[1.5em] group-hover:opacity-100"
		on:pointerdown={() => {
			if (count !== null && count > 0) {
				count -= 1;
				updatePrediction();
			}
		}}
		aria-label="Decrease by one"
		disabled={!count}
	>
		<svg class="h-1/3 w-1/3" aria-hidden="true" viewBox="0 0 1 1">
			<path d="M0,0.5 L1,0.5" class="stroke-2" />
		</svg>
	</button>

	<div class="relative h-[1.5em] w-[1em] select-none overflow-hidden text-center text-3xl">
		<div class="absolute h-full w-full" style="transform: translate(0, {100 * offset}%)">
			<strong
				class="absolute -top-full flex h-full w-full select-none items-center justify-center font-normal"
				aria-hidden="true"
			>
				{Math.floor($displayedCount + 1) === -1 ? '?' : Math.floor($displayedCount + 1)}
			</strong>
			<strong class="absolute flex h-full w-full items-center justify-center font-normal">
				{Math.floor($displayedCount) === -1 ? '?' : Math.floor($displayedCount)}
			</strong>
		</div>
	</div>

	<button
		class="button flex w-0 touch-manipulation items-center justify-center overflow-hidden rounded-lg stroke-base-content text-2xl opacity-0 transition-all duration-300 hover:bg-neutral disabled:stroke-neutral disabled:hover:bg-transparent group-hover:w-[1.5em] group-hover:opacity-100"
		on:pointerdown={() => {
			if (count !== null && count < 10) {
				count += 1;
				updatePrediction();
			} else if (count === null) {
				initialisePrediction();
				updatePrediction();
			}
		}}
		aria-label="Increase by one"
		disabled={count !== null && count >= 10}
	>
		<svg class="h-1/3 w-1/3" aria-hidden="true" viewBox="0 0 1 1">
			<path d="M0,0.5 L1,0.5 M0.5,0 L0.5,1" class="stroke-2" />
		</svg>
	</button>
</div>

<style>
	path {
		vector-effect: non-scaling-stroke;
	}
</style>
