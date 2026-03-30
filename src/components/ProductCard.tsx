import { Minus, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/types';
import { useAppStore } from '@/stores/cartStore';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ProductCard = ({ product }: { product: Product }) => {
  const navigate = useNavigate();
  const { cart, addToCart, updateQuantity } = useAppStore();
  const cartItem = cart.find((i) => i.product.id === product.id);
  const discount = product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added`);
  };

  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      onClick={() => navigate(`/product/${product.id}`)}
      className="relative flex flex-col overflow-hidden rounded-xl border border-border bg-card cursor-pointer"
    >
      {/* Badges */}
      <div className="absolute left-1.5 top-1.5 z-10 flex flex-col gap-1">
        {discount > 0 && (
          <span className="rounded bg-[hsl(var(--accent-gold))] px-1.5 py-0.5 text-[9px] font-bold text-[hsl(var(--accent-gold-foreground))]">
            {discount}% OFF
          </span>
        )}
        {product.isLocal && (
          <span className="rounded bg-primary px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground">LOCAL</span>
        )}
        {product.isFarmFresh && (
          <span className="rounded bg-primary/70 px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground">FARM FRESH</span>
        )}
      </div>

      {/* Image */}
      <div className="flex h-[140px] items-center justify-center bg-foreground/5 p-2">
        <img src={product.image} alt={product.name} className="h-full w-full object-cover rounded-lg" loading="lazy" />
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col justify-between p-2.5">
        <div>
          <p className="text-xs font-medium text-foreground line-clamp-2 leading-tight">{product.name}</p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">{product.weight}</p>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div>
            <span className="text-sm font-bold text-accent">Rs.{product.price}</span>
            {discount > 0 && (
              <span className="ml-1 text-[10px] text-muted-foreground line-through">Rs.{product.mrp}</span>
            )}
          </div>
          {!cartItem ? (
            <motion.button
              whileTap={{ scale: 1.15 }}
              onClick={handleAdd}
              className="rounded-md border border-accent px-3 py-1 text-xs font-bold text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              ADD
            </motion.button>
          ) : (
            <div className="flex items-center gap-1.5 rounded-md bg-accent px-1.5 py-0.5">
              <button onClick={(e) => { e.stopPropagation(); updateQuantity(product.id, cartItem.quantity - 1); }}>
                <Minus className="h-3.5 w-3.5 text-accent-foreground" />
              </button>
              <span className="min-w-[14px] text-center text-xs font-bold text-accent-foreground">{cartItem.quantity}</span>
              <button onClick={(e) => { e.stopPropagation(); updateQuantity(product.id, cartItem.quantity + 1); }}>
                <Plus className="h-3.5 w-3.5 text-accent-foreground" />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
