/**
 * Formats numeric value into IDR string: Rp 125.000 (no decimals, dot as thousand separator)
 */
export function formatIdr(amount: number): string {
  const rounded = Math.round(amount);
  return 'Rp ' + rounded.toLocaleString('id-ID');
}

/**
 * Formats numeric value into JPY string: ¥5,000
 */
export function formatJpy(amount: number): string {
  return '¥' + Math.round(amount).toLocaleString('ja-JP');
}

/**
 * Calculates raw IDR from JPY with given exchange rate
 */
export function convertJpyToIdr(jpy: number, rate: number = 107.0): number {
  return jpy * rate;
}
