import { Search, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { useState } from "react";

interface HeroSectionProps {
  onSearch?: (query: string) => void;
}

export default function HeroSection({ onSearch }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    onSearch?.(searchQuery);
  };

  return (
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
              <Search className="w-6 h-6 text-gray-400 ml-3 shrink-0" />
              <input
                type="text"
                placeholder="Rechercher un restaurant ou un plat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 px-3 py-3 text-gray-900 outline-none bg-transparent"
              />
              <Link
                to={`/restaurants?search=${encodeURIComponent(searchQuery)}`}
                onClick={handleSearch}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all whitespace-nowrap"
              >
                Rechercher
              </Link>
            </div>
          </div>

          {/* Location hint */}
          <div className="mt-4 flex items-center justify-center gap-2 text-white/80 text-sm">
            <MapPin className="w-4 h-4" />
            <span>Livraison disponible dans toute la France</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
