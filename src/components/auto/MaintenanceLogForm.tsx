'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';
import { useAppStore } from '@/lib/app-store';
import { AUTO_CATEGORIES } from '@/lib/auto/categories';
import { useToast } from '@/components/ui/toast';

type MaintenanceLogFormProps = {
  onClose: () => void;
};

export function MaintenanceLogForm({ onClose }: MaintenanceLogFormProps) {
  const { addMaintenanceLog, maintenanceLogs } = useAppStore();
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'maintenance' as 'maintenance' | 'repair',
    category: 'maintenance',
    description: '',
    amount: '',
    mileage: '',
    workshop: '',
    nextServiceMileage: '',
    nextServiceDate: '',
  });

  const [warnings, setWarnings] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(formData.amount);
    const mileage = parseFloat(formData.mileage);
    const nextServiceMileage = formData.nextServiceMileage ? parseFloat(formData.nextServiceMileage) : undefined;
    
    // Validation
    const newWarnings: string[] = [];
    
    if (amount <= 0) {
      newWarnings.push('Сумма должна быть больше 0');
    }
    if (mileage < 0) {
      newWarnings.push('Пробег не может быть отрицательным');
    }
    
    // Check future date
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate > today) {
      newWarnings.push('Дата не может быть в будущем');
    }
    
    // Check mileage vs previous logs
    if (maintenanceLogs.length > 0) {
      const latestLog = maintenanceLogs[0];
      if (mileage < latestLog.mileage) {
        newWarnings.push(`Пробег меньше предыдущей записи (${latestLog.mileage} км)`);
      }
    }
    
    // Validate next service mileage
    if (nextServiceMileage && nextServiceMileage <= mileage) {
      newWarnings.push('Следующее ТО должно быть больше текущего пробега');
    }
    
    // Validate next service date
    if (formData.nextServiceDate) {
      const nextDate = new Date(formData.nextServiceDate);
      if (nextDate <= selectedDate) {
        newWarnings.push('Дата следующего ТО должна быть позже текущей даты');
      }
    }
    
    if (newWarnings.length > 0) {
      setWarnings(newWarnings);
      return;
    }
    
    // Add maintenance log
    addMaintenanceLog({
      date: formData.date,
      type: formData.type,
      category: formData.category,
      description: formData.description,
      amount,
      mileage,
      workshop: formData.workshop,
      nextServiceMileage,
      nextServiceDate: formData.nextServiceDate || undefined,
    });
    
    showToast('Запись ТО добавлена успешно!', 'success');
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-md rounded-3xl p-6 my-8"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
          backdropFilter: 'blur(30px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Добавить запись</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="mb-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
            {warnings.map((warning, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-rose-400">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{warning}</span>
              </div>
            ))}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Дата <span className="text-rose-400">*</span>
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-black/30 border border-zinc-800 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              required
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Тип <span className="text-rose-400">*</span>
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'maintenance' | 'repair' })}
              className="w-full px-4 py-3 rounded-xl bg-black/30 border border-zinc-800 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              required
            >
              <option value="maintenance">ТО (обслуживание)</option>
              <option value="repair">Ремонт</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Категория <span className="text-rose-400">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-black/30 border border-zinc-800 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              required
            >
              {AUTO_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Описание <span className="text-rose-400">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-black/30 border border-zinc-800 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none"
              placeholder="Замена масла, ремонт тормозов, и т.д."
              rows={3}
              required
            />
          </div>

          {/* Amount & Mileage */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Сумма (₽) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-black/30 border border-zinc-800 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Пробег (км) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                step="1"
                value={formData.mileage}
                onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-black/30 border border-zinc-800 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                placeholder="0"
                required
              />
            </div>
          </div>

          {/* Workshop */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Мастерская (опционально)
            </label>
            <input
              type="text"
              value={formData.workshop}
              onChange={(e) => setFormData({ ...formData, workshop: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-black/30 border border-zinc-800 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              placeholder="Название СТО"
            />
          </div>

          {/* Next Service */}
          <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
            <p className="text-sm font-medium text-violet-400 mb-3">Следующее ТО (опционально)</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Пробег (км)</label>
                <input
                  type="number"
                  step="1"
                  value={formData.nextServiceMileage}
                  onChange={(e) => setFormData({ ...formData, nextServiceMileage: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-black/30 border border-zinc-800 text-white text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Дата</label>
                <input
                  type="date"
                  value={formData.nextServiceDate}
                  onChange={(e) => setFormData({ ...formData, nextServiceDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-black/30 border border-zinc-800 text-white text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl font-semibold text-black transition-all"
            style={{
              background: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
              boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
            }}
          >
            Добавить
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
