<script lang="ts">
	import { DateTime } from 'luxon';
	export let data;

	let lastUpdated: string | null = null;
	if (data.lastUpdatedUtc) {
		// Parse the date string as UTC
		let utcDateTime = DateTime.fromISO(data.lastUpdatedUtc, { zone: 'utc' });

		// Convert to local time zone
		let localDateTime = utcDateTime.setZone(DateTime.local().zoneName);

		// Format the local time zone date
		lastUpdated = localDateTime.toFormat('ccc d LLLL HH:mm');
	}
</script>

<div class="flex w-screen max-w-full flex-col items-center p-8 pt-2 sm:pt-8">
	<table class="table w-full sm:w-2/3">
		<thead>
			<tr>
				<th></th>
				<th>Name</th>
				<th>Points</th>
			</tr>
		</thead>
		<tbody>
			{#each data.leaderboard as user}
				<tr class={data.user?.id === user.user_id ? 'bg-base-200' : ''}>
					<td class="opacity-30">{user.rank}</td>
					<td
						class={user.rank == 1
							? 'text-[#e0b15e]'
							: user.rank == 2
								? 'text-[#a6a5a4]'
								: user.rank == 3
									? 'text-[#967b51]'
									: ''}>{user.user_name}</td
					>
					<td>{user.points}</td>
				</tr>
			{/each}
		</tbody>
	</table>
	<p class="opacity-30">Last updated: {lastUpdated}</p>
</div>
