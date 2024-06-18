<script lang="ts">
	import { useQueryClient, createQuery, createMutation } from '@tanstack/svelte-query';

	import { MatchPrediction, PastPrediction } from '$lib/components';
	import type { UserPrediction } from '$lib/types';

	export let data;

	let pastPredictionsExpanded = false;

	const { user, initialUserPredictions } = data;

	const client = useQueryClient();

	function fetchUserPredictions(): Promise<UserPrediction[]> {
		return fetch(`/api/user-predictions/${user.id}`).then((res) => res.json());
	}

	function makePrediction({
		predictionId,
		homeTeamScore,
		awayTeamScore
	}: {
		predictionId: number;
		homeTeamScore: number;
		awayTeamScore: number;
	}) {
		return fetch(`/api/prediction/${predictionId}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ homeTeamScore, awayTeamScore })
		}).then((res) => res.json());
	}

	function handleExpandPastPredictions() {
		pastPredictionsExpanded = true;
		const anchorId = `anchor-${data.initialUserPredictions[0].prediction_id}`;
		const anchor = document.getElementById(anchorId);
		if (anchor) {
			window.scrollTo({
				top: anchor.offsetTop - 139,
				behavior: 'instant'
			});
		}
	}

	const userPredictions = createQuery<UserPrediction[]>({
		queryKey: ['userPredictions'],
		queryFn: fetchUserPredictions,
		initialData: initialUserPredictions
	});

	const makePredictionMutation = createMutation({
		mutationFn: makePrediction,
		onMutate: async ({
			predictionId,
			homeTeamScore,
			awayTeamScore
		}: {
			predictionId: number;
			homeTeamScore: number;
			awayTeamScore: number;
		}) => {
			// Cancel any outgoing refetches (so they don't overwrite our optimistic update)
			await client.cancelQueries({ queryKey: ['userPredictions'] });

			// Snapshot the previous value
			const previousUserPredictions = client.getQueryData<UserPrediction[]>(['optimistic']);

			// Optimistically update to the new value
			if (previousUserPredictions) {
				client.setQueryData<UserPrediction[]>(
					['optimistic'],
					previousUserPredictions.map((prediction) => {
						if (prediction.prediction_id === predictionId) {
							return { ...prediction, homeTeamScore, awayTeamScore };
						}
						return prediction;
					})
				);
			}

			return { previousUserPredictions };
		},
		// If the mutation fails, use the context returned from onMutate to roll back
		onError: (_err: any, _variables: any, context: any) => {
			if (context?.previousUserPredictions) {
				client.setQueryData<UserPrediction[]>(['optimistic'], context.previousTodos);
			}
		},
		// Always refetch after error or success:
		onSettled: () => {
			client.invalidateQueries({ queryKey: ['userPredictions'] });
		}
	});
</script>

{#if $userPredictions.isLoading}
	<p>Loading...</p>
{:else if $userPredictions.isError}
	<p>Error: {$userPredictions.error.message}</p>
{:else if $userPredictions.data.length === 0}
	<p>No predictions yet!</p>
{:else}
	<div class="flex w-screen max-w-full flex-col items-center p-2 sm:px-8 sm:pt-6 lg:px-24">
		{#if pastPredictionsExpanded}
			<div class="grid w-full max-w-[1020px] grid-cols-1 gap-x-12 lg:grid-cols-2">
				{#await data.pastUserPredictions}
					Loading past predictions...
				{:then pastUserPredictions}
					{#each pastUserPredictions as prediction}
						<PastPrediction
							matchId={prediction.match_id}
							homeTeam={prediction.home_team}
							awayTeam={prediction.away_team}
							predictedScore={{
								home: prediction.home_team_score_prediction,
								away: prediction.away_team_score_prediction
							}}
							actualScore={{ home: prediction.home_team_score, away: prediction.away_team_score }}
							points={prediction.points}
						/>
					{/each}
				{/await}
			</div>
		{:else}
			<button on:click={handleExpandPastPredictions} class="btn btn-ghost">
				<p class="flex items-center gap-2 opacity-50">
					<span>See Past Predictions</span>
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
						class="lucide lucide-arrow-up"
					>
						<path d="m5 12 7-7 7 7" />
						<path d="M12 19V5" />
					</svg>
				</p>
			</button>
		{/if}
		<div class="grid w-full max-w-[1020px] grid-cols-1 gap-x-12 lg:grid-cols-2">
			{#each $userPredictions.data as prediction}
				<MatchPrediction
					userPrediction={prediction}
					makePrediction={$makePredictionMutation.mutate}
				/>
			{/each}
		</div>
	</div>
{/if}
