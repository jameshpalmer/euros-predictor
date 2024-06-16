<script lang="ts">
	export let data;
</script>

<div class="flex w-screen max-w-full justify-center p-8 pt-2 sm:pt-8">
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
				<tr>
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
</div>
