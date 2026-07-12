export class InvalidMetaAttributeValueError extends Error {
	/** @type {{ attribute: string, expectOneOf: ReadonlyArray<string>, actual: string }} */
	cause;

	/**
	 * @param {string} attributeName
	 * @param {string} attributeValue
	 * @param {ReadonlyArray<string>} allowedValues
	 */
	constructor(attributeName, attributeValue, allowedValues) {
		super(
			`Invalid value for meta attribute "${attributeName}": "${attributeValue}". Allowed values are: ${allowedValues.join(', ')}`,
		);
		this.name = 'InvalidMetaAttributeValueError';
		this.cause = {
			attribute: attributeName,
			expectOneOf: allowedValues,
			actual: attributeValue,
		};
	}
}
