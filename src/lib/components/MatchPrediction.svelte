<script lang="ts">
	import { Counter } from '.';
	import type { UserPrediction } from '$lib/types';
	const flags = import.meta.glob('$lib/flags/*.svg', {
		eager: true,
		query: {
			enhanced: true
		}
	}) as Record<string, { default: string }>;

	const flagMap = new Map(
		Object.entries(flags).map(([key, value]) => [
			key.match(/([^/]+)\.svg$/)![1],
			value.default as string
		])
	) as Map<string, string>;

	console.log('flagMap:', flagMap);

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
</script>

<div class="group flex items-center">
	<div
		class="mr-5 h-[2em] w-[3em] overflow-hidden opacity-100 transition-all duration-300 group-hover:mr-0 group-hover:w-0 group-hover:opacity-0"
	>
		<img
			src={flagMap.get(userPrediction.home_team_name.toLowerCase())}
			alt={userPrediction.home_team_name}
			class="h-[2em] w-[3em] object-cover"
		/>
	</div>
	<p class="text-2xl">{userPrediction.home_team_name}</p>
	<Counter
		bind:count={userPrediction.home_team_score_prediction}
		{updatePrediction}
		{initialisePrediction}
	/>
	<Counter
		bind:count={userPrediction.away_team_score_prediction}
		{updatePrediction}
		{initialisePrediction}
	/>
	<p class="text-2xl">{userPrediction.away_team_name}</p>
	<div
		class="ml-5 h-[2em] w-[3em] overflow-hidden opacity-100 transition-all duration-300 group-hover:ml-0 group-hover:w-0 group-hover:opacity-0"
	>
		<img
			src={flagMap.get(userPrediction.away_team_name.toLowerCase())}
			alt={userPrediction.away_team_name}
			class="h-[2em] w-[3em] object-cover"
		/>
	</div>
</div>
