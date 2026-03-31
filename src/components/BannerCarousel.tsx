import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { banners } from '@/data/products';

const BannerCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % banners.length), 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="relative h-36 rounded-xl overflow-hidden"
        >
          <img src={banners[current].image} alt={banners[current].title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center px-6">
            <h3 className="text-xl font-bold text-white">{banners[current].title}</h3>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
        {banners.map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all ${i === current ? 'w-4 bg-primary' : 'w-1.5 bg-white/50'}`} />
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;
