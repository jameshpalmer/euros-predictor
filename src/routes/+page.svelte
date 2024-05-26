<script lang="ts">
	import { useQueryClient, createQuery, createMutation } from '@tanstack/svelte-query';

	import { MatchPrediction } from '$lib/components';
	import type { UserPrediction } from './api/user-predictions/[userId]/+server.js';

	export let data;

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
		onError: (err: any, variables: any, context: any) => {
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

<h1>Hello, {user.name}</h1>

{#if $userPredictions.isLoading}
	<p>Loading...</p>
{:else if $userPredictions.isError}
	<p>Error: {$userPredictions.error.message}</p>
{:else if $userPredictions.data.length === 0}
	<p>No predictions yet!</p>
{:else}
	{#each $userPredictions.data as prediction}
		<MatchPrediction userPrediction={prediction} makePrediction={$makePredictionMutation.mutate} />
	{/each}
{/if}
