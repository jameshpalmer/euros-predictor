import { sql } from '$lib/server/db.js';
import { error, json } from '@sveltejs/kit';
import { z } from 'zod';

import { getScoringRules } from '$lib/server/utils.js';
import { DateTime } from 'luxon';

const matchResultSchema = z.object({
	homeTeamScore: z.number().int(),
	awayTeamScore: z.number().int()
});

export async function POST({ request, locals, params }) {
	if (!locals.user?.admin) {
		throw error(401, 'Unauthorized');
	}

	const matchId = params.matchId;

	if (!matchId) {
		throw error(400, 'Missing matchId parameter');
	}

	const body = await request.json();
	const result = matchResultSchema.safeParse(body);

	if (!result.success) {
		const { errors } = result.error;
		return json({ success: false, errors: errors.map((e) => e.message) }, { status: 400 });
	}

	const { homeTeamScore, awayTeamScore } = result.data;

	// Check if match exists and has started
	const match = await sql<
		{
			kickoff: Date;
			round: number;
		}[]
	>`
    SELECT kickoff, round
    FROM match
    WHERE id = ${matchId}
  `;

	if (match.length === 0) {
		throw error(400, 'Match not found');
	}

	if (DateTime.fromJSDate(match[0].kickoff, { zone: 'utc' }) > DateTime.utc()) {
		return error(400, 'Match has not started yet');
	}

	// Update match result
	await sql`
    UPDATE match
    SET home_team_score = ${homeTeamScore},
        away_team_score = ${awayTeamScore}
    WHERE id = ${matchId}
  `;

	// Update match points predictions
	const scoringRules = getScoringRules(match[0].round);

	const predictions = await sql<
		{
			id: string;
			home_team_score: number;
			away_team_score: number;
		}[]
	>`
    SELECT id, home_team_score, away_team_score
    FROM match_prediction
    WHERE match_id = ${matchId}
  `;

	// Calculate points for each prediction
	const updates = predictions.map((prediction) => {
		let points = 0;

		const predictedHomeScore = prediction.home_team_score;
		const predictedAwayScore = prediction.away_team_score;

		if (predictedHomeScore === null || predictedAwayScore === null) {
			return { id: prediction.id, points };
		}

		// Check if the result is correct
		if (
			(homeTeamScore > awayTeamScore && predictedHomeScore > predictedAwayScore) ||
			(homeTeamScore < awayTeamScore && predictedHomeScore < predictedAwayScore) ||
			(homeTeamScore === awayTeamScore && predictedHomeScore === predictedAwayScore)
		) {
			points = scoringRules.result;
		} else {
			return { id: prediction.id, points };
		}

		// Check if the goal difference is correct
		if (homeTeamScore - awayTeamScore === predictedHomeScore - predictedAwayScore) {
			points = scoringRules.goalDifference;
		} else {
			return { id: prediction.id, points };
		}

		// Check if the exact score is predicted
		if (homeTeamScore === predictedHomeScore && awayTeamScore === predictedAwayScore) {
			points = scoringRules.exactScore;
		}

		return { id: prediction.id, points };
	});

	// Batch update the points for all predictions
	const updateQueries = updates.map(
		(update) => sql`
    UPDATE match_prediction
    SET points = ${update.points}
    WHERE id = ${update.id}
`
	);

	await Promise.all(updateQueries);

	return json({ success: true });
}
