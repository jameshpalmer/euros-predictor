<script lang="ts">
	import { Counter } from '.';
	import type { UserPrediction } from '../../routes/api/user-predictions/[userId]/+server';

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

<div class="flex">
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
</div>
