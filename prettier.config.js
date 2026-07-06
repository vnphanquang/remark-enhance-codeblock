/** @type {import('prettier').Config} */
export default {
	semi: true,
	useTabs: true,
	singleQuote: true,
	trailingComma: 'all',
	printWidth: 100,
	plugins: ['prettier-plugin-embed'],
	overrides: [{ files: '**/*.yaml', options: { proseWrap: 'always' } }],
};
