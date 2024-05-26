import { sql } from '$lib/server/db.js';
import { error, json } from '@sveltejs/kit';

export async function PUT({ locals, request, params }) {
	if (!locals.user) {
		return error(401, 'Unauthorized');
	}

	const predictionId = params.predictionId;

	const body: {
		homeTeamScore: number;
		awayTeamScore: number;
	} = await request.json();

	const { homeTeamScore, awayTeamScore } = body;

	if (!predictionId) {
		return error(400, 'Missing predictionId parameter');
	}

	await sql`
    UPDATE match_prediction
    SET
      home_team_score = ${homeTeamScore},
      away_team_score = ${awayTeamScore}
    WHERE id = ${predictionId}
  `;

	return json({ success: true });
}
