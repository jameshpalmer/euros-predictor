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

export function getScoringRules(round: number) {
	switch (round) {
		case 1:
		case 2:
		case 3:
			return {
				result: 1,
				goalDifference: 2,
				exactScore: 3
			};
		case 4:
			return {
				result: 2,
				goalDifference: 3,
				exactScore: 4
			};
		case 5:
			return {
				result: 3,
				goalDifference: 5,
				exactScore: 7
			};
		case 6:
			return {
				result: 4,
				goalDifference: 6,
				exactScore: 8
			};
		case 7:
			return {
				result: 5,
				goalDifference: 7,
				exactScore: 10
			};
		default:
			throw new Error('Invalid round');
	}
}
