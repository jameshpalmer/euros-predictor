<script lang="ts">
	const flags = import.meta.glob('$lib/flags/*.svg', {
		eager: true,
		query: {
			enhanced: true
		}
	}) as Record<string, { default: string }>;

	$: flagMap = new Map(
		Object.entries(flags).map(([key, value]) => [
			key.match(/([^/]+)\.svg$/)![1],
			value.default as string
		])
	) as Map<string, string>;

	export let matchId: number;
	export let homeTeam: string;
	export let awayTeam: string;
	export let predictedScore: { home: number | null; away: number | null };
	export let actualScore: { home: number | null; away: number | null };
	export let points: number;
</script>

<a
	class="group relative -mx-3 -mt-2 mb-4 flex flex-col items-center rounded-xl px-3 py-2 transition-colors hover:bg-base-300"
	data-sveltekit-preload-data="hover"
	href={`/match/${matchId}`}
>
	<p class="pointer-events-none h-6 text-sm opacity-60">
		Actual Score: <strong>{actualScore.home ?? 'TBC'} - {actualScore.away ?? 'TBC'}</strong>{' • '}
		{points ?? '?'} Point{points === 1 ? '' : 's'}
	</p>
	<div class="flex w-full justify-center opacity-50">
		<div class="flex w-full max-w-[450px] items-center justify-between">
			<div
				class="pointer-events-none flex h-[2em] w-[3em] select-none justify-start overflow-hidden opacity-100"
			>
				<img
					src={flagMap.get(homeTeam.toLowerCase())}
					alt={homeTeam}
					class="h-[2em] w-[3em] object-cover"
				/>
			</div>
			<div class="flex-1 flex-grow truncate">
				<p class="text-center text-lg sm:text-xl">
					{homeTeam}
				</p>
			</div>
			<p class="w-1/12 text-center text-3xl">{predictedScore.home ?? '-'}</p>
			<p class="select-none text-xl opacity-50 sm:text-2xl">:</p>
			<p class="w-1/12 text-center text-3xl">{predictedScore.away ?? '-'}</p>
			<div class="flex-1 flex-grow truncate">
				<p class="text-center text-lg sm:text-xl">
					{awayTeam}
				</p>
			</div>
			<div
				class="pointer-events-none flex h-[2em] w-[3em] select-none justify-start overflow-hidden opacity-100"
			>
				<img
					src={flagMap.get(awayTeam.toLowerCase())}
					alt={awayTeam}
					class="h-[2em] w-[3em] object-cover"
				/>
			</div>
		</div>
	</div>
</a>
