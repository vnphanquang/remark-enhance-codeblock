/** @type {import('stylelint').Config} */
export default {
	extends: ['stylelint-config-standard', 'stylelint-config-clean-order'],
	rules: {
		'declaration-block-no-redundant-longhand-properties': [
			true,
			{
				ignoreLonghands: ['padding-block-end', 'padding-block-start'],
			},
		],
	},
	ignoreFiles: ['coverage/**'],
};

