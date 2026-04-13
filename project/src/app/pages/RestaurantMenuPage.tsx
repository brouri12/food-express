import { useParams, Link } from "react-router";
import { ArrowLeft, Star, Clock, MapPin, Info, ShoppingCart } from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import MenuItemCard from "../components/MenuItemCard";
import { mockRestaurants, mockMenus, mockRatings } from "../data/mockServices";

export default function RestaurantMenuPage() {
  const { id } = useParams();
  const restaurant = mockRestaurants.find((r) => r.id === id);
  const menu = id ? mockMenus[id] : null;
  const ratings = mockRatings.filter((r) => r.restaurantId === id);
  const [cartCount, setCartCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCartToast, setShowCartToast] = useState(false);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(cart.length);
  }, []);

  if (!restaurant || !menu) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Restaurant non trouvé
          </h2>
          <Link
            to="/restaurants"
            className="text-orange-600 hover:text-orange-700 font-semibold"
          >
            Retour aux restaurants
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = (item: any, categoryId: string) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push({
      restaurantId: id,
      restaurantName: restaurant.name,
      categoryId,
      ...item,
      quantity: 1,
    });
    localStorage.setItem("cart", JSON.stringify(cart));
    setCartCount(cart.length);
    setShowCartToast(true);
    setTimeout(() => setShowCartToast(false), 3000);
  };

  const displayCategories = selectedCategory
    ? menu.categories.filter((c) => c.id === selectedCategory)
    : menu.categories;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast notification */}
      {showCartToast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-xl z-50 flex items-center gap-2"
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="font-semibold">Ajouté au panier !</span>
        </motion.div>
      )}

      {/* Header avec image du restaurant */}
      <div className="relative h-64 md:h-80 bg-gray-900">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Back button */}
        <Link
          to="/restaurants"
          className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg hover:bg-white transition-all"
        >
          <ArrowLeft className="w-6 h-6 text-gray-900" />
        </Link>

        {/* Restaurant Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
          <div className="max-w-7xl mx-auto">
            {restaurant.promoted && restaurant.discount && (
              <span className="inline-block bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold mb-3">
                🔥 -{restaurant.discount}% de réduction
              </span>
            )}
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              {restaurant.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-current text-yellow-400" />
                <span className="font-semibold">{restaurant.rating}</span>
                <span className="text-white/80">
                  ({restaurant.ratingCount} avis)
                </span>
                <span className="text-xs text-white/70 bg-white/20 px-2 py-1 rounded ml-2">
                  Rating Service
                </span>
              </div>
              <div className="flex items-center gap-1 text-white/90">
                <Clock className="w-5 h-5" />
                <span>{restaurant.deliveryTime} min</span>
              </div>
              <div className="flex items-center gap-1 text-white/90">
                <MapPin className="w-5 h-5" />
                <span>Livraison: {restaurant.deliveryFee.toFixed(2)}€</span>
              </div>
            </div>
            <p className="mt-2 text-white/80">{restaurant.description}</p>
          </div>
        </div>
      </div>

      {/* Sticky Category Navigation */}
      <div className="sticky top-16 bg-white border-b border-gray-200 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-hide">
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">
              API: Menu Service
            </span>
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
                selectedCategory === null
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Tout le menu
            </button>
            {menu.categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu Items */}
          <div className="lg:col-span-2 space-y-8">
            {displayCategories.map((category) => (
              <div key={category.id}>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {category.name}
                </h2>
                <div className="space-y-4">
                  {category.items.map((item) => (
                    <MenuItemCard
                      key={item.id}
                      {...item}
                      onAddToCart={() => handleAddToCart(item, category.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar - Info & Reviews */}
          <div className="lg:col-span-1 space-y-6">
            {/* Info Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-40">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-orange-500" />
                <h3 className="font-bold text-gray-900">Informations</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Commande minimum</span>
                  <span className="font-semibold text-gray-900">
                    {restaurant.minOrder}€
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frais de livraison</span>
                  <span className="font-semibold text-gray-900">
                    {restaurant.deliveryFee.toFixed(2)}€
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Temps de livraison</span>
                  <span className="font-semibold text-gray-900">
                    {restaurant.deliveryTime} min
                  </span>
                </div>
              </div>

              {cartCount > 0 && (
                <Link
                  to="/cart"
                  className="mt-6 w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Voir le panier ({cartCount})
                </Link>
              )}
            </div>

            {/* Recent Reviews */}
            {ratings.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">Avis récents</h3>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    Rating Service
                  </span>
                </div>
                <div className="space-y-4">
                  {ratings.slice(0, 2).map((rating) => (
                    <div key={rating.id} className="border-b border-gray-100 pb-4 last:border-0">
                      <div className="flex items-center gap-2 mb-2">
                        <img
                          src={rating.userAvatar}
                          alt={rating.userName}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-gray-900">
                            {rating.userName}
                          </p>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < rating.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{rating.comment}</p>
                    </div>
                  ))}
                </div>
                <Link
                  to="/ratings"
                  className="mt-4 block text-center text-orange-600 hover:text-orange-700 font-semibold text-sm"
                >
                  Voir tous les avis →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
