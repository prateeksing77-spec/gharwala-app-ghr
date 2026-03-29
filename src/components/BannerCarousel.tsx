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
    <div className="relative overflow-hidden rounded-lg">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className={`flex h-36 items-center justify-center rounded-lg bg-gradient-to-r ${banners[current].gradient} px-6`}
        >
          <h3 className="text-xl font-bold text-foreground">{banners[current].title}</h3>
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
        {banners.map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all ${i === current ? 'w-4 bg-foreground' : 'w-1.5 bg-foreground/40'}`} />
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;
