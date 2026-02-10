'use client';

import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { ConsumptionDataPoint } from '@/lib/auto/types';

type FuelChartProps = {
  data: ConsumptionDataPoint[];
  manufacturerSpec?: number; // L/100km
};

export function FuelChart({ data, manufacturerSpec }: FuelChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-zinc-400">
        Недостаточно данных для отображения графика
      </div>
    );
  }

  // Format data for chart
  const chartData = data.map((point) => ({
    date: new Date(point.date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
    }),
    consumption: Number(point.consumption.toFixed(2)),
    mileage: point.mileage,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="consumptionGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
          
          <XAxis
            dataKey="date"
            stroke="#71717a"
            style={{ fontSize: '12px' }}
            tickLine={false}
          />
          
          <YAxis
            stroke="#71717a"
            style={{ fontSize: '12px' }}
            tickLine={false}
            label={{
              value: 'л/100км',
              angle: -90,
              position: 'insideLeft',
              style: { fill: '#71717a', fontSize: '12px' },
            }}
          />
          
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(24, 24, 27, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '12px',
              backdropFilter: 'blur(20px)',
            }}
            labelStyle={{ color: '#ffffff', fontWeight: 600, marginBottom: '4px' }}
            itemStyle={{ color: '#22c55e' }}
            formatter={(value: any) => [`${value?.toFixed(2) || '0.00'} л/100км`, 'Расход']}
          />
          
          {/* Manufacturer spec line (dashed) */}
          {manufacturerSpec && (
            <ReferenceLine
              y={manufacturerSpec}
              stroke="#8b5cf6"
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{
                value: `Паспорт: ${manufacturerSpec} л/100км`,
                position: 'insideTopRight',
                fill: '#8b5cf6',
                fontSize: 12,
              }}
            />
          )}
          
          {/* Actual consumption line */}
          <Line
            type="monotone"
            dataKey="consumption"
            stroke="#22c55e"
            strokeWidth={3}
            dot={{
              fill: '#22c55e',
              strokeWidth: 2,
              r: 4,
              stroke: '#09090b',
            }}
            activeDot={{
              r: 6,
              fill: '#22c55e',
              stroke: '#09090b',
              strokeWidth: 2,
            }}
            fill="url(#consumptionGradient)"
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
