/** @type {import('stylelint').Config} */
export default {
	extends: ['stylelint-config-standard', 'stylelint-config-clean-order'],
	rules: {
		'no-descending-specificity': null,
		'declaration-block-no-redundant-longhand-properties': null,
	},
	ignoreFiles: ['coverage/**', './styles/**'],
};
