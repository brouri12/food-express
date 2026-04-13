import { Outlet, Link, useLocation } from "react-router";
import { ShoppingCart, User, Bell, Home, Store, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { mockNotifications } from "../data/mockServices";

export default function Layout() {
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    // Simuler le nombre d'articles dans le panier depuis localStorage
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(cart.length);
    
    // Compter les notifications non lues
    const unread = mockNotifications.filter(n => !n.read).length;
    setUnreadNotifications(unread);
  }, [location]);

  const hideHeaderRoutes = ["/login", "/signup"];
  const showHeader = !hideHeaderRoutes.includes(location.pathname);

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    return location.pathname.startsWith(path) && path !== "/";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Desktop */}
      {showHeader && (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl font-bold">🍽️</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  FoodExpress
                </span>
              </Link>

              {/* Navigation Desktop */}
              <nav className="hidden md:flex items-center gap-6">
                <Link
                  to="/"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive("/") && location.pathname === "/"
                      ? "text-orange-600 bg-orange-50"
                      : "text-gray-700 hover:text-orange-600 hover:bg-gray-50"
                  }`}
                >
                  <Home className="w-5 h-5" />
                  <span className="font-medium">Accueil</span>
                </Link>
                <Link
                  to="/restaurants"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive("/restaurants")
                      ? "text-orange-600 bg-orange-50"
                      : "text-gray-700 hover:text-orange-600 hover:bg-gray-50"
                  }`}
                >
                  <Store className="w-5 h-5" />
                  <span className="font-medium">Restaurants</span>
                </Link>
              </nav>

              {/* Actions */}
              <div className="flex items-center gap-4">
                <Link
                  to="/notifications"
                  className="relative p-2 text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Bell className="w-6 h-6" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </Link>
                <Link
                  to="/cart"
                  className="relative p-2 text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all shadow-md"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium hidden lg:inline">Profil</span>
                </Link>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="pb-20 md:pb-0">
        <Outlet />
      </main>

      {/* Bottom Navigation Mobile */}
      {showHeader && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg">
          <div className="flex items-center justify-around h-16 px-4">
            <Link
              to="/"
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
                isActive("/") && location.pathname === "/"
                  ? "text-orange-600"
                  : "text-gray-600"
              }`}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs font-medium">Accueil</span>
            </Link>
            <Link
              to="/restaurants"
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
                isActive("/restaurants") ? "text-orange-600" : "text-gray-600"
              }`}
            >
              <Store className="w-6 h-6" />
              <span className="text-xs font-medium">Restaurants</span>
            </Link>
            <Link
              to="/cart"
              className={`relative flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
                isActive("/cart") ? "text-orange-600" : "text-gray-600"
              }`}
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 right-1 w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
              <span className="text-xs font-medium">Panier</span>
            </Link>
            <Link
              to="/profile"
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
                isActive("/profile") ? "text-orange-600" : "text-gray-600"
              }`}
            >
              <User className="w-6 h-6" />
              <span className="text-xs font-medium">Profil</span>
            </Link>
          </div>
        </nav>
      )}
    </div>
  );
}
