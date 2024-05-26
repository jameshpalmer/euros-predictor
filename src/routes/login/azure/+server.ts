import { redirect } from '@sveltejs/kit';
import { generateState, generateCodeVerifier } from 'arctic';
import { entraId } from '$lib/server/auth';

export async function GET({ cookies, locals }): Promise<Response> {
	if (locals.user) {
		redirect(302, '/');
	}

	const state = generateState();
	const codeVerifier = generateCodeVerifier();
	const url = await entraId.createAuthorizationURL(state, codeVerifier, {
		scopes: ['openid', 'profile', 'email']
	});

	cookies.set('entra_id_oauth_state', state, {
		path: '/',
		secure: import.meta.env.PROD,
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax'
	});

	cookies.set('entra_id_code_verifier', codeVerifier, {
		path: '/',
		secure: import.meta.env.PROD,
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax'
	});

	redirect(302, url.toString());
}
