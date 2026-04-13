import {
  Bell,
  Package,
  Tag,
  Truck,
  Star,
  Gift,
  CheckCircle,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { mockNotifications } from "../data/mockServices";

const iconMap: Record<string, any> = {
  truck: Truck,
  tag: Tag,
  "check-circle": CheckCircle,
  star: Star,
  gift: Gift,
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<string>("all");

  const filteredNotifications =
    filter === "all"
      ? notifications
      : notifications.filter((n) => n.type === filter);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Notifications
              </h1>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  API: Notification Service
                </span>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                    {unreadCount} non lues
                  </span>
                )}
              </div>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-orange-600 hover:text-orange-700 font-semibold"
              >
                Tout marquer comme lu
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
                filter === "all"
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Toutes ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("order")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
                filter === "order"
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Package className="w-4 h-4" />
              Commandes
            </button>
            <button
              onClick={() => setFilter("promotion")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
                filter === "promotion"
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Tag className="w-4 h-4" />
              Promotions
            </button>
            <button
              onClick={() => setFilter("delivery")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
                filter === "delivery"
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Truck className="w-4 h-4" />
              Livraisons
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => {
              const IconComponent = iconMap[notification.icon] || Bell;
              return (
                <motion.div
                  key={notification.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className={`bg-white rounded-xl shadow-sm p-5 transition-all hover:shadow-md ${
                    !notification.read ? "border-l-4 border-orange-500" : ""
                  }`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        notification.type === "order"
                          ? "bg-blue-100"
                          : notification.type === "promotion"
                          ? "bg-orange-100"
                          : notification.type === "delivery"
                          ? "bg-green-100"
                          : "bg-purple-100"
                      }`}
                    >
                      <IconComponent
                        className={`w-6 h-6 ${
                          notification.type === "order"
                            ? "text-blue-600"
                            : notification.type === "promotion"
                            ? "text-orange-600"
                            : notification.type === "delivery"
                            ? "text-green-600"
                            : "text-purple-600"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p
                          className={`font-semibold ${
                            !notification.read
                              ? "text-gray-900"
                              : "text-gray-700"
                          }`}
                        >
                          {notification.title}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <p className="text-gray-600 mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                          {notification.time}
                        </p>
                        {!notification.read && (
                          <span className="bg-orange-100 text-orange-600 text-xs font-semibold px-2 py-1 rounded">
                            Nouveau
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔔</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Aucune notification
              </h3>
              <p className="text-gray-600">
                Vous n'avez aucune notification dans cette catégorie
              </p>
            </div>
          )}
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Préférences de notifications
          </h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-semibold text-gray-900">
                  Notifications de commandes
                </p>
                <p className="text-sm text-gray-600">
                  Statut, livraison, problèmes
                </p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-semibold text-gray-900">
                  Promotions et offres
                </p>
                <p className="text-sm text-gray-600">
                  Codes promo, réductions exclusives
                </p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-semibold text-gray-900">
                  Nouveaux restaurants
                </p>
                <p className="text-sm text-gray-600">
                  Découvrez les dernières ouvertures
                </p>
              </div>
              <input
                type="checkbox"
                className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-semibold text-gray-900">
                  Demandes d'avis
                </p>
                <p className="text-sm text-gray-600">
                  Évaluez vos commandes livrées
                </p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
              />
            </label>
          </div>
          <button className="w-full mt-6 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-md">
            Enregistrer les préférences
          </button>
        </div>
      </div>
    </div>
  );
}
