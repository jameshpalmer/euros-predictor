import { sql } from '$lib/server/db.js';
import { error, json } from '@sveltejs/kit';

export async function PUT({ locals, request, params }) {
	if (!locals.user) {
		return error(401, 'Unauthorized');
	}

	const predictionId = params.predictionId;

	if (!predictionId) {
		return error(400, 'Missing predictionId parameter');
	}

	const prediction = await sql<{ user_id: string; kickoff_utc: Date }[]>`
		SELECT 
			mp.user_id,
			m.kickoff_utc
		FROM match_prediction mp
		LEFT JOIN match m ON mp.match_id = m.id
		WHERE mp.id = ${predictionId}
	`;

	// check time of match
	if (prediction.length === 0) {
		return error(400, 'Prediction not found');
	}

	const { user_id, kickoff_utc } = prediction[0];

	if (kickoff_utc < new Date()) {
		return error(400, 'Match has already started');
	}

	if (user_id !== locals.user.id) {
		return error(401, 'Unauthorized');
	}

	const body: {
		homeTeamScore: number;
		awayTeamScore: number;
	} = await request.json();

	const { homeTeamScore, awayTeamScore } = body;

	await sql`
    UPDATE match_prediction
    SET
      home_team_score = ${homeTeamScore},
      away_team_score = ${awayTeamScore}
    WHERE id = ${predictionId}
  `;

	return json({ success: true });
}
