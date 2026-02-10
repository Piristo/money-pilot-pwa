"use client";

import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { motion } from "framer-motion";

interface LineChartProps {
  data: Array<{
    name: string;
    income?: number;
    expense?: number;
  }>;
  currency?: string;
  showIncome?: boolean;
  showExpense?: boolean;
}

export function LineChart({ 
  data, 
  currency = "₽",
  showIncome = true,
  showExpense = true
}: LineChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-zinc-600">
        <p>Нет данных для отображения</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-rich rounded-xl p-3 shadow-xl"
        >
          <p className="text-white font-semibold text-sm mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 mb-1">
              <span className="text-xs text-zinc-400">{entry.name === "income" ? "Доходы" : "Расходы"}:</span>
              <span 
                className="font-bold text-sm"
                style={{ color: entry.color }}
              >
                {currency}{entry.value.toLocaleString("ru-RU")}
              </span>
            </div>
          ))}
        </motion.div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart
        data={data}
        margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
      >
        <defs>
          <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke="rgba(255,255,255,0.05)" 
          vertical={false}
        />
        <XAxis 
          dataKey="name" 
          stroke="#71717a"
          style={{ fontSize: '12px' }}
          tickLine={false}
        />
        <YAxis 
          stroke="#71717a"
          style={{ fontSize: '12px' }}
          tickLine={false}
          tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip content={<CustomTooltip />} />
        {showIncome && (
          <Line
            type="monotone"
            dataKey="income"
            stroke="#22c55e"
            strokeWidth={3}
            dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#22c55e' }}
            animationDuration={1000}
          />
        )}
        {showExpense && (
          <Line
            type="monotone"
            dataKey="expense"
            stroke="#ef4444"
            strokeWidth={3}
            dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#ef4444' }}
            animationDuration={1000}
          />
        )}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
