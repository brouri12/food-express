import { useState } from "react";
import { Link, useLocation } from "react-router";
import { ShoppingCart, Bell, User, Menu, X, UtensilsCrossed } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface HeaderProps {
  cartCount?: number;
  notifCount?: number;
  isLoggedIn?: boolean;
  userName?: string;
}

const navLinks = [
  { to: "/", label: "Accueil" },
  { to: "/restaurants", label: "Restaurants" },
];

export default function Header({
  cartCount = 0,
  notifCount = 0,
  isLoggedIn = false,
  userName,
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-orange-600">
            <UtensilsCrossed className="w-7 h-7" />
            <span>FoodExpress</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`font-medium transition-colors ${
                  isActive(link.to)
                    ? "text-orange-600"
                    : "text-gray-600 hover:text-orange-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-orange-600 transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            {/* Notifications */}
            {isLoggedIn && (
              <Link to="/notifications" className="relative p-2 text-gray-600 hover:text-orange-600 transition-colors">
                <Bell className="w-6 h-6" />
                {notifCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {notifCount}
                  </span>
                )}
              </Link>
            )}

            {/* Auth */}
            {isLoggedIn ? (
              <Link
                to="/profile"
                className="hidden md:flex items-center gap-2 bg-orange-50 text-orange-700 px-4 py-2 rounded-xl font-medium hover:bg-orange-100 transition-colors"
              >
                <User className="w-4 h-4" />
                <span>{userName ?? "Mon compte"}</span>
              </Link>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-gray-700 font-medium hover:text-orange-600 transition-colors px-3 py-2"
                >
                  Connexion
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all"
                >
                  S'inscrire
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 text-gray-600"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-gray-100 bg-white overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`font-medium py-2 ${
                    isActive(link.to) ? "text-orange-600" : "text-gray-700"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {!isLoggedIn && (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="text-gray-700 font-medium py-2">
                    Connexion
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-3 rounded-xl font-semibold text-center"
                  >
                    S'inscrire
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
