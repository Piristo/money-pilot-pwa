import { CATEGORIES, type Category, type Subcategory } from "./categories";

interface DetectionResult {
  categoryId: string;
  subcategoryId?: string;
  confidence: number;
}

/**
 * Автоматически определяет категорию и подкатегорию по названию транзакции
 * @param title - название транзакции
 * @returns объект с categoryId, subcategoryId и уровнем уверенности
 */
export function autoDetectCategory(title: string): DetectionResult | null {
  if (!title || title.trim().length === 0) {
    return null;
  }

  const normalizedTitle = title.toLowerCase().trim();
  let bestMatch: DetectionResult | null = null;
  let highestScore = 0;

  // Проходим по всем категориям
  for (const category of CATEGORIES) {
    // Проверяем ключевые слова категории
    const categoryScore = calculateMatchScore(normalizedTitle, category.keywords);
    
    if (categoryScore > highestScore) {
      highestScore = categoryScore;
      bestMatch = {
        categoryId: category.id,
        confidence: categoryScore
      };
    }

    // Проверяем подкатегории
    if (category.subcategories) {
      for (const subcategory of category.subcategories) {
        const subcategoryScore = calculateMatchScore(normalizedTitle, subcategory.keywords);
        
        // Подкатегория имеет приоритет над категорией
        if (subcategoryScore > highestScore) {
          highestScore = subcategoryScore;
          bestMatch = {
            categoryId: category.id,
            subcategoryId: subcategory.id,
            confidence: subcategoryScore
          };
        }
      }
    }
  }

  // Возвращаем результат только если уверенность выше порога
  if (bestMatch && bestMatch.confidence > 0.3) {
    return bestMatch;
  }

  return null;
}

/**
 * Вычисляет оценку совпадения между текстом и ключевыми словами
 * @param text - текст для проверки
 * @param keywords - массив ключевых слов
 * @returns оценка от 0 до 1
 */
function calculateMatchScore(text: string, keywords: string[]): number {
  let score = 0;
  let matches = 0;

  for (const keyword of keywords) {
    const normalizedKeyword = keyword.toLowerCase();
    
    // Точное совпадение - максимальный балл
    if (text === normalizedKeyword) {
      return 1.0;
    }
    
    // Содержит ключевое слово
    if (text.includes(normalizedKeyword)) {
      matches++;
      // Чем длиннее ключевое слово, тем выше балл
      const keywordWeight = normalizedKeyword.length / text.length;
      score += 0.7 * keywordWeight;
    }
    
    // Начинается с ключевого слова
    if (text.startsWith(normalizedKeyword)) {
      score += 0.2;
    }
    
    // Заканчивается ключевым словом
    if (text.endsWith(normalizedKeyword)) {
      score += 0.1;
    }
  }

  // Нормализуем оценку
  if (matches > 0) {
    score = Math.min(score / matches, 1.0);
  }

  return score;
}

/**
 * Получает название категории по ID
 */
export function getCategoryName(categoryId: string, subcategoryId?: string): string {
  const category = CATEGORIES.find(c => c.id === categoryId);
  
  if (!category) {
    return "Другое";
  }

  if (subcategoryId && category.subcategories) {
    const subcategory = category.subcategories.find(s => s.id === subcategoryId);
    if (subcategory) {
      return `${category.name} • ${subcategory.name}`;
    }
  }

  return category.name;
}

/**
 * Получает иконку категории
 */
export function getCategoryIcon(categoryId: string) {
  const category = CATEGORIES.find(c => c.id === categoryId);
  return category?.icon;
}

/**
 * Получает цвет категории
 */
export function getCategoryColor(categoryId: string): string {
  const category = CATEGORIES.find(c => c.id === categoryId);
  return category?.color || "#71717a";
}

/**
 * Примеры использования для тестирования
 */
export const DETECTION_EXAMPLES = [
  { title: "Starbucks", expected: { categoryId: "food", subcategoryId: "coffee" } },
  { title: "Пятёрочка", expected: { categoryId: "food", subcategoryId: "groceries" } },
  { title: "Uber", expected: { categoryId: "transport", subcategoryId: "taxi" } },
  { title: "Netflix", expected: { categoryId: "subscriptions", subcategoryId: "streaming" } },
  { title: "Бензин", expected: { categoryId: "transport", subcategoryId: "fuel" } },
  { title: "Аптека", expected: { categoryId: "health", subcategoryId: "pharmacy" } },
  { title: "H&M", expected: { categoryId: "clothing", subcategoryId: "clothes" } },
  { title: "Кинотеатр", expected: { categoryId: "entertainment", subcategoryId: "cinema" } },
];
