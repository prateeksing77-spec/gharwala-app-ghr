import { useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/stores/cartStore';
import { motion, AnimatePresence } from 'framer-motion';

const CartBar = () => {
  const navigate = useNavigate();
  const cartCount = useAppStore((s) => s.getCartCount());
  const cartTotal = useAppStore((s) => s.getCartTotal());

  return (
    <AnimatePresence>
      {cartCount > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="fixed bottom-16 left-0 right-0 z-40 px-4 pb-2"
        >
          <button
            onClick={() => navigate('/cart')}
            className="flex w-full items-center justify-between rounded-lg bg-accent px-4 py-3 shadow-lg"
          >
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-accent-foreground" />
              <span className="font-semibold text-accent-foreground">
                {cartCount} item{cartCount > 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-accent-foreground">Rs.{cartTotal}</span>
              <ArrowRight className="h-5 w-5 text-accent-foreground" />
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartBar;
