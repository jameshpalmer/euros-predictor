<script lang="ts">
	export let data;

	$: user = data.user;
</script>

<div class="flex w-screen justify-center p-8 pt-2 sm:pt-8">
	<article class="prose">
		<h1>Rules</h1>
		{#if !user}
			<p><a href="login/azure" class="underline">Sign in</a> to get started!</p>
		{/if}
		<p>
			Welcome to the quadrennial <i>Praesto Euro 2024 Footbal Predictions</i> competition! Participants
			will predict the outcomes of matches in the tournament to earn points. Here&#39;s how it works:
		</p>
		<h2>Group Stage Scoring</h2>
		<ul>
			<li><strong>1 point</strong> for getting the result right (win, draw, or loss).</li>
			<li>
				<strong>2 points</strong> for the correct goal difference (i.e. the correct winning margin for
				the correct team, or a draw).
			</li>
			<li><strong>3 points</strong> for predicting the exact score.</li>
		</ul>

		<h2>Knockout Stage Scoring</h2>
		<p>Points increase with each knockout round:</p>

		<h3>Round of 16</h3>
		<ul>
			<li><strong>2 points</strong> for getting the result right.</li>
			<li><strong>3 points</strong> for the correct goal difference.</li>
			<li><strong>4 points</strong> for predicting the exact score.</li>
		</ul>

		<h3>Quarterfinals</h3>
		<ul>
			<li><strong>3 points</strong> for getting the result right.</li>
			<li><strong>5 points</strong> for the correct goal difference.</li>
			<li><strong>7 points</strong> for predicting the exact score.</li>
		</ul>

		<h3>Semifinals</h3>
		<ul>
			<li><strong>4 points</strong> for getting the result right.</li>
			<li><strong>6 points</strong> for the correct goal difference.</li>
			<li><strong>8 points</strong> for predicting the exact score.</li>
		</ul>

		<h3>Final</h3>
		<ul>
			<li><strong>5 points</strong> for getting the result right.</li>
			<li><strong>7 points</strong> for the correct goal difference.</li>
			<li><strong>10 points</strong> for predicting the exact score.</li>
		</ul>

		<h2>How to Make Predictions</h2>
		<ol>
			<li>
				<strong>Pick a Match:</strong> Choose any upcoming match from the tournament schedule.
			</li>
			<li>
				<strong>Predict the Result:</strong> Enter your prediction for the match result (win for either
				team or draw).
			</li>
			<li><strong>Predict the Score:</strong> Enter your predicted final score for both teams.</li>
		</ol>

		<h2>Scoring Example</h2>
		<p>If Team A beats Team B with a score of 2-1:</p>
		<ul>
			<li>If you predicted a win for Team A, you earn points for the correct result.</li>
			<li>
				If you predicted a 1-goal difference in favor of Team A (e.g., 3-2), you earn points for the
				correct goal difference.
			</li>
			<li>If you predicted the exact score of 2-1, you earn points for the exact score.</li>
		</ul>

		<h2>Leaderboard</h2>
		<p>
			Check the leaderboard to see where you stand among colleagues. The person with the most points
			at the end of the tournament wins.
		</p>

		<h2>Additional Rules</h2>
		<ul>
			<li>Predictions can be made up until the kickoff time of each match.</li>
			<li>
				Points are awarded based on the final score at the end of the match, including any extra
				time during knockout stages - penalty shootouts do not count.
			</li>
		</ul>

		<h2>Terms and Conditions</h2>
		<ul>
			<li>Only Praesto group employees.</li>
			<li>We reserve the right to tweak the rules if needed.</li>
		</ul>

		<h2>Prizes</h2>
		<ul>
			<li>Bragging rights (lasting until 2026).</li>
			<li>We reserve the right to tweak the rules if needed.</li>
		</ul>

		<p>Good luck, everyone!</p>
	</article>
</div>
