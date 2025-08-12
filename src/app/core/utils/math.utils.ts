/**
 * Math utility functions
 */

/**
 * Rounds a number to two decimal places
 * @param value The number to round
 * @returns The number rounded to two decimal places
 */
export function roundToTwo(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Rounds a number to a specified number of decimal places
 * @param value The number to round
 * @param decimals The number of decimal places (default: 2)
 * @returns The number rounded to the specified decimal places
 */
export function roundToDecimals(value: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
