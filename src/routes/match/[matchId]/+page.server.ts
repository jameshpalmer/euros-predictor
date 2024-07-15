import { sql } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const { matchId } = params;

	// if match is in the past, return 404 error
	const [matchCount] = await sql<{ count: number }[]>`
    SELECT COUNT(*) as count
    FROM match
    WHERE id = ${matchId}
    AND kickoff < NOW()
  `;

	if (matchCount.count == 0) {
		error(404, {
			message: 'Not found'
		});
	}

	// fetch match details
	const [match] = await sql<
		{
			id: string;
			home_team: string;
			away_team: string;
			kickoff: Date;
			home_team_score: number | null;
			away_team_score: number | null;
		}[]
	>`
    SELECT
      m.id,
      ht.name as home_team,
      at.name as away_team,
      m.kickoff,
      m.home_team_score,
      m.away_team_score
    FROM match m
    LEFT JOIN team ht ON m.home_team_id = ht.id
    LEFT JOIN team at ON m.away_team_id = at.id
    WHERE m.id = ${matchId}
  `;

	const predictions = await sql<
		{
			user_id: string;
			user_name: string;
			home_team_score: number;
			away_team_score: number;
			points: number | null;
		}[]
	>`
    SELECT
      mp.user_id,
      u.name as user_name,
      mp.home_team_score,
      mp.away_team_score,
      mp.points
    FROM match_prediction mp
    LEFT JOIN auth_user u ON mp.user_id = u.id
    WHERE mp.match_id = ${matchId}
    AND NOT (mp.home_team_score IS NULL AND mp.away_team_score IS NULL)
    ORDER BY mp.points DESC, u.name
  `;

	return {
		user: locals.user,
		match,
		predictions
	};
};
