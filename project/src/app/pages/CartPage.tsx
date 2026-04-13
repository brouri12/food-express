import { Trash2, Plus, Minus, Tag, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { mockPromotions } from "../data/mockServices";

interface CartItem {
  id: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<any>(null);
  const [selectedAddress, setSelectedAddress] = useState("addr-1");
  const [selectedPayment, setSelectedPayment] = useState("pay-1");

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    
    // Agréger les items identiques
    const aggregated: { [key: string]: CartItem } = {};
    cart.forEach((item: any) => {
      if (aggregated[item.id]) {
        aggregated[item.id].quantity += 1;
      } else {
        aggregated[item.id] = { ...item, quantity: 1 };
      }
    });
    
    setCartItems(Object.values(aggregated));
  }, []);

  const updateCart = (newItems: CartItem[]) => {
    setCartItems(newItems);
    const flatCart = newItems.flatMap((item) =>
      Array(item.quantity).fill({ ...item, quantity: 1 })
    );
    localStorage.setItem("cart", JSON.stringify(flatCart));
  };

  const updateQuantity = (itemId: string, change: number) => {
    const newItems = cartItems
      .map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      )
      .filter((item) => item.quantity > 0);
    updateCart(newItems);
  };

  const removeItem = (itemId: string) => {
    const newItems = cartItems.filter((item) => item.id !== itemId);
    updateCart(newItems);
  };

  const applyPromoCode = () => {
    const promo = mockPromotions.find(
      (p) => p.code && p.code.toLowerCase() === promoCode.toLowerCase()
    );
    if (promo) {
      setAppliedPromo(promo);
    } else {
      alert("Code promo invalide");
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = cartItems.length > 0 ? 2.5 : 0;
  const discount = appliedPromo
    ? appliedPromo.type === "percentage"
      ? (subtotal * appliedPromo.discount) / 100
      : appliedPromo.type === "free-delivery"
      ? deliveryFee
      : 0
    : 0;
  const total = subtotal + deliveryFee - discount;

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    // Simuler la commande
    localStorage.setItem("cart", "[]");
    window.location.href = "/delivery/order-2";
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Votre panier est vide
          </h2>
          <p className="text-gray-600 mb-6">
            Découvrez nos restaurants et ajoutez des plats délicieux !
          </p>
          <Link
            to="/restaurants"
            className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg"
          >
            Découvrir les restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mon Panier</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              API: Order Service
            </span>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              API: Promotion Service
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Articles ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
              </h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        {item.restaurantName}
                      </p>
                      <p className="text-orange-600 font-bold mt-1">
                        {item.price.toFixed(2)}€
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 hover:bg-white rounded transition-colors"
                        >
                          <Minus className="w-4 h-4 text-gray-700" />
                        </button>
                        <span className="font-semibold text-gray-900 px-2">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 hover:bg-white rounded transition-colors"
                        >
                          <Plus className="w-4 h-4 text-gray-700" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Promo Code */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-5 h-5 text-orange-500" />
                <h2 className="text-xl font-bold text-gray-900">Code Promo</h2>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  Promotion Service
                </span>
              </div>
              {appliedPromo ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-green-700">
                      ✓ Code appliqué !
                    </p>
                    <p className="text-sm text-green-600">{appliedPromo.title}</p>
                  </div>
                  <button
                    onClick={() => setAppliedPromo(null)}
                    className="text-green-600 hover:text-green-700 font-semibold"
                  >
                    Retirer
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Entrez votre code"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    onClick={applyPromoCode}
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all"
                  >
                    Appliquer
                  </button>
                </div>
              )}
              <div className="mt-4 space-y-2">
                <p className="text-sm font-semibold text-gray-700">
                  Codes disponibles :
                </p>
                {mockPromotions
                  .filter((p) => p.code)
                  .map((promo) => (
                    <button
                      key={promo.id}
                      onClick={() => {
                        setPromoCode(promo.code!);
                        setAppliedPromo(promo);
                      }}
                      className="w-full text-left p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
                    >
                      <p className="font-semibold text-orange-600 text-sm">
                        {promo.code}
                      </p>
                      <p className="text-xs text-gray-600">{promo.title}</p>
                    </button>
                  ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Résumé de la commande
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Sous-total</span>
                  <span className="font-semibold">{subtotal.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Livraison</span>
                  <span className="font-semibold">{deliveryFee.toFixed(2)}€</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Réduction</span>
                    <span className="font-semibold">-{discount.toFixed(2)}€</span>
                  </div>
                )}
                <div className="pt-3 border-t border-gray-200 flex justify-between">
                  <span className="font-bold text-gray-900 text-lg">Total</span>
                  <span className="font-bold text-orange-600 text-lg">
                    {total.toFixed(2)}€
                  </span>
                </div>
              </div>

              {/* Address Selection */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Adresse de livraison
                </label>
                <select
                  value={selectedAddress}
                  onChange={(e) => setSelectedAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="addr-1">Maison - 15 Rue de la Paix</option>
                  <option value="addr-2">Bureau - 42 Avenue des Champs</option>
                </select>
              </div>

              {/* Payment Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Moyen de paiement
                </label>
                <select
                  value={selectedPayment}
                  onChange={(e) => setSelectedPayment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="pay-1">Visa •••• 4242</option>
                  <option value="pay-2">Mastercard •••• 5555</option>
                </select>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                Commander
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <p className="text-xs text-gray-500 text-center mt-4">
                En commandant, vous acceptez nos conditions d'utilisation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
