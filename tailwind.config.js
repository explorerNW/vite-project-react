const { addDynamicIconSelectors } = require('@iconify/tailwind');

/** @type {import('tailwindcss').Config} */

export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {},
	},
	plugins: [
		// Iconify plugin
		addDynamicIconSelectors({
			// Prefix for selectors, must be different for each addDynamicIconSelectors()
			prefix: 'icon',
			// Removes redundant rules
			overrideOnly: false,
			// Icon height, 0 to disable size
			scale: 1,
			// Custom icon sets
			iconSets: {},
			// Callback to customise icons (such as change stroke-width, color, etc...).
			// First param is content, second is icon name, third is icon set prefix.
			// Function should return modified content.
			customise: (content, name, prefix) => content,
		}),
	],
};
