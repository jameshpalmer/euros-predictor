import type { Actions } from './$types';
import { sql } from '$lib/server/db';

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
		if (!locals.user) {
			return { status: 401 };
		}
		// check that the user has not already selected a team
		const [existingTeam, team] = await Promise.all([
			sql`
      SELECT sweepstake_team_id
      FROM auth_user
      WHERE id = ${locals.user.id}
      AND sweepstake_team_id IS NOT NULL;
    `,
			sql<{ id: number }[]>`
      SELECT id
      FROM team
      WHERE id NOT IN (
        SELECT sweepstake_team_id
        FROM auth_user
        WHERE sweepstake_team_id IS NOT NULL
      )
      ORDER BY RANDOM()
      LIMIT 1;
    `
		]);

		if (existingTeam.length !== 0) {
			return { status: 400, body: { error: 'You have already selected a team' } };
		}

		if (team.length === 0) {
			return { status: 400, body: { error: 'No teams available' } };
		}

		await sql`
      UPDATE auth_user
      SET sweepstake_team_id = ${team[0].id}
      WHERE id = ${locals.user.id};
    `;

		return { success: true };
	}
};
