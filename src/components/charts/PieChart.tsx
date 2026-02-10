"use client";

import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { motion } from "framer-motion";

interface PieChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  currency?: string;
}

export function PieChart({ data, currency = "₽" }: PieChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-zinc-600">
        <p>Нет данных для отображения</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-rich rounded-xl p-3 shadow-xl"
        >
          <p className="text-white font-semibold text-sm mb-1">{data.name}</p>
          <p className="text-emerald-400 font-bold">
            {currency}{data.value.toLocaleString("ru-RU")}
          </p>
          <p className="text-zinc-500 text-xs mt-1">
            {data.payload.percentage?.toFixed(1)}%
          </p>
        </motion.div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap gap-2 justify-center mt-4">
        {payload.map((entry: any, index: number) => (
          <motion.div
            key={`legend-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-zinc-300 font-medium">{entry.value}</span>
          </motion.div>
        ))}
      </div>
    );
  };

  // Добавляем процент к данным
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const dataWithPercentage = data.map(item => ({
    ...item,
    percentage: (item.value / total) * 100
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart>
        <Pie
          data={dataWithPercentage}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={(props: any) => `${props.percentage.toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          animationBegin={0}
          animationDuration={800}
        >
          {dataWithPercentage.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.color}
              stroke="rgba(0,0,0,0.2)"
              strokeWidth={2}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}
