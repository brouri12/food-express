import { Mail, Lock, Eye, EyeOff, User, Phone } from "lucide-react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { useState } from "react";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState<"client" | "livreur" | "restaurateur">("client");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl mb-4">
              <span className="text-3xl">🍽️</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Créer un compte
            </h1>
            <p className="text-gray-600">Rejoignez FoodExpress dès aujourd'hui</p>
            <div className="mt-4 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg inline-block">
              🔐 API: User Service - Registration
            </div>
          </div>

          {/* Account Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Type de compte
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setAccountType("client")}
                className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                  accountType === "client"
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                🛍️ Client
              </button>
              <button
                type="button"
                onClick={() => setAccountType("livreur")}
                className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                  accountType === "livreur"
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                🛵 Livreur
              </button>
              <button
                type="button"
                onClick={() => setAccountType("restaurateur")}
                className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                  accountType === "restaurateur"
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                🍴 Restaurant
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nom complet
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Votre nom"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="votre@email.com"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Téléphone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+33 6 12 34 56 78"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <label className="flex items-start gap-2 cursor-pointer text-sm">
              <input
                type="checkbox"
                className="w-4 h-4 mt-0.5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                required
              />
              <span className="text-gray-700">
                J'accepte les{" "}
                <Link to="/terms" className="text-orange-600 hover:text-orange-700 font-semibold">
                  conditions d'utilisation
                </Link>{" "}
                et la{" "}
                <Link to="/privacy" className="text-orange-600 hover:text-orange-700 font-semibold">
                  politique de confidentialité
                </Link>
              </span>
            </label>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg"
            >
              Créer mon compte
            </motion.button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Déjà un compte ?{" "}
            <Link
              to="/login"
              className="text-orange-600 hover:text-orange-700 font-semibold"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
