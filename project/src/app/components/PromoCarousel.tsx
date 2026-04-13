import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

interface Promo {
  id: string;
  title: string;
  description: string;
  code?: string;
  image: string;
  discount?: number;
}

interface PromoCarouselProps {
  promotions: Promo[];
  autoPlayInterval?: number;
}

export default function PromoCarousel({
  promotions,
  autoPlayInterval = 4000,
}: PromoCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % promotions.length);
  }, [promotions.length]);

  const prev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + promotions.length) % promotions.length);
  };

  useEffect(() => {
    const timer = setInterval(next, autoPlayInterval);
    return () => clearInterval(timer);
  }, [next, autoPlayInterval]);

  if (!promotions.length) return null;

  const promo = promotions[current];

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Sparkles className="w-7 h-7 text-orange-500" />
          Offres Spéciales
        </h2>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          API: Promotion Service
        </span>
      </div>

      <div className="relative overflow-hidden rounded-2xl shadow-xl group">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            initial={{ opacity: 0, x: direction * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -60 }}
            transition={{ duration: 0.4 }}
            className="relative h-64 md:h-80"
          >
            <img
              src={promo.image}
              alt={promo.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
              <h3 className="text-2xl md:text-4xl font-bold mb-2">{promo.title}</h3>
              <p className="text-lg md:text-xl mb-4">{promo.description}</p>
              {promo.code && (
                <div className="inline-block bg-white text-gray-900 px-4 py-2 rounded-lg font-bold text-sm md:text-base">
                  Code : {promo.code}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Précédent"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Suivant"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {promotions.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > current ? 1 : -1);
              setCurrent(index);
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === current ? "bg-orange-500 w-8" : "bg-gray-300 w-2"
            }`}
            aria-label={`Promotion ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
