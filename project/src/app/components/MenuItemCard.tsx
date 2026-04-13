import { Plus, Leaf } from "lucide-react";
import { motion } from "motion/react";

interface MenuItemCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  popular?: boolean;
  vegetarian?: boolean;
  available: boolean;
  onAddToCart: () => void;
}

export default function MenuItemCard({
  name,
  description,
  price,
  image,
  popular,
  vegetarian,
  available,
  onAddToCart,
}: MenuItemCardProps) {
  return (
    <motion.div
      whileHover={{ scale: available ? 1.02 : 1 }}
      className={`bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all ${
        !available ? "opacity-60" : ""
      }`}
    >
      <div className="flex gap-4 p-4">
        <div className="flex-1">
          <div className="flex items-start gap-2 mb-2">
            <h4 className="font-semibold text-gray-900 flex-1">{name}</h4>
            {popular && (
              <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded-full">
                ⭐ Populaire
              </span>
            )}
            {vegetarian && (
              <span className="text-green-600">
                <Leaf className="w-4 h-4" />
              </span>
            )}
          </div>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {description}
          </p>
          <div className="flex items-center justify-between">
            <span className="font-bold text-lg text-gray-900">
              {price.toFixed(2)}€
            </span>
            {available ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onAddToCart}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all shadow-md"
              >
                <Plus className="w-5 h-5" />
              </motion.button>
            ) : (
              <span className="text-gray-400 text-sm font-medium">
                Indisponible
              </span>
            )}
          </div>
        </div>
        <div className="w-24 h-24 flex-shrink-0">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </div>
    </motion.div>
  );
}
