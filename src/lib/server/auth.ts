import { Lucia } from 'lucia';
import { MicrosoftEntraId } from 'arctic';
import { dev } from '$app/environment';
import { PostgresJsAdapter } from '@lucia-auth/adapter-postgresql';
import {
	AZURE_TENANT_ID,
	AZURE_CLIENT_ID,
	AZURE_CLIENT_SECRET,
	AZURE_REDIRECT_URI
} from '$env/static/private';
import type { AuthUser, UserSession } from '$lib/types/db';
import { sql } from './db';

const adapter = new PostgresJsAdapter(sql, {
	user: 'auth_user',
	session: 'user_session'
});

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		expires: false,
		attributes: {
			// set to `true` when using HTTPS
			secure: !dev
		}
	},
	getUserAttributes: (attributes) => ({
		id: attributes.id,
		azure_id: attributes.azure_id,
		email: attributes.email,
		name: attributes.name
	})
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: AuthUser;
		DatabaseSessionAttributes: UserSession;
	}
}

if (!AZURE_TENANT_ID || !AZURE_CLIENT_ID || !AZURE_CLIENT_SECRET || !AZURE_REDIRECT_URI) {
	throw new Error('Microsoft Azure credentials are missing');
}

export const entraId = new MicrosoftEntraId(
	AZURE_TENANT_ID,
	AZURE_CLIENT_ID,
	AZURE_CLIENT_SECRET,
	AZURE_REDIRECT_URI
);
