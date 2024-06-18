import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { UserPrediction } from '$lib/types';
import { sql } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals, fetch }) => {
	if (!locals.user) redirect(302, '/login');

	const userPredictionsResponse = await fetch('/api/user-predictions/' + locals.user.id);
	const initialUserPredictions: UserPrediction[] = await userPredictionsResponse.json();

	const pastUserPredictions = sql<
		{
			match_id: number;
			home_team: string;
			away_team: string;
			home_team_score: number;
			home_team_score_prediction: number;
			away_team_score: number;
			away_team_score_prediction: number;
			points: number;
		}[]
	>`
		SELECT
			m.id as match_id,
			ht.name as home_team,
			at.name as away_team,
			m.home_team_score,
			m.away_team_score,
			mp.home_team_score as home_team_score_prediction,
			mp.away_team_score as away_team_score_prediction,
			mp.points
		FROM match m
		LEFT JOIN team ht ON m.home_team_id = ht.id
		LEFT JOIN team at ON m.away_team_id = at.id
		LEFT JOIN match_prediction mp ON m.id = mp.match_id
		WHERE mp.user_id = ${locals.user.id}
		AND m.kickoff < NOW()
		ORDER BY m.kickoff, m.id
	`;

	return {
		user: locals.user,
		initialUserPredictions,
		pastUserPredictions
	};
};
