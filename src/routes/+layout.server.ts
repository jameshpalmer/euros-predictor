export const load = async ({ locals }) => {
	return {
		user: locals.user,
		theme: locals.theme
	};
};
