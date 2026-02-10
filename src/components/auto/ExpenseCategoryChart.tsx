'use client';

import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { AUTO_CATEGORIES, getCategoryColor, getCategoryLabel } from '@/lib/auto/categories';
import { AutoExpenseCategory } from '@/lib/auto/types';

type CategoryData = {
  category: AutoExpenseCategory;
  amount: number;
  percentage: number;
};

type ExpenseCategoryChartProps = {
  data: CategoryData[];
};

export function ExpenseCategoryChart({ data }: ExpenseCategoryChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-zinc-400">
        Нет данных о расходах
      </div>
    );
  }

  // Format data for chart
  const chartData = data.map((item) => ({
    name: getCategoryLabel(item.category),
    value: item.amount,
    percentage: item.percentage,
    color: getCategoryColor(item.category),
  }));

  // Custom label renderer
  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Hide labels for small slices

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            animationBegin={0}
            animationDuration={800}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(24, 24, 27, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '12px',
              backdropFilter: 'blur(20px)',
            }}
            formatter={(value: any, name: any, props: any) => {
              if (value === undefined) return ['', name || ''];
              return [
                `${value.toLocaleString('ru-RU')} ₽ (${props.payload.percentage.toFixed(1)}%)`,
                name || '',
              ];
            }}
          />
          
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            wrapperStyle={{
              fontSize: '12px',
              paddingTop: '20px',
            }}
            formatter={(value, entry: any) => (
              <span style={{ color: '#a1a1aa' }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
