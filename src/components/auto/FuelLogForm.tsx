'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';
import { useAppStore } from '@/lib/app-store';
import { useToast } from '@/components/ui/toast';

type FuelLogFormProps = {
  onClose: () => void;
};

export function FuelLogForm({ onClose }: FuelLogFormProps) {
  const { addFuelLog, fuelLogs, carProfile } = useAppStore();
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    liters: '',
    amount: '',
    mileage: '',
    fuelType: carProfile?.fuelType || 'АИ-95',
    station: '',
    fullTank: true,
  });

  const [warnings, setWarnings] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const liters = parseFloat(formData.liters);
    const amount = parseFloat(formData.amount);
    const mileage = parseFloat(formData.mileage);
    
    // Validation
    const newWarnings: string[] = [];
    
    if (liters <= 0) {
      newWarnings.push('Количество литров должно быть больше 0');
    }
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
      newWarnings.push('Дата заправки не может быть в будущем');
    }
    
    // Check mileage vs previous logs
    if (fuelLogs.length > 0) {
      const latestLog = fuelLogs[0]; // Already sorted by date (newest first)
      if (mileage < latestLog.mileage) {
        newWarnings.push(`Пробег меньше предыдущей записи (${latestLog.mileage} км)`);
      }
    }
    
    if (newWarnings.length > 0) {
      setWarnings(newWarnings);
      return;
    }
    
    // Add fuel log
    addFuelLog({
      date: formData.date,
      liters,
      amount,
      mileage,
      fuelType: formData.fuelType,
      station: formData.station,
      fullTank: formData.fullTank,
    });
    
    showToast('Заправка добавлена успешно!', 'success');
    onClose();
  };

  const pricePerLiter = formData.liters && formData.amount
    ? (parseFloat(formData.amount) / parseFloat(formData.liters)).toFixed(2)
    : '0.00';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-md rounded-3xl p-6"
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
          <h2 className="text-2xl font-bold text-white">Добавить заправку</h2>
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

          {/* Liters & Amount */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Литры <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.liters}
                onChange={(e) => setFormData({ ...formData, liters: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-black/30 border border-zinc-800 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                placeholder="0.00"
                required
              />
            </div>
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
          </div>

          {/* Price per liter (calculated) */}
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-sm text-zinc-400">Цена за литр</p>
            <p className="text-2xl font-bold text-emerald-500">{pricePerLiter} ₽/л</p>
          </div>

          {/* Mileage */}
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

          {/* Fuel Type */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Тип топлива <span className="text-rose-400">*</span>
            </label>
            <select
              value={formData.fuelType}
              onChange={(e) => setFormData({ ...formData, fuelType: e.target.value as 'АИ-92' | 'АИ-95' | 'АИ-98' | 'ДТ' })}
              className="w-full px-4 py-3 rounded-xl bg-black/30 border border-zinc-800 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              required
            >
              <option value="АИ-92">АИ-92</option>
              <option value="АИ-95">АИ-95</option>
              <option value="АИ-98">АИ-98</option>
              <option value="ДТ">ДТ (Дизель)</option>
            </select>
          </div>

          {/* Station */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              АЗС (опционально)
            </label>
            <input
              type="text"
              value={formData.station}
              onChange={(e) => setFormData({ ...formData, station: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-black/30 border border-zinc-800 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              placeholder="Лукойл, Газпром, и т.д."
            />
          </div>

          {/* Full Tank */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="fullTank"
              checked={formData.fullTank}
              onChange={(e) => setFormData({ ...formData, fullTank: e.target.checked })}
              className="w-5 h-5 rounded border-zinc-800 bg-black/30 text-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
            <label htmlFor="fullTank" className="text-sm text-zinc-300">
              Полный бак (для расчёта расхода)
            </label>
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
