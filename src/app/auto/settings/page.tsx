'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Car, Save, AlertTriangle } from 'lucide-react';
import { useAppStore } from '@/lib/app-store';
import { CarProfile } from '@/lib/auto/types';
import { useToast } from '@/components/ui/toast';

export default function AutoSettingsPage() {
  const router = useRouter();
  const { carProfile, setCarProfile } = useAppStore();
  const { showToast } = useToast();

  const [formData, setFormData] = useState<CarProfile>({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    mileage: 0,
    fuelConsumption: 0,
    fuelType: 'АИ-95',
    tankCapacity: 0,
    fuelPrice: 0,
  });

  const [warnings, setWarnings] = useState<string[]>([]);

  // Load existing profile
  useEffect(() => {
    if (carProfile) {
      setFormData(carProfile);
    }
  }, [carProfile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newWarnings: string[] = [];

    if (!formData.brand.trim()) {
      newWarnings.push('Укажите марку автомобиля');
    }
    if (!formData.model.trim()) {
      newWarnings.push('Укажите модель автомобиля');
    }
    if (formData.year < 1900 || formData.year > 2100) {
      newWarnings.push('Год должен быть между 1900 и 2100');
    }
    if (formData.mileage < 0) {
      newWarnings.push('Пробег не может быть отрицательным');
    }
    if (formData.fuelConsumption <= 0) {
      newWarnings.push('Расход топлива должен быть больше 0');
    }
    if (formData.tankCapacity <= 0) {
      newWarnings.push('Объём бака должен быть больше 0');
    }
    if (formData.fuelPrice <= 0) {
      newWarnings.push('Цена топлива должна быть больше 0');
    }

    if (newWarnings.length > 0) {
      setWarnings(newWarnings);
      return;
    }

    // Save profile
    setCarProfile(formData);
    showToast('Профиль автомобиля сохранён!', 'success');
    
    // Redirect to dashboard
    setTimeout(() => {
      router.push('/auto');
    }, 500);
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 pb-20"
    >
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
          Настройки автомобиля
        </h1>
        <p className="text-sm text-zinc-400 font-medium mt-1">
          Укажите информацию о вашем автомобиле
        </p>
      </header>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-6"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
          backdropFilter: 'blur(30px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        }}
      >
        {/* Icon */}
        <div className="flex items-center justify-center mb-6">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl"
            style={{
              background: 'rgba(34, 197, 94, 0.2)',
              boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)',
            }}
          >
            <Car className="w-8 h-8 text-emerald-500" />
          </div>
        </div>

        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
            {warnings.map((warning, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-rose-400">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{warning}</span>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Brand & Model */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Марка <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-black/30 border border-zinc-800 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                placeholder="Toyota, BMW, Lada..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Модель <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-black/30 border border-zinc-800 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                placeholder="Camry, X5, Vesta..."
                required
              />
            </div>
          </div>

          {/* Year & Mileage */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Год выпуска <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl bg-black/30 border border-zinc-800 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                min="1900"
                max="2100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Текущий пробег (км) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                value={formData.mileage}
                onChange={(e) => setFormData({ ...formData, mileage: parseInt(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl bg-black/30 border border-zinc-800 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                min="0"
                step="1"
                required
              />
            </div>
          </div>

          {/* Fuel Type & Consumption */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Тип топлива <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.fuelType}
                onChange={(e) => setFormData({ ...formData, fuelType: e.target.value as any })}
                className="w-full px-4 py-3 rounded-xl bg-black/30 border border-zinc-800 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                required
              >
                <option value="АИ-92">АИ-92</option>
                <option value="АИ-95">АИ-95</option>
                <option value="АИ-98">АИ-98</option>
                <option value="ДТ">ДТ (Дизель)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Расход (л/100км) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                value={formData.fuelConsumption}
                onChange={(e) => setFormData({ ...formData, fuelConsumption: parseFloat(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl bg-black/30 border border-zinc-800 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                min="0.1"
                step="0.1"
                placeholder="7.5"
                required
              />
              <p className="text-xs text-zinc-500 mt-1">Паспортный расход</p>
            </div>
          </div>

          {/* Tank Capacity & Fuel Price */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Объём бака (л) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                value={formData.tankCapacity}
                onChange={(e) => setFormData({ ...formData, tankCapacity: parseFloat(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl bg-black/30 border border-zinc-800 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                min="1"
                step="1"
                placeholder="50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Цена топлива (₽/л) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                value={formData.fuelPrice}
                onChange={(e) => setFormData({ ...formData, fuelPrice: parseFloat(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl bg-black/30 border border-zinc-800 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                min="0.01"
                step="0.01"
                placeholder="55.50"
                required
              />
              <p className="text-xs text-zinc-500 mt-1">Средняя цена на вашей АЗС</p>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 rounded-xl font-semibold text-black transition-all flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
              boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
            }}
          >
            <Save className="w-5 h-5" />
            Сохранить профиль
          </motion.button>
        </form>
      </motion.div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl p-4 bg-violet-500/10 border border-violet-500/20"
      >
        <p className="text-sm text-violet-300">
          💡 <strong>Совет:</strong> Указывайте точные данные для более точных расчётов расхода топлива и стоимости эксплуатации.
        </p>
      </motion.div>
    </motion.section>
  );
}
