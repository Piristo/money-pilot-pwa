'use client';

import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

type MetricsCardProps = {
  icon: LucideIcon;
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: string;
};

export function MetricsCard({
  icon: Icon,
  label,
  value,
  unit,
  trend,
  trendValue,
  color = '#22c55e',
}: MetricsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
      className="relative overflow-hidden rounded-2xl p-6 cursor-pointer"
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
        backdropFilter: 'blur(30px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
      }}
    >
      {/* Icon */}
      <div
        className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4"
        style={{
          background: `${color}20`,
          boxShadow: `0 0 20px ${color}30`,
        }}
      >
        <Icon className="w-6 h-6" style={{ color }} />
      </div>

      {/* Label */}
      <p className="text-sm text-zinc-400 mb-2">{label}</p>

      {/* Value */}
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-white tracking-tight">
          {value}
        </span>
        {unit && (
          <span className="text-lg text-zinc-400 font-medium">{unit}</span>
        )}
      </div>

      {/* Trend */}
      {trend && trendValue && (
        <div className="flex items-center gap-1 mt-3">
          {trend === 'up' && <TrendingUp className="w-4 h-4 text-emerald-500" />}
          {trend === 'down' && <TrendingDown className="w-4 h-4 text-rose-500" />}
          <span
            className={`text-sm font-medium ${
              trend === 'up'
                ? 'text-emerald-500'
                : trend === 'down'
                ? 'text-rose-500'
                : 'text-zinc-400'
            }`}
          >
            {trendValue}
          </span>
        </div>
      )}

      {/* Glow effect */}
      <div
        className="absolute -bottom-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-20"
        style={{ background: color }}
      />
    </motion.div>
  );
}
