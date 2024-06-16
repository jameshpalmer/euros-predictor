import type { PageServerLoad } from './$types';
import { sql } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals }) => {
	// aggregate match_prediction.points for each auth_user, including rank
	const leaderboard = await sql<
		{
			user_id: string;
			user_name: string;
			points: number;
			rank: number;
		}[]
	>`
    SELECT
    mp.user_id,
    u.name as user_name,
    SUM(mp.points) as points,
    RANK() OVER (ORDER BY SUM(mp.points) DESC) as rank
    FROM (
      SELECT
        match_prediction.user_id,
        match_prediction.points,
        match_prediction.home_team_score,
        match_prediction.away_team_score
      FROM match_prediction
      LEFT JOIN match m ON match_prediction.match_id = m.id
      WHERE NOT (match_prediction.home_team_score IS NULL AND match_prediction.away_team_score IS NULL)
      AND m.kickoff_utc < NOW()
    ) mp
    LEFT JOIN auth_user u ON mp.user_id = u.id
    GROUP BY mp.user_id, u.name
    ORDER BY rank, user_name
  `;

	return {
		user: locals.user,
		leaderboard
	};
};
