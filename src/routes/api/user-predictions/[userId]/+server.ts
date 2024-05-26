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
        m.kickoff,
        m.round,
				ht.name as home_team_name,
				at.name as away_team_name,
        m.home_team_score,
        m.away_team_score,
        mp.home_team_score as home_team_score_prediction,
        mp.away_team_score as away_team_score_prediction,
        m.kickoff < NOW() as match_played
      FROM match m
			LEFT JOIN team ht ON m.home_team_id = ht.id
			LEFT JOIN team at ON m.away_team_id = at.id
      LEFT JOIN match_prediction mp ON m.id = mp.match_id
      WHERE mp.user_id = ${userId}
      ${!isUser ? sql`AND m.kickoff < NOW()` : sql``}
			ORDER BY m.kickoff
    `
	]);

	if (user.length === 0) {
		return error(400, 'User not found');
	}

	return json(userPredictions);
}
