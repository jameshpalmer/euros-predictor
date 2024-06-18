<script lang="ts">
	export let data;

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
</script>

<div class="flex w-screen max-w-full flex-col items-center gap-8 p-8 pt-2 sm:pt-8">
	<div class="flex w-full items-center justify-evenly gap-2 sm:max-w-[650px]">
		<img
			src={flagMap.get(data.match.home_team.toLowerCase())}
			alt={data.match.home_team}
			class="hidden h-12 w-auto shadow-md sm:block"
		/>
		<p class="flex-1 flex-grow truncate text-center text-xl sm:px-3 sm:text-3xl">
			{data.match.home_team}
		</p>
		<p
			class={`text-2xl sm:text-4xl ${data.match.home_team_score === null ? 'font-light opacity-50' : ''}`}
		>
			{data.match.home_team_score ?? 'TBC'}
		</p>
		<p class="text-xl sm:text-3xl">-</p>
		<p
			class={`text-2xl sm:text-4xl  ${data.match.home_team_score === null ? 'font-light opacity-50' : ''}`}
		>
			{data.match.away_team_score ?? 'TBC'}
		</p>
		<p class="flex-1 flex-grow truncate text-center text-xl sm:px-3 sm:text-3xl">
			{data.match.away_team}
		</p>
		<img
			src={flagMap.get(data.match.away_team.toLowerCase())}
			alt={data.match.away_team}
			class="hidden h-12 w-auto shadow-md sm:block"
		/>
	</div>
	<table class="table w-full sm:w-2/3">
		<thead>
			<tr>
				<th>Name</th>
				<th>{data.match.home_team}</th>
				<th>{data.match.away_team}</th>
				<th>Points</th>
			</tr>
		</thead>
		<tbody>
			{#each data.predictions as prediction}
				<tr class={data.user?.id === prediction.user_id ? 'bg-base-200' : ''}>
					<td>{prediction.user_name}</td>
					<td>{prediction.home_team_score}</td>
					<td>{prediction.away_team_score}</td>
					<td>{prediction.points ?? ''}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
