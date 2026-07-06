import { fileURLToPath } from 'node:url';

import { defineConfig } from '@vnphanquang/eslint-config';
import { jsdoc } from 'eslint-plugin-jsdoc';

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

const jsdocConfig = [
	jsdoc({
		files: ['src/**/*.js'],
		config: 'flat/recommended',
		rules: {
			'jsdoc/require-returns-description': 'off',
			// "jsdoc/require-param-description": "off",
			'jsdoc/require-jsdoc': [
				'warn',
				{
					publicOnly: {
						ancestorsOnly: true,
					},
				},
			],
			'jsdoc/tag-lines': 'off',
		},
	}),
];

export default await defineConfig(
	{
		additionalIgnoreFiles: [gitignorePath],
	},
	jsdocConfig,
);
