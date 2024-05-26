import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { UserPrediction } from './api/user-predictions/[userId]/+server';

export const load: PageServerLoad = async ({ locals, fetch }) => {
	if (!locals.user) redirect(302, '/login');

	const userPredictionsResponse = await fetch('/api/user-predictions/' + locals.user.id);
	const initialUserPredictions: UserPrediction[] = await userPredictionsResponse.json();

	return {
		user: locals.user,
		initialUserPredictions
	};
};
