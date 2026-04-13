import { Link } from "react-router";
import { Star, Clock, Tag } from "lucide-react";
import { motion } from "motion/react";

interface RestaurantCardProps {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  ratingCount: number;
  deliveryTime: string;
  deliveryFee: number;
  image: string;
  promoted?: boolean;
  discount?: number;
}

export default function RestaurantCard({
  id,
  name,
  cuisine,
  rating,
  ratingCount,
  deliveryTime,
  deliveryFee,
  image,
  promoted,
  discount,
}: RestaurantCardProps) {
  return (
    <Link to={`/restaurant/${id}`}>
      <motion.div
        whileHover={{ y: -4 }}
        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
      >
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
          {promoted && discount && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
              <Tag className="w-4 h-4" />
              -{discount}%
            </div>
          )}
          {promoted && !discount && (
            <div className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              ⚡ Promu
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg mb-1 text-gray-900">{name}</h3>
          <p className="text-gray-600 text-sm mb-3">{cuisine}</p>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="w-4 h-4 fill-current" />
              <span className="font-semibold text-gray-900">{rating}</span>
              <span className="text-gray-500">({ratingCount})</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{deliveryTime} min</span>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-100 text-sm text-gray-600">
            Livraison: {deliveryFee.toFixed(2)}€
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
