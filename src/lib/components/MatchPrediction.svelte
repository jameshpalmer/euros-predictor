<script lang="ts">
	import { Counter } from '.';
	import type { UserPrediction } from '$lib/types';
	const flags = import.meta.glob('$lib/flags/*.svg', {
		eager: true,
		query: {
			enhanced: true
		}
	}) as Record<string, { default: string }>;
	import { DateTime } from 'luxon';

	export let userPrediction: UserPrediction;

	export let makePrediction: ({
		predictionId,
		homeTeamScore,
		awayTeamScore
	}: {
		predictionId: number;
		homeTeamScore: number;
		awayTeamScore: number;
	}) => void;

	$: flagMap = new Map(
		Object.entries(flags).map(([key, value]) => [
			key.match(/([^/]+)\.svg$/)![1],
			value.default as string
		])
	) as Map<string, string>;

	function updatePrediction() {
		makePrediction({
			predictionId: userPrediction.prediction_id,
			homeTeamScore: userPrediction.home_team_score_prediction ?? 0,
			awayTeamScore: userPrediction.away_team_score_prediction ?? 0
		});
	}

	function initialisePrediction() {
		userPrediction = {
			...userPrediction,
			home_team_score_prediction: 0,
			away_team_score_prediction: 0
		};
	}

	const kickoffUtc = DateTime.fromISO(userPrediction.kickoff_utc);
	const localDateTime = kickoffUtc.setZone(DateTime.local().zoneName);
	const formattedDate = localDateTime.toFormat('ccc d LLLL HH:mm');
</script>

<div class="group flex flex-col items-center">
	<p
		class="pointer-events-none h-0 text-sm opacity-0 sm:opacity-60 sm:transition-opacity sm:group-hover:opacity-0"
	>
		{userPrediction.description}{' • '}
		{formattedDate}
	</p>
	<div class="flex w-full max-w-[450px] items-center justify-between">
		<div
			class="pointer-events-none flex h-[2em] w-[3em] select-none justify-start overflow-hidden opacity-100"
		>
			<img
				src={flagMap.get(userPrediction.home_team_name.toLowerCase())}
				alt={userPrediction.home_team_name}
				class="h-[2em] w-[3em] object-cover"
			/>
		</div>

		<div class="flex-1 flex-grow truncate">
			<p class="text-center text-lg sm:text-xl">
				{userPrediction.home_team_name}
			</p>
		</div>

		<Counter
			bind:count={userPrediction.home_team_score_prediction}
			class="w-1/12"
			{updatePrediction}
			{initialisePrediction}
		/>
		<p class="select-none text-xl opacity-50 sm:text-2xl">:</p>
		<Counter
			bind:count={userPrediction.away_team_score_prediction}
			class="w-1/12"
			{updatePrediction}
			{initialisePrediction}
		/>

		<div class="flex-1 flex-grow truncate">
			<p class="text-center text-lg sm:text-xl">
				{userPrediction.away_team_name}
			</p>
		</div>

		<div
			class="pointer-events-none flex h-[2em] w-[3em] select-none justify-end overflow-hidden opacity-100"
		>
			<img
				src={flagMap.get(userPrediction.away_team_name.toLowerCase())}
				alt={userPrediction.away_team_name}
				class="h-[2em] w-[3em] object-cover"
			/>
		</div>
	</div>
</div>
