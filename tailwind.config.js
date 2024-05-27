/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			transitionProperty: {
				width: 'width'
			}
		}
	},
	daisyui: {
		themes: ['light', 'dark', 'cupcake']
	},
	plugins: [require('@tailwindcss/typography'), require('daisyui')]
};
