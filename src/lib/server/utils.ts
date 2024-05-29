import type { EntraIdUser } from '../../routes/login/azure/callback/+server';
import { sql } from './db';

export async function createUserAndPredictions(userId: string, user: EntraIdUser) {
	await sql`
    INSERT INTO auth_user (id, azure_id, email, name)
    VALUES (${userId}, ${user.sub}, ${user.email}, ${user.given_name + ' ' + user.family_name})
  `;

	// Insert new rows into the match_prediction table for the new user and all matches
	await sql`
    INSERT INTO match_prediction (user_id, match_id)
    SELECT ${userId}, id
    FROM match
    WHERE NOT EXISTS (
      SELECT 1
      FROM match_prediction
      WHERE user_id = ${userId}
        AND match_id = match.id
    )
  `;
}
