import { Search, ChevronRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";
import RestaurantCard from "../components/RestaurantCard";
import {
  mockRestaurants,
  mockPromotions,
  mockCategories,
} from "../data/mockServices";
import { useState } from "react";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);

  const promotedRestaurants = mockRestaurants.filter((r) => r.promoted);
  const newRestaurants = mockRestaurants.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Vos restaurants préférés,
              <br />
              livrés en un clic 🍕
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Découvrez les meilleurs restaurants près de chez vous
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-2">
              <div className="flex items-center gap-2">
                <Search className="w-6 h-6 text-gray-400 ml-3" />
                <input
                  type="text"
                  placeholder="Rechercher un restaurant ou un plat..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-3 py-3 text-gray-900 outline-none"
                />
                <Link
                  to={`/restaurants?search=${searchQuery}`}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all"
                >
                  Rechercher
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Bannières Promotionnelles (Promotion Service) */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-7 h-7 text-orange-500" />
              Offres Spéciales
            </h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              API: Promotion Service
            </span>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-2xl shadow-xl">
              <motion.div
                key={currentPromoIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative h-64 md:h-80"
              >
                <img
                  src={mockPromotions[currentPromoIndex].image}
                  alt={mockPromotions[currentPromoIndex].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                  <h3 className="text-2xl md:text-4xl font-bold mb-2">
                    {mockPromotions[currentPromoIndex].title}
                  </h3>
                  <p className="text-lg md:text-xl mb-4">
                    {mockPromotions[currentPromoIndex].description}
                  </p>
                  {mockPromotions[currentPromoIndex].code && (
                    <div className="inline-block bg-white text-gray-900 px-4 py-2 rounded-lg font-bold">
                      Code: {mockPromotions[currentPromoIndex].code}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
            <div className="flex justify-center gap-2 mt-4">
              {mockPromotions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPromoIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentPromoIndex
                      ? "bg-orange-500 w-8"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Catégories de Cuisine */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Catégories Populaires
            </h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              API: Restaurant Service
            </span>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {mockCategories.map((category) => (
              <Link
                key={category.id}
                to={`/restaurants?category=${category.id}`}
                className="group"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all text-center"
                >
                  <div className="text-4xl mb-2">{category.icon}</div>
                  <p className="text-xs md:text-sm font-semibold text-gray-900 mb-1">
                    {category.name}
                  </p>
                  <p className="text-xs text-gray-500">{category.count}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* Restaurants Recommandés (Rating Service Integration) */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Restaurants Recommandés
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                API: Restaurant + Rating Service
              </span>
              <Link
                to="/restaurants"
                className="text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1"
              >
                Voir tout
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotedRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} {...restaurant} />
            ))}
          </div>
        </section>

        {/* Nouveaux Restaurants */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Nouveaux Restaurants
            </h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              API: Restaurant Service
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} {...restaurant} />
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 md:p-12 text-white text-center shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Livraison gratuite pour votre première commande ! 🎉
          </h2>
          <p className="text-lg md:text-xl mb-6 text-white/90">
            Inscrivez-vous maintenant et profitez de -20% sur votre première
            commande
          </p>
          <Link
            to="/signup"
            className="inline-block bg-white text-orange-600 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg"
          >
            Créer un compte
          </Link>
        </section>
      </div>
    </div>
  );
}
