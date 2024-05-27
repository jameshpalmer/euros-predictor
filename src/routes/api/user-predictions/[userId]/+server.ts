import { sql } from '$lib/server/db.js';
import type { UserPrediction } from '$lib/types/index.js';
import { error, json } from '@sveltejs/kit';

export async function GET({ locals, params }) {
	if (!locals.user) {
		return error(401, 'Unauthorized');
	}

	const userId = params.userId;

	if (!userId) {
		return error(400, 'Missing userId parameter');
	}

	const isUser = userId === locals.user.id;

	const [user, userPredictions] = await Promise.all([
		sql<{ id: string }[]>`
			SELECT id
			FROM auth_user
			WHERE id = ${userId}
		`,
		sql<UserPrediction[]>`
      SELECT
        mp.id as prediction_id,
        m.kickoff_utc AT TIME ZONE 'UTC' as kickoff_utc,
        m.round,
				m.location,
				m.description,
				ht.name as home_team_name,
				at.name as away_team_name,
        m.home_team_score,
        m.away_team_score,
        mp.home_team_score as home_team_score_prediction,
        mp.away_team_score as away_team_score_prediction,
        m.kickoff_utc < NOW() as match_played
      FROM match m
			LEFT JOIN team ht ON m.home_team_id = ht.id
			LEFT JOIN team at ON m.away_team_id = at.id
      LEFT JOIN match_prediction mp ON m.id = mp.match_id
      WHERE mp.user_id = ${userId}
			AND m.home_team_id IS NOT NULL
			AND m.away_team_id IS NOT NULL
      ${!isUser ? sql`AND m.kickoff_utc < NOW()` : sql``}
			ORDER BY m.kickoff_utc
    `
	]);

	if (user.length === 0) {
		return error(400, 'User not found');
	}

	return json(userPredictions);
}
