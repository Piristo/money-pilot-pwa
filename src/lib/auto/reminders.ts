/**
 * Reminder System Utilities
 * 
 * Functions to calculate reminder status, urgency, and sorting.
 */

import { Reminder as AutoReminder, ReminderStatus } from './types';

/**
 * Calculate reminder status with remaining time/km and overdue detection
 */
export function getReminderStatus(
  reminder: AutoReminder,
  currentMileage: number
): ReminderStatus {
  const now = new Date();
  
  // Mileage-based reminder
  if (reminder.type === 'mileage' && reminder.targetMileage !== undefined) {
    const remainingKm = reminder.targetMileage - currentMileage;
    const isOverdue = remainingKm < 0;
    
    const displayText = isOverdue
      ? `Просрочено на ${Math.abs(remainingKm)} км`
      : `Через ${remainingKm} км`;
    
    return {
      id: reminder.id,
      isOverdue,
      remainingKm,
      displayText,
    };
  }
  
  // Date-based reminder
  if (reminder.type === 'date' && reminder.targetDate) {
    const targetDate = new Date(reminder.targetDate);
    const diffMs = targetDate.getTime() - now.getTime();
    const remainingDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const isOverdue = remainingDays < 0;
    
    const displayText = isOverdue
      ? `Просрочено на ${Math.abs(remainingDays)} дн.`
      : remainingDays === 0
      ? 'Сегодня'
      : remainingDays === 1
      ? 'Завтра'
      : `Через ${remainingDays} дн.`;
    
    return {
      id: reminder.id,
      isOverdue,
      remainingDays,
      displayText,
    };
  }
  
  // Recurring reminder (treat as date-based if targetDate exists)
  if (reminder.type === 'recurring' && reminder.targetDate) {
    const targetDate = new Date(reminder.targetDate);
    const diffMs = targetDate.getTime() - now.getTime();
    const remainingDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const isOverdue = remainingDays < 0;
    
    const displayText = isOverdue
      ? `Просрочено на ${Math.abs(remainingDays)} дн.`
      : remainingDays === 0
      ? 'Сегодня'
      : remainingDays === 1
      ? 'Завтра'
      : `Через ${remainingDays} дн.`;
    
    return {
      id: reminder.id,
      isOverdue,
      remainingDays,
      displayText,
    };
  }
  
  // Fallback for invalid reminders
  return {
    id: reminder.id,
    isOverdue: false,
    displayText: 'Не настроено',
  };
}

/**
 * Sort reminders by urgency (overdue first, then by remaining time/km)
 */
export function sortRemindersByUrgency(
  reminders: AutoReminder[],
  currentMileage: number
): AutoReminder[] {
  return [...reminders].sort((a, b) => {
    const statusA = getReminderStatus(a, currentMileage);
    const statusB = getReminderStatus(b, currentMileage);
    
    // Overdue reminders first
    if (statusA.isOverdue && !statusB.isOverdue) return -1;
    if (!statusA.isOverdue && statusB.isOverdue) return 1;
    
    // If both overdue, sort by most overdue
    if (statusA.isOverdue && statusB.isOverdue) {
      if (statusA.remainingDays !== undefined && statusB.remainingDays !== undefined) {
        return statusA.remainingDays - statusB.remainingDays; // More negative = more overdue
      }
      if (statusA.remainingKm !== undefined && statusB.remainingKm !== undefined) {
        return statusA.remainingKm - statusB.remainingKm; // More negative = more overdue
      }
    }
    
    // If both not overdue, sort by soonest
    if (!statusA.isOverdue && !statusB.isOverdue) {
      if (statusA.remainingDays !== undefined && statusB.remainingDays !== undefined) {
        return statusA.remainingDays - statusB.remainingDays; // Smaller = sooner
      }
      if (statusA.remainingKm !== undefined && statusB.remainingKm !== undefined) {
        return statusA.remainingKm - statusB.remainingKm; // Smaller = sooner
      }
    }
    
    return 0;
  });
}

/**
 * Filter active (not completed) reminders
 */
export function getActiveReminders(reminders: AutoReminder[]): AutoReminder[] {
  return reminders.filter(r => !r.completed);
}

/**
 * Get overdue reminders count
 */
export function getOverdueCount(
  reminders: AutoReminder[],
  currentMileage: number
): number {
  return reminders.filter(r => {
    if (r.completed) return false;
    const status = getReminderStatus(r, currentMileage);
    return status.isOverdue;
  }).length;
}
