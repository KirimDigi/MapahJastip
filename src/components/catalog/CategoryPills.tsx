import React from 'react';
import { CATALOG_CATEGORY_FILTERS } from '../../constants/categories';

interface CategoryPillsProps {
  activeCategory: string;
  onSelectCategory: (categoryId: string) => void;
  counts?: Record<string, number>;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  activeCategory,
  onSelectCategory,
  counts = {},
}) => {
  return (
    <div className="overflow-x-auto pb-2 scrollbar-none flex items-center gap-2.5">
      {CATALOG_CATEGORY_FILTERS.map((cat) => {
        const isActive = activeCategory === cat.id;
        const count = counts[cat.id];
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`px-4 py-2 rounded-full font-label-md text-label-md transition-all whitespace-nowrap shadow-xs ${
              isActive
                ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-light-blue hover:text-primary border border-border-subtle/80'
            }`}
          >
            {cat.label} {count !== undefined ? `(${count})` : ''}
          </button>
        );
      })}
    </div>
  );
};
