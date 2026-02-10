"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { CATEGORIES, getSubcategories, type Category } from "@/lib/categories/categories";

interface CategoryPickerProps {
  selectedCategoryId?: string;
  selectedSubcategoryId?: string;
  onSelect: (categoryId: string, subcategoryId?: string) => void;
  className?: string;
}

export function CategoryPicker({
  selectedCategoryId,
  selectedSubcategoryId,
  onSelect,
  className
}: CategoryPickerProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(
    selectedCategoryId || null
  );

  const handleCategoryClick = (category: Category) => {
    if (category.subcategories && category.subcategories.length > 0) {
      // Если есть подкатегории, раскрываем/скрываем
      setExpandedCategory(expandedCategory === category.id ? null : category.id);
    } else {
      // Если нет подкатегорий, сразу выбираем
      onSelect(category.id);
    }
  };

  const handleSubcategoryClick = (categoryId: string, subcategoryId: string) => {
    onSelect(categoryId, subcategoryId);
  };

  return (
    <div className={cn("space-y-2", className)}>
      {CATEGORIES.map((category) => {
        const Icon = category.icon;
        const isExpanded = expandedCategory === category.id;
        const isSelected = selectedCategoryId === category.id && !selectedSubcategoryId;
        const hasSubcategories = category.subcategories && category.subcategories.length > 0;

        return (
          <div key={category.id}>
            {/* Category */}
            <motion.button
              whileHover={{ scale: 1.01, x: 2 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleCategoryClick(category)}
              className={cn(
                "w-full flex items-center justify-between p-3 rounded-xl transition-all",
                isSelected
                  ? "bg-white/10 border border-white/20"
                  : "bg-white/5 border border-transparent hover:bg-white/10 hover:border-white/10"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <Icon size={20} style={{ color: category.color }} />
                </div>
                <span className="font-medium text-white">{category.name}</span>
              </div>

              <div className="flex items-center gap-2">
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="h-5 w-5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: category.color }}
                  >
                    <Check size={14} className="text-white" />
                  </motion.div>
                )}
                {hasSubcategories && (
                  <motion.div
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight size={16} className="text-zinc-500" />
                  </motion.div>
                )}
              </div>
            </motion.button>

            {/* Subcategories */}
            <AnimatePresence>
              {isExpanded && hasSubcategories && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden ml-4 mt-2 space-y-1"
                >
                  {category.subcategories!.map((subcategory) => {
                    const isSubSelected =
                      selectedCategoryId === category.id &&
                      selectedSubcategoryId === subcategory.id;

                    return (
                      <motion.button
                        key={subcategory.id}
                        whileHover={{ scale: 1.01, x: 2 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleSubcategoryClick(category.id, subcategory.id)}
                        className={cn(
                          "w-full flex items-center justify-between p-2.5 rounded-lg transition-all text-sm",
                          isSubSelected
                            ? "bg-white/10 border border-white/20"
                            : "bg-white/5 border border-transparent hover:bg-white/10"
                        )}
                      >
                        <span className="text-zinc-300">{subcategory.name}</span>
                        {isSubSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="h-4 w-4 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: category.color }}
                          >
                            <Check size={10} className="text-white" />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
