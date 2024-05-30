<script lang="ts">
	import { applyAction, enhance } from '$app/forms';

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

	export let data;

	let { user, userTeam, sweepstakeEntries, isSweepstakeFull } = data;
</script>

<div
	class="flex w-screen max-w-full flex-col items-center justify-center gap-2 p-8 pt-4 sm:gap-8 sm:pt-8"
>
	{#if isSweepstakeFull}
		{#if !user}
			<p>
				If you entered the sweepstake, <a href="login/azure" class="underline">sign in</a> to see your
				team!
			</p>
		{/if}
	{:else if !user}
		<p>
			To enter the sweepstake, <a href="login/azure" class="underline">sign in</a>!
		</p>
	{:else if !userTeam}
		<form method="POST">
			<button type="submit" class="btn">Enter Sweepstake</button>
		</form>
	{:else}
		<div class="mb-5 flex items-center gap-6">
			<h1 class="text-2xl">Your Team:</h1>
			<div class="flex flex-col items-center gap-2">
				<img
					src={flagMap.get(userTeam.toLowerCase())}
					alt={userTeam}
					class="h-20 w-auto shadow-md"
				/>
				<p class="h-0">{userTeam}</p>
			</div>
		</div>
	{/if}
	<table class="table">
		<thead>
			<tr>
				<th class="hidden sm:table-cell"></th>
				<th>Name</th>
				<th>Team</th>
			</tr>
		</thead>
		<tbody>
			{#each sweepstakeEntries as entry}
				<tr class={entry.id === user?.id ? 'bg-base-200' : ''}>
					<th class="hidden sm:table-cell"></th>
					<td>{entry.name}</td>
					<td>
						<div class="flex items-center gap-3">
							<img
								src={flagMap.get(entry.team.toLowerCase())}
								alt={entry.team}
								class="pointer-events-none h-6 w-auto select-none items-center"
							/>
							<p>{entry.team}</p>
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
