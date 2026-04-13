import { Search, SlidersHorizontal, MapPin, Star } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import RestaurantCard from "../components/RestaurantCard";
import { mockRestaurants, mockCategories } from "../data/mockServices";

export default function RestaurantsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("recommended");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minRating: 0,
    maxDeliveryTime: 60,
    freeDelivery: false,
    promoted: false,
  });

  const filteredRestaurants = mockRestaurants.filter((restaurant) => {
    if (searchQuery && !restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedCategory && !restaurant.categories.includes(selectedCategory)) {
      return false;
    }
    if (filters.minRating > 0 && restaurant.rating < filters.minRating) {
      return false;
    }
    if (filters.promoted && !restaurant.promoted) {
      return false;
    }
    return true;
  });

  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "deliveryTime") {
      const aTime = parseInt(a.deliveryTime.split("-")[0]);
      const bTime = parseInt(b.deliveryTime.split("-")[0]);
      return aTime - bTime;
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Tous les restaurants
              </h1>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <p className="text-gray-600">Paris, 75002</p>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full ml-2">
                  API: Restaurant Service
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                  showFilters
                    ? "border-orange-500 text-orange-600 bg-orange-50"
                    : "border-gray-200 text-gray-700 hover:border-gray-300"
                }`}
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span className="font-semibold">Filtres</span>
              </button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg font-semibold text-gray-700 hover:border-gray-300 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="recommended">Recommandés</option>
                <option value="rating">Note</option>
                <option value="deliveryTime">Temps de livraison</option>
              </select>
            </div>
          </div>

          {/* Search */}
          <div className="mt-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un restaurant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="mt-6 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
                selectedCategory === null
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Tous
            </button>
            {mockCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === category.name
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white border-b border-gray-200"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Note minimale
                </label>
                <select
                  value={filters.minRating}
                  onChange={(e) =>
                    setFilters({ ...filters, minRating: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="0">Toutes les notes</option>
                  <option value="4">4+ ⭐</option>
                  <option value="4.5">4.5+ ⭐</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Temps de livraison max
                </label>
                <select
                  value={filters.maxDeliveryTime}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      maxDeliveryTime: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="60">60 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="30">30 minutes</option>
                </select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.freeDelivery}
                    onChange={(e) =>
                      setFilters({ ...filters, freeDelivery: e.target.checked })
                    }
                    className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="font-semibold text-gray-700">
                    Livraison gratuite
                  </span>
                </label>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.promoted}
                    onChange={(e) =>
                      setFilters({ ...filters, promoted: e.target.checked })
                    }
                    className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="font-semibold text-gray-700">
                    Promotions uniquement
                  </span>
                </label>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">
              {sortedRestaurants.length}
            </span>{" "}
            restaurant{sortedRestaurants.length > 1 ? "s" : ""} trouvé
            {sortedRestaurants.length > 1 ? "s" : ""}
          </p>
        </div>

        {sortedRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} {...restaurant} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Aucun restaurant trouvé
            </h3>
            <p className="text-gray-600">
              Essayez de modifier vos filtres ou votre recherche
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
