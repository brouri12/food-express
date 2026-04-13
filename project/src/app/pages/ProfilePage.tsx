import {
  User,
  MapPin,
  CreditCard,
  Settings,
  LogOut,
  Edit,
  Plus,
  Clock,
  Star,
  Package,
  Shield,
  Bell,
} from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { mockUsers, mockOrders } from "../data/mockServices";
import { useState } from "react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const user = mockUsers.currentUser;
  const recentOrders = mockOrders.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
            />
            <div>
              <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
              <p className="text-white/90 mb-2">{user.email}</p>
              <div className="flex items-center gap-2">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
                  👤 {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
                <span className="text-sm text-white/70 bg-white/10 px-3 py-1 rounded-full">
                  API: User Service
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-4 space-y-2">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === "dashboard"
                    ? "bg-orange-50 text-orange-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Package className="w-5 h-5" />
                <span className="font-semibold">Dashboard</span>
              </button>
              <button
                onClick={() => setActiveTab("info")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === "info"
                    ? "bg-orange-50 text-orange-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <User className="w-5 h-5" />
                <span className="font-semibold">Informations</span>
              </button>
              <button
                onClick={() => setActiveTab("addresses")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === "addresses"
                    ? "bg-orange-50 text-orange-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <MapPin className="w-5 h-5" />
                <span className="font-semibold">Adresses</span>
              </button>
              <button
                onClick={() => setActiveTab("payment")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === "payment"
                    ? "bg-orange-50 text-orange-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span className="font-semibold">Paiements</span>
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === "settings"
                    ? "bg-orange-50 text-orange-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Settings className="w-5 h-5" />
                <span className="font-semibold">Paramètres</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all">
                <LogOut className="w-5 h-5" />
                <span className="font-semibold">Déconnexion</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Dashboard Tab */}
            {activeTab === "dashboard" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Package className="w-8 h-8 text-orange-500" />
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        Order Service
                      </span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mb-1">24</p>
                    <p className="text-gray-600 text-sm">Commandes totales</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Star className="w-8 h-8 text-yellow-500" />
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        Rating Service
                      </span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mb-1">18</p>
                    <p className="text-gray-600 text-sm">Avis donnés</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Clock className="w-8 h-8 text-blue-500" />
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        Delivery Service
                      </span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mb-1">28</p>
                    <p className="text-gray-600 text-sm">Minutes moy.</p>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">
                      Commandes récentes
                    </h2>
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      API: Order Service
                    </span>
                  </div>
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-orange-300 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              order.status === "delivered"
                                ? "bg-green-100"
                                : "bg-orange-100"
                            }`}
                          >
                            <Package
                              className={`w-6 h-6 ${
                                order.status === "delivered"
                                  ? "text-green-600"
                                  : "text-orange-600"
                              }`}
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {order.restaurantName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {order.items.length} article
                              {order.items.length > 1 ? "s" : ""} •{" "}
                              {order.total.toFixed(2)}€
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(order.orderDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                              order.status === "delivered"
                                ? "bg-green-100 text-green-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {order.status === "delivered" ? "Livrée" : "En cours"}
                          </span>
                          {order.status === "in-progress" && (
                            <Link
                              to={`/delivery/${order.id}`}
                              className="block mt-2 text-sm text-orange-600 hover:text-orange-700 font-semibold"
                            >
                              Suivre →
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Info Tab */}
            {activeTab === "info" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Informations personnelles
                  </h2>
                  <button className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold">
                    <Edit className="w-4 h-4" />
                    Modifier
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600">Nom complet</label>
                    <p className="text-lg font-semibold text-gray-900">
                      {user.name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Email</label>
                    <p className="text-lg font-semibold text-gray-900">
                      {user.email}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Téléphone</label>
                    <p className="text-lg font-semibold text-gray-900">
                      {user.phone}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Type de compte</label>
                    <p className="text-lg font-semibold text-gray-900">
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Addresses Tab */}
            {activeTab === "addresses" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    Mes adresses
                  </h2>
                  <button className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all">
                    <Plus className="w-4 h-4" />
                    Ajouter
                  </button>
                </div>
                {user.addresses.map((address) => (
                  <div
                    key={address.id}
                    className="bg-white rounded-xl shadow-sm p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <MapPin className="w-6 h-6 text-orange-500 mt-1" />
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-gray-900">
                              {address.label}
                            </h3>
                            {address.isDefault && (
                              <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">
                                Par défaut
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600">{address.address}</p>
                        </div>
                      </div>
                      <button className="text-orange-600 hover:text-orange-700">
                        <Edit className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Payment Tab */}
            {activeTab === "payment" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    Moyens de paiement
                  </h2>
                  <button className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all">
                    <Plus className="w-4 h-4" />
                    Ajouter
                  </button>
                </div>
                {user.paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="bg-white rounded-xl shadow-sm p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <CreditCard className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-900">
                              {method.brand}
                            </h3>
                            {method.isDefault && (
                              <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">
                                Par défaut
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600">
                            •••• •••• •••• {method.last4}
                          </p>
                        </div>
                      </div>
                      <button className="text-orange-600 hover:text-orange-700">
                        <Edit className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Paramètres
                </h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-semibold text-gray-900">
                          Notifications
                        </p>
                        <p className="text-sm text-gray-600">
                          Recevoir les notifications push
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={user.preferences.notifications}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-semibold text-gray-900">
                          Confidentialité
                        </p>
                        <p className="text-sm text-gray-600">
                          Gérer vos données personnelles
                        </p>
                      </div>
                    </div>
                    <button className="text-orange-600 hover:text-orange-700 font-semibold">
                      Gérer →
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
