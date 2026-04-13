import { useParams } from "react-router";
import { MapPin, Phone, Clock, CheckCircle, Package } from "lucide-react";
import { motion } from "motion/react";
import { mockDelivery } from "../data/mockServices";
import { useState, useEffect } from "react";

export default function DeliveryTrackingPage() {
  const { orderId } = useParams();
  const delivery = mockDelivery.currentDelivery;
  const [estimatedTime, setEstimatedTime] = useState(delivery.estimatedTime);

  useEffect(() => {
    // Simuler le compte à rebours
    const interval = setInterval(() => {
      setEstimatedTime((prev) => Math.max(0, prev - 1));
    }, 60000); // Décrémenter chaque minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Suivi de livraison
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Commande #{orderId}</span>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              API: Delivery Service
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Carte simulée */}
              <div className="relative h-96 md:h-[500px] bg-gradient-to-br from-blue-100 to-green-100">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8">
                    <MapPin className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                    <p className="text-gray-700 font-semibold mb-2">
                      Carte interactive en temps réel
                    </p>
                    <p className="text-sm text-gray-600">
                      Position du livreur • Trajet optimisé • ETA dynamique
                    </p>
                  </div>
                </div>

                {/* Restaurant marker */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute top-20 left-1/4 transform -translate-x-1/2"
                >
                  <div className="bg-blue-500 text-white p-3 rounded-full shadow-lg">
                    🏪
                  </div>
                </motion.div>

                {/* Delivery marker */}
                <motion.div
                  animate={{
                    x: [0, 50, 100],
                    y: [0, 30, 60],
                  }}
                  transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                  className="absolute top-1/2 left-1/3 transform -translate-x-1/2"
                >
                  <div className="bg-orange-500 text-white p-3 rounded-full shadow-lg">
                    🛵
                  </div>
                </motion.div>

                {/* Destination marker */}
                <div className="absolute bottom-20 right-1/4 transform translate-x-1/2">
                  <div className="bg-green-500 text-white p-3 rounded-full shadow-lg">
                    🏠
                  </div>
                </div>
              </div>

              {/* ETA Banner */}
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/80 mb-1">
                      Arrivée estimée
                    </p>
                    <p className="text-3xl font-bold">{estimatedTime} minutes</p>
                  </div>
                  <Clock className="w-12 h-12 text-white/80" />
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Status Timeline */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Statut de la commande
              </h2>
              <div className="space-y-4">
                {delivery.timeline.map((step, index) => (
                  <div key={step.status} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step.completed
                            ? "bg-green-500"
                            : index === delivery.timeline.findIndex((s) => !s.completed)
                            ? "bg-orange-500 animate-pulse"
                            : "bg-gray-200"
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : (
                          <div className="w-3 h-3 bg-white rounded-full" />
                        )}
                      </div>
                      {index < delivery.timeline.length - 1 && (
                        <div
                          className={`w-0.5 h-12 ${
                            step.completed ? "bg-green-500" : "bg-gray-200"
                          }`}
                        />
                      )}
                    </div>
                    <div className="flex-1 pt-1">
                      <p
                        className={`font-semibold ${
                          step.completed ? "text-gray-900" : "text-gray-500"
                        }`}
                      >
                        {step.label}
                      </p>
                      {step.time && (
                        <p className="text-sm text-gray-500">{step.time}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Driver Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Votre livreur
              </h2>
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={delivery.driver.avatar}
                  alt={delivery.driver.name}
                  className="w-16 h-16 rounded-full"
                />
                <div className="flex-1">
                  <p className="font-bold text-gray-900">
                    {delivery.driver.name}
                  </p>
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-yellow-500">★</span>
                    <span className="font-semibold text-gray-900">
                      {delivery.driver.rating}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {delivery.driver.vehicle}
                  </p>
                </div>
              </div>
              <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all">
                <Phone className="w-5 h-5" />
                Contacter le livreur
              </button>
            </div>

            {/* Order Details */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Détails de la commande
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-orange-500 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      Sushi Master
                    </p>
                    <p className="text-sm text-gray-600">
                      1 article • 25.90€
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-orange-500 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      Adresse de livraison
                    </p>
                    <p className="text-sm text-gray-600">
                      15 Rue de la Paix, 75002 Paris
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
              <p className="font-semibold text-gray-900 mb-2">
                Besoin d'aide ?
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Notre équipe support est disponible 7j/7
              </p>
              <button className="w-full bg-white text-orange-600 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors border border-orange-300">
                Contacter le support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
