import type { Actions } from './$types';
import { sql } from '$lib/server/db';
import { fail } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	const user = locals.user;

	const [sweepstakeEntries, remainingTeams, userTeams] = await Promise.all([
		sql<{ id: string; name: string; team: string }[]>`
      SELECT u.id, u.name, t.name as team
      FROM auth_user u
      JOIN team t ON u.sweepstake_team_id = t.id
      ORDER BY u.id = ${user ? user.id : null} DESC, t.name;
    `,
		sql<{ id: number; name: string }[]>`
      SELECT t.*
      FROM team t
      LEFT JOIN auth_user u ON t.id = u.sweepstake_team_id
      WHERE u.sweepstake_team_id IS NULL;
    `,
		user
			? sql<{ team: string }[]>`
      SELECT t.name as team
      FROM auth_user u
      JOIN team t ON u.sweepstake_team_id = t.id
      WHERE u.id = ${user.id};
    `
			: []
	]);

	let userTeam: string | null = null;
	if (userTeams.length > 0) {
		userTeam = userTeams[0].team;
	}

	return {
		userTeam,
		sweepstakeEntries,
		isSweepstakeFull: remainingTeams.length === 0
	};
};

export const actions: Actions = {
	default: async ({ locals }) => {
		try {
			const result = await sql.begin(async (transaction) => {
				if (!locals.user) {
					return { status: 401 };
				}

				const team = await transaction`
					WITH selected_team AS (
						SELECT id
						FROM team
						WHERE id NOT IN (
							SELECT sweepstake_team_id
							FROM auth_user
							WHERE sweepstake_team_id IS NOT NULL
						)
						ORDER BY RANDOM()
						LIMIT 1
						FOR UPDATE SKIP LOCKED
					)
					UPDATE auth_user
					SET sweepstake_team_id = (SELECT id FROM selected_team)
					WHERE id = ${locals.user.id}
					AND sweepstake_team_id IS NULL
					RETURNING (SELECT id FROM selected_team) AS team_id;
				`;

				// Check if the update was successful by looking at the returned result
				if (team.count === 0 || !team[0].team_id) {
					throw new Error('No teams available or you have already selected a team');
				}

				return team[0].team_id;
			});

			return { success: true, team_id: result };
		} catch (error: any) {
			if (error.message === 'No teams available or you have already selected a team') {
				return fail(400, { error: error.message });
			}
			return fail(500, { error: 'An error occurred while selecting a team' });
		}
	}
};
