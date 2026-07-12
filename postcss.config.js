import cssnano from 'cssnano';

/** @type {import('postcss-load-config').ConfigFn} */
export default (ctx) => ({
	map: ctx?.options?.map ?? 'inline',
	plugins: [
		cssnano({
			preset: 'default',
		}),
	],
});
