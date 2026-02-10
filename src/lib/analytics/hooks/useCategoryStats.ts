import { useMemo } from "react";
import { useAppStore } from "@/lib/app-store";
import { getCategoryName, getCategoryColor } from "@/lib/categories/auto-detect";

export interface CategoryStat {
  categoryId: string;
  subcategoryId?: string;
  name: string;
  amount: number;
  count: number;
  percentage: number;
  color: string;
}

/**
 * Хук для получения статистики по категориям
 */
export function useCategoryStats(type: "income" | "expense" = "expense") {
  const { transactions } = useAppStore();

  return useMemo(() => {
    // Фильтруем транзакции по типу
    const filtered = transactions.filter(t => t.type === type);

    // Группируем по категориям
    const categoryMap = new Map<string, CategoryStat>();

    filtered.forEach(transaction => {
      // Если нет категории, пропускаем
      if (!transaction.categoryId) return;

      const key = transaction.subcategoryId 
        ? `${transaction.categoryId}-${transaction.subcategoryId}`
        : transaction.categoryId;

      if (categoryMap.has(key)) {
        const stat = categoryMap.get(key)!;
        stat.amount += transaction.amount;
        stat.count += 1;
      } else {
        categoryMap.set(key, {
          categoryId: transaction.categoryId,
          subcategoryId: transaction.subcategoryId,
          name: getCategoryName(transaction.categoryId, transaction.subcategoryId),
          amount: transaction.amount,
          count: 1,
          percentage: 0,
          color: getCategoryColor(transaction.categoryId)
        });
      }
    });

    // Конвертируем в массив и сортируем по сумме
    const stats = Array.from(categoryMap.values()).sort((a, b) => b.amount - a.amount);

    // Вычисляем проценты
    const total = stats.reduce((sum, stat) => sum + stat.amount, 0);
    stats.forEach(stat => {
      stat.percentage = total > 0 ? (stat.amount / total) * 100 : 0;
    });

    return {
      stats,
      total,
      count: filtered.length
    };
  }, [transactions, type]);
}

/**
 * Хук для получения топ-N категорий
 */
export function useTopCategories(limit: number = 5, type: "income" | "expense" = "expense") {
  const { stats, total } = useCategoryStats(type);

  return useMemo(() => {
    const top = stats.slice(0, limit);
    const others = stats.slice(limit);
    
    if (others.length > 0) {
      const othersAmount = others.reduce((sum, stat) => sum + stat.amount, 0);
      const othersCount = others.reduce((sum, stat) => sum + stat.count, 0);
      
      top.push({
        categoryId: "other",
        name: "Другое",
        amount: othersAmount,
        count: othersCount,
        percentage: total > 0 ? (othersAmount / total) * 100 : 0,
        color: "#71717a"
      });
    }

    return { top, total };
  }, [stats, total, limit]);
}
