'use client';

import { motion } from 'framer-motion';
import { Check, Trash2, Clock, Gauge } from 'lucide-react';
import { Reminder as AutoReminder, ReminderStatus } from '@/lib/auto/types';
import { useAppStore } from '@/lib/app-store';

type ReminderCardProps = {
  reminder: AutoReminder;
  status: ReminderStatus;
};

export function ReminderCard({ reminder, status }: ReminderCardProps) {
  const { completeAutoReminder, deleteAutoReminder } = useAppStore();

  const handleComplete = () => {
    completeAutoReminder(reminder.id);
  };

  const handleDelete = () => {
    deleteAutoReminder(reminder.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.01 }}
      className={`relative overflow-hidden rounded-2xl p-4 transition-all ${
        status.isOverdue ? 'border-2 border-rose-500/50' : 'border border-white/10'
      }`}
      style={{
        background: status.isOverdue
          ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Content */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          {/* Title */}
          <h3 className={`font-semibold mb-1 ${reminder.completed ? 'line-through text-zinc-500' : 'text-white'}`}>
            {reminder.title}
          </h3>

          {/* Status */}
          <div className="flex items-center gap-2 text-sm">
            {reminder.type === 'mileage' ? (
              <Gauge className="w-4 h-4 text-zinc-400" />
            ) : (
              <Clock className="w-4 h-4 text-zinc-400" />
            )}
            <span
              className={`font-medium ${
                status.isOverdue
                  ? 'text-rose-400'
                  : reminder.completed
                  ? 'text-zinc-500'
                  : 'text-emerald-400'
              }`}
            >
              {reminder.completed ? 'Выполнено' : status.displayText}
            </span>
          </div>

          {/* Recurrence badge */}
          {reminder.type === 'recurring' && reminder.recurrence && (
            <div className="inline-block mt-2 px-2 py-1 rounded-lg bg-violet-500/20 text-xs text-violet-400 font-medium">
              {reminder.recurrence === 'weekly' && 'Еженедельно'}
              {reminder.recurrence === 'monthly' && 'Ежемесячно'}
              {reminder.recurrence === 'yearly' && 'Ежегодно'}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {!reminder.completed && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleComplete}
              className="p-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 transition-colors"
              title="Отметить выполненным"
            >
              <Check className="w-4 h-4 text-emerald-400" />
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDelete}
            className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 transition-colors"
            title="Удалить"
          >
            <Trash2 className="w-4 h-4 text-rose-400" />
          </motion.button>
        </div>
      </div>

      {/* Overdue glow */}
      {status.isOverdue && !reminder.completed && (
        <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-rose-500/20 blur-2xl" />
      )}
    </motion.div>
  );
}
