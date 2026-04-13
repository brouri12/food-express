import { motion } from "motion/react";
import { Link } from "react-router";

interface Category {
  id: string;
  name: string;
  icon: string;
  count?: number;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory?: string;
  onSelect?: (categoryId: string) => void;
  /** Si true, utilise des liens React Router au lieu d'un callback */
  useLinks?: boolean;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelect,
  useLinks = true,
}: CategoryFilterProps) {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          Catégories Populaires
        </h2>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          API: Restaurant Service
        </span>
      </div>

      <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;
          const content = (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className={`rounded-xl p-4 shadow-sm hover:shadow-md transition-all text-center cursor-pointer border-2 ${
                isSelected
                  ? "border-orange-500 bg-orange-50"
                  : "border-transparent bg-white"
              }`}
            >
              <div className="text-3xl md:text-4xl mb-2">{category.icon}</div>
              <p className="text-xs md:text-sm font-semibold text-gray-900 mb-1 leading-tight">
                {category.name}
              </p>
              {category.count !== undefined && (
                <p className="text-xs text-gray-500">{category.count}</p>
              )}
            </motion.div>
          );

          if (useLinks) {
            return (
              <Link
                key={category.id}
                to={`/restaurants?category=${category.id}`}
              >
                {content}
              </Link>
            );
          }

          return (
            <button
              key={category.id}
              onClick={() => onSelect?.(category.id)}
              className="text-left"
            >
              {content}
            </button>
          );
        })}
      </div>
    </section>
  );
}
