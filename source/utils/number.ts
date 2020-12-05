import { isNumber, isString } from "lodash";

/**
 * Formats a number using spaces as decimal separators.
 * @param value Value to format.
 */
export function formatNumber(value: number): string {
	return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/**
 * Sanitizes a given value into a number.
 * @param value Value to sanitize.
 */
export function sanitizeNumber(value: any): number {
	if (isString(value)) return parseFloat(value.replace(/[^0-9-.]/g, ""));
	if (isNumber(value)) return value;
	return NaN;
};

/**
 * Sanitizes a given value into a number.
 * @param value Value to sanitize.
 */
export function neutralizeNumber(value: number): number {
	if (isNaN(value)) return 0;
	return value;
};
