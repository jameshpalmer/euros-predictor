import { sql } from '$lib/server/db.js';
import { error, json } from '@sveltejs/kit';
import { z } from 'zod';
import { DateTime } from 'luxon';

const predictionSchema = z.object({
	homeTeamScore: z.number().int(),
	awayTeamScore: z.number().int()
});

export async function PUT({ locals, request, params }) {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	const predictionId = params.predictionId;

	if (!predictionId) {
		throw error(400, 'Missing predictionId parameter');
	}

	const prediction = await sql<{ user_id: string; kickoff_utc: Date }[]>`
    SELECT 
      mp.user_id,
      m.kickoff_utc
    FROM match_prediction mp
    LEFT JOIN match m ON mp.match_id = m.id
    WHERE mp.id = ${predictionId}
  `;

	// Check time of match
	if (prediction.length === 0) {
		throw error(400, 'Prediction not found');
	}

	const { user_id, kickoff_utc } = prediction[0];

	const now = DateTime.now();
	const kickoffTime = DateTime.fromJSDate(kickoff_utc);

	if (kickoffTime < now) {
		throw error(400, 'Match has already started');
	}

	if (user_id !== locals.user.id) {
		throw error(401, 'Unauthorized');
	}

	// Parse and validate the request body
	const body = await request.json();
	const result = predictionSchema.safeParse(body);

	if (!result.success) {
		const { errors } = result.error;
		return json({ success: false, errors: errors.map((e) => e.message) }, { status: 400 });
	}

	const { homeTeamScore, awayTeamScore } = result.data;

	await sql`
    UPDATE match_prediction
    SET
      home_team_score = ${homeTeamScore},
      away_team_score = ${awayTeamScore}
    WHERE id = ${predictionId}
  `;

	return json({ success: true });
}
