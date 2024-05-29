import { OAuth2RequestError } from 'arctic';
import { generateIdFromEntropySize, type RegisteredDatabaseSessionAttributes } from 'lucia';
import { entraId, lucia } from '$lib/server/auth';

import { redirect } from '@sveltejs/kit';
import { sql } from '$lib/server/db';
import type { AuthUser } from '$lib/types/db';
import { createUserAndPredictions } from '$lib/server/utils.js';

export async function GET({ locals, url, cookies }): Promise<Response> {
	if (locals.user) {
		redirect(302, '/');
	}

	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const storedState = cookies.get('entra_id_oauth_state') ?? null;
	const storedCodeVerifier = cookies.get('entra_id_code_verifier') ?? null;

	if (!code || !state || !storedCodeVerifier || !storedState || state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	try {
		const tokens = await entraId.validateAuthorizationCode(code, storedCodeVerifier);
		const entraIdUserResponse = await fetch('https://graph.microsoft.com/oidc/userinfo', {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		});
		const entraIdUser: EntraIdUser = await entraIdUserResponse.json();

		const existingUserQuery = await sql<
			AuthUser[]
		>`SELECT * FROM auth_user WHERE azure_id = ${entraIdUser.sub}`;

		if (existingUserQuery.length > 0) {
			const existingUser = existingUserQuery[0];

			const session = await lucia.createSession(
				existingUser.id,
				{} as RegisteredDatabaseSessionAttributes
			);

			const sessionCookie = lucia.createSessionCookie(session.id);
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		} else {
			const userId = generateIdFromEntropySize(10);

			await createUserAndPredictions(userId, entraIdUser);

			const session = await lucia.createSession(userId, {} as RegisteredDatabaseSessionAttributes);
			const sessionCookie = lucia.createSessionCookie(session.id);
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		}
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/'
			}
		});
	} catch (e) {
		// the specific error message depends on the provider
		if (e instanceof OAuth2RequestError) {
			// invalid code
			return new Response(null, {
				status: 400
			});
		}
		return new Response(null, {
			status: 500
		});
	}
}

export interface EntraIdUser {
	sub: string;
	email: string;
	given_name: string;
	family_name: string;
	locale: string;
	picture: string;
	'@odata.context': string;
}
