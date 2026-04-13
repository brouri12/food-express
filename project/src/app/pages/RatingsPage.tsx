import { Star, ThumbsUp, Camera } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { mockRatings, mockOrders } from "../data/mockServices";

export default function RatingsPage() {
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");

  const unratedOrders = mockOrders.filter((o) => !o.rated);

  const handleSubmitRating = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Merci pour votre avis !");
    setShowRatingForm(false);
    setRating(0);
    setComment("");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Avis & Notations
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              API: Rating Service
            </span>
          </div>
        </div>

        {/* Pending Ratings */}
        {unratedOrders.length > 0 && (
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 mb-8 text-white">
            <h2 className="text-xl font-bold mb-4">
              🌟 Commandes à évaluer ({unratedOrders.length})
            </h2>
            <div className="space-y-3">
              {unratedOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold">{order.restaurantName}</p>
                    <p className="text-sm text-white/80">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowRatingForm(true)}
                    className="bg-white text-orange-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Donner mon avis
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rating Form Modal */}
        {showRatingForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowRatingForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Évaluez votre expérience
              </h2>
              <form onSubmit={handleSubmitRating} className="space-y-6">
                {/* Restaurant Info */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="font-semibold text-gray-900">Sushi Master</p>
                  <p className="text-sm text-gray-600">
                    Commandé le {new Date().toLocaleDateString()}
                  </p>
                </div>

                {/* Star Rating */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Note globale
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-12 h-12 ${
                            star <= (hoveredRating || rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                    {rating > 0 && (
                      <span className="ml-3 text-lg font-bold text-gray-900">
                        {rating}/5
                      </span>
                    )}
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Votre commentaire
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Partagez votre expérience..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ajoutez des photos (optionnel)
                  </label>
                  <button
                    type="button"
                    className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-orange-500 transition-colors"
                  >
                    <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 font-semibold">
                      Cliquez pour ajouter des photos
                    </p>
                  </button>
                </div>

                {/* Item Ratings */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Évaluer les plats
                  </label>
                  <div className="space-y-3">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-gray-900">
                          Assortiment Sushi
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            className="transition-transform hover:scale-110"
                          >
                            <Star className="w-6 h-6 text-gray-300 hover:text-yellow-400" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowRatingForm(false)}
                    className="flex-1 px-6 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={rating === 0}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Publier mon avis
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Previous Ratings */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Mes avis publiés
          </h2>
          <div className="space-y-6">
            {mockRatings.map((review) => (
              <div
                key={review.id}
                className="border-b border-gray-200 pb-6 last:border-0"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={review.userAvatar}
                    alt={review.userName}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-bold text-gray-900">
                          {review.userName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(review.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3">{review.comment}</p>
                    {review.photos && review.photos.length > 0 && (
                      <div className="flex gap-2 mb-3">
                        {review.photos.map((photo, idx) => (
                          <img
                            key={idx}
                            src={photo}
                            alt="Review"
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-4 text-sm">
                      <button className="flex items-center gap-1 text-gray-600 hover:text-orange-600 transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{review.helpful} personnes trouvent cela utile</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">18</div>
            <p className="text-gray-600">Avis donnés</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">4.8</div>
            <p className="text-gray-600">Note moyenne</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">142</div>
            <p className="text-gray-600">Personnes aidées</p>
          </div>
        </div>
      </div>
    </div>
  );
}
