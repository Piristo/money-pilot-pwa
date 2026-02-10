import { 
  ShoppingBag, 
  Car, 
  Home, 
  Gamepad2, 
  Shirt, 
  Heart, 
  Smartphone, 
  GraduationCap,
  Coffee,
  Utensils,
  Fuel,
  Bus,
  Wrench,
  Film,
  Dumbbell,
  Pill,
  Music,
  Book,
  Plane,
  Gift,
  Briefcase,
  type LucideIcon
} from "lucide-react";

export interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  subcategories?: Subcategory[];
  keywords: string[];
}

export interface Subcategory {
  id: string;
  name: string;
  keywords: string[];
}

export const CATEGORIES: Category[] = [
  {
    id: "food",
    name: "Еда",
    icon: ShoppingBag,
    color: "#22c55e",
    keywords: ["еда", "food", "продукты", "grocery", "супермаркет", "магазин"],
    subcategories: [
      {
        id: "restaurants",
        name: "Рестораны",
        keywords: ["ресторан", "restaurant", "кафе", "cafe", "бар", "bar", "макдональдс", "mcdonald", "kfc", "бургер", "burger"]
      },
      {
        id: "groceries",
        name: "Продукты",
        keywords: ["пятёрочка", "магнит", "перекрёсток", "ашан", "лента", "дикси", "продукты", "grocery", "супермаркет", "supermarket"]
      },
      {
        id: "coffee",
        name: "Кофе",
        keywords: ["кофе", "coffee", "starbucks", "старбакс", "кофейня", "coffeeshop", "латте", "latte", "капучино"]
      },
      {
        id: "delivery",
        name: "Доставка",
        keywords: ["доставка", "delivery", "яндекс еда", "yandex", "деливери", "delivery club"]
      }
    ]
  },
  {
    id: "transport",
    name: "Транспорт",
    icon: Car,
    color: "#3b82f6",
    keywords: ["транспорт", "transport", "авто", "auto", "машина", "car"],
    subcategories: [
      {
        id: "taxi",
        name: "Такси",
        keywords: ["такси", "taxi", "uber", "яндекс такси", "yandex", "bolt", "ситимобил"]
      },
      {
        id: "fuel",
        name: "Бензин",
        keywords: ["бензин", "fuel", "газ", "gas", "азс", "заправка", "лукойл", "газпром", "роснефть"]
      },
      {
        id: "parking",
        name: "Парковка",
        keywords: ["парковка", "parking", "стоянка"]
      },
      {
        id: "public",
        name: "Общественный",
        keywords: ["метро", "metro", "автобус", "bus", "троллейбус", "трамвай", "электричка"]
      }
    ]
  },
  {
    id: "home",
    name: "Дом",
    icon: Home,
    color: "#8b5cf6",
    keywords: ["дом", "home", "квартира", "apartment", "жильё"],
    subcategories: [
      {
        id: "rent",
        name: "Аренда",
        keywords: ["аренда", "rent", "квартплата"]
      },
      {
        id: "utilities",
        name: "Коммуналка",
        keywords: ["коммуналка", "utilities", "свет", "electricity", "вода", "water", "газ", "отопление"]
      },
      {
        id: "repair",
        name: "Ремонт",
        keywords: ["ремонт", "repair", "мебель", "furniture", "декор", "decor"]
      }
    ]
  },
  {
    id: "entertainment",
    name: "Развлечения",
    icon: Gamepad2,
    color: "#f59e0b",
    keywords: ["развлечения", "entertainment", "досуг", "leisure"],
    subcategories: [
      {
        id: "cinema",
        name: "Кино",
        keywords: ["кино", "cinema", "фильм", "movie", "кинотеатр"]
      },
      {
        id: "games",
        name: "Игры",
        keywords: ["игры", "games", "steam", "playstation", "xbox", "nintendo"]
      },
      {
        id: "hobby",
        name: "Хобби",
        keywords: ["хобби", "hobby"]
      }
    ]
  },
  {
    id: "clothing",
    name: "Одежда",
    icon: Shirt,
    color: "#ec4899",
    keywords: ["одежда", "clothing", "clothes"],
    subcategories: [
      {
        id: "clothes",
        name: "Одежда",
        keywords: ["h&m", "zara", "uniqlo", "reserved", "bershka", "pull&bear"]
      },
      {
        id: "shoes",
        name: "Обувь",
        keywords: ["обувь", "shoes", "кроссовки", "sneakers", "ботинки"]
      },
      {
        id: "accessories",
        name: "Аксессуары",
        keywords: ["аксессуары", "accessories", "сумка", "bag", "часы", "watch"]
      }
    ]
  },
  {
    id: "health",
    name: "Здоровье",
    icon: Heart,
    color: "#ef4444",
    keywords: ["здоровье", "health", "медицина", "medicine"],
    subcategories: [
      {
        id: "pharmacy",
        name: "Аптека",
        keywords: ["аптека", "pharmacy", "лекарства", "medicine", "таблетки"]
      },
      {
        id: "doctor",
        name: "Врачи",
        keywords: ["врач", "doctor", "клиника", "clinic", "больница", "hospital", "стоматолог"]
      },
      {
        id: "sport",
        name: "Спорт",
        keywords: ["спорт", "sport", "фитнес", "fitness", "зал", "gym", "тренажёрка"]
      }
    ]
  },
  {
    id: "subscriptions",
    name: "Подписки",
    icon: Smartphone,
    color: "#06b6d4",
    keywords: ["подписка", "subscription"],
    subcategories: [
      {
        id: "streaming",
        name: "Стриминг",
        keywords: ["netflix", "нетфликс", "spotify", "спотифай", "apple music", "youtube premium", "кинопоиск"]
      },
      {
        id: "software",
        name: "Софт",
        keywords: ["adobe", "microsoft", "office", "dropbox", "icloud"]
      },
      {
        id: "services",
        name: "Сервисы",
        keywords: ["сервис", "service"]
      }
    ]
  },
  {
    id: "education",
    name: "Образование",
    icon: GraduationCap,
    color: "#a855f7",
    keywords: ["образование", "education", "обучение", "learning"],
    subcategories: [
      {
        id: "courses",
        name: "Курсы",
        keywords: ["курс", "course", "udemy", "coursera", "skillbox", "нетология"]
      },
      {
        id: "books",
        name: "Книги",
        keywords: ["книга", "book", "литрес", "litres", "лабиринт"]
      },
      {
        id: "training",
        name: "Обучение",
        keywords: ["обучение", "training", "репетитор", "tutor"]
      }
    ]
  },
  {
    id: "travel",
    name: "Путешествия",
    icon: Plane,
    color: "#14b8a6",
    keywords: ["путешествия", "travel", "поездка", "trip"],
    subcategories: [
      {
        id: "flights",
        name: "Авиа",
        keywords: ["авиа", "flight", "самолёт", "plane", "билет", "ticket"]
      },
      {
        id: "hotels",
        name: "Отели",
        keywords: ["отель", "hotel", "гостиница", "booking", "airbnb"]
      },
      {
        id: "tours",
        name: "Туры",
        keywords: ["тур", "tour", "экскурсия", "excursion"]
      }
    ]
  },
  {
    id: "gifts",
    name: "Подарки",
    icon: Gift,
    color: "#f43f5e",
    keywords: ["подарок", "gift", "презент", "present"],
    subcategories: []
  },
  {
    id: "work",
    name: "Работа",
    icon: Briefcase,
    color: "#64748b",
    keywords: ["работа", "work", "офис", "office", "бизнес", "business"],
    subcategories: []
  },
  {
    id: "other",
    name: "Другое",
    icon: MoreHorizontal,
    color: "#71717a",
    keywords: ["другое", "other", "прочее"],
    subcategories: []
  }
];

// Helper function to get category by id
export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find(cat => cat.id === id);
}

// Helper function to get all categories as options
export function getCategoryOptions() {
  return CATEGORIES.map(cat => ({
    value: cat.id,
    label: cat.name,
    icon: cat.icon,
    color: cat.color
  }));
}

// Helper function to get subcategories for a category
export function getSubcategories(categoryId: string): Subcategory[] {
  const category = getCategoryById(categoryId);
  return category?.subcategories || [];
}

import { MoreHorizontal } from "lucide-react";
