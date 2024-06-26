import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	if (!locals.user) redirect(302, '/rules');

	redirect(302, '/predictions');
};
