/**
 * Date Utilities for Analytics
 * 
 * Provides date manipulation and formatting functions for analytics calculations.
 */

import { DateRange } from '../types';

export class DateUtils {
  /**
   * Get ISO week boundaries (Monday to Sunday)
   */
  static getWeekBoundaries(date: Date): DateRange {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday

    const monday = new Date(date);
    monday.setDate(diff);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    return { start: monday, end: sunday };
  }

  /**
   * Get current month boundaries
   */
  static getMonthBoundaries(date: Date): DateRange {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }

  /**
   * Get days remaining in current month
   */
  static getDaysRemainingInMonth(date: Date): number {
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const currentDay = date.getDate();
    return lastDay - currentDay + 1;
  }

  /**
   * Parse transaction date string to Date object
   * Handles Russian date formats like "Сегодня", "Вчера"
   */
  static parseTransactionDate(dateStr: string): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dateStr === 'Сегодня' || dateStr === 'Today') {
      return today;
    }

    if (dateStr === 'Вчера' || dateStr === 'Yesterday') {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return yesterday;
    }

    // Try parsing as date string
    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) {
      parsed.setHours(0, 0, 0, 0);
      return parsed;
    }

    // Fallback to today if unparseable
    return today;
  }

  /**
   * Format date for display
   */
  static formatForDisplay(date: Date, locale: string = 'ru-RU'): string {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - compareDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return locale === 'ru-RU' ? 'Сегодня' : 'Today';
    if (diffDays === 1) return locale === 'ru-RU' ? 'Вчера' : 'Yesterday';

    return date.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
    });
  }

  /**
   * Check if date is in range
   */
  static isInRange(date: Date, range: DateRange): boolean {
    return date >= range.start && date <= range.end;
  }

  /**
   * Format date to ISO string (YYYY-MM-DD)
   */
  static toISODate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
