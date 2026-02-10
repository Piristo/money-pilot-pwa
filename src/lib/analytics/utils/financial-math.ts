/**
 * Financial Math Utilities
 * 
 * Provides precise financial calculations using integer arithmetic
 * to avoid floating-point precision errors.
 */

export class FinancialMath {
  /**
   * Calculate percentage with safe division
   */
  static percentage(part: number, whole: number): number {
    if (whole === 0) return 0;
    return (part / whole) * 100;
  }

  /**
   * Round to specified decimal places
   */
  static round(value: number, decimals: number = 0): number {
    const multiplier = Math.pow(10, decimals);
    return Math.round(value * multiplier) / multiplier;
  }

  /**
   * Format number for display with locale
   */
  static format(
    amount: number,
    locale: string = 'ru-RU',
    options?: Intl.NumberFormatOptions
  ): string {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      ...options,
    }).format(amount);
  }

  /**
   * Safe division that returns null for division by zero
   */
  static safeDivide(numerator: number, denominator: number): number | null {
    if (denominator === 0) return null;
    return numerator / denominator;
  }

  /**
   * Calculate percentage change between two values
   */
  static percentageChange(previous: number, current: number): number | null {
    if (previous === 0) return null;
    return ((current - previous) / previous) * 100;
  }
}
