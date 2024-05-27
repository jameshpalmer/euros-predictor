import { sql } from '$lib/server/db.js';
import type { Match } from '$lib/types/db.js';
import { error, json } from '@sveltejs/kit';

export async function GET({ locals, params }) {
	if (!locals.user) {
		return error(401, 'Unauthorized');
	}

	const matchId = params.matchId;

	if (!matchId) {
		return error(400, 'Missing matchId parameter');
	}

	const [match, matchPredictions] = await Promise.all([
		sql<Match[]>`SELECT * FROM match WHERE id = ${matchId}`,
		sql<
			{
				user_id: string;
				home_team_score: number | null;
				away_team_score: number | null;
				user_name: string;
			}[]
		>`
			SELECT
					mp.user_id,
					mp.home_team_score,
					mp.away_team_score,
					u.name as user_name
			FROM match m
			LEFT JOIN match_prediction mp ON m.id = mp.match_id
			LEFT JOIN auth_user u ON mp.user_id = u.id
			WHERE m.id = ${matchId}
			AND mp.home_team_score IS NOT NULL
			AND mp.away_team_score IS NOT NULL
			ORDER BY m.kickoff_utc
		`
	]);

	if (match.length === 0 || match[0].kickoff_utc > new Date()) {
		return error(400, 'Match not found');
	}

	return json(matchPredictions);
}
