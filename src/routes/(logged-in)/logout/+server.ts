import { lucia } from '$lib/server/auth.js';
import { json, redirect } from '@sveltejs/kit';

export async function GET({ locals, cookies }) {
	if (!locals.user) {
		redirect(302, '/');
	}

	if (!locals.session) {
		return json({
			status: 500,
			body: 'Session not found'
		});
	}

	await lucia.invalidateSession(locals.session.id);
	const sessionCookie = lucia.createBlankSessionCookie();
	cookies.set(sessionCookie.name, sessionCookie.value, {
		path: '.',
		...sessionCookie.attributes
	});

	redirect(302, '/');
}
