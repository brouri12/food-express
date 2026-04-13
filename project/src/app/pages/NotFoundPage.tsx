import { Link } from "react-router";
import { Home, Search } from "lucide-react";
import { motion } from "motion/react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="text-9xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-4">
          404
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Page introuvable
        </h1>
        <p className="text-gray-600 mb-8">
          Oups ! Il semblerait que cette page n'existe pas ou a été déplacée.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/"
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg"
          >
            <Home className="w-5 h-5" />
            Retour à l'accueil
          </Link>
          <Link
            to="/restaurants"
            className="flex items-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-lg border-2 border-gray-200"
          >
            <Search className="w-5 h-5" />
            Voir les restaurants
          </Link>
        </div>
        <div className="mt-12 text-6xl">🍕</div>
      </motion.div>
    </div>
  );
}
