import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Product } from '@/types';
import { useAppStore } from '@/stores/cartStore';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const { cart, addToCart, updateQuantity, removeFromCart } = useAppStore();
  const cartItem = cart.find((i) => i.product.id === product.id);
  const discount = product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col overflow-hidden rounded-lg border border-border bg-surface"
    >
      <div
        onClick={() => navigate(`/product/${product.id}`)}
        className="relative cursor-pointer bg-foreground/5 p-3"
      >
        <img src={product.image} alt={product.name} className="mx-auto h-24 w-24 object-contain" />
        <div className="absolute left-1 top-1 flex flex-col gap-1">
          {discount > 0 && (
            <span className="rounded bg-accent px-1.5 py-0.5 text-[10px] font-bold text-accent-foreground">
              {discount}% OFF
            </span>
          )}
          {product.isLocal && (
            <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
              LOCAL
            </span>
          )}
          {product.isFarmFresh && (
            <span className="rounded bg-primary/70 px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
              FARM FRESH
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-between p-2.5">
        <div>
          <p className="line-clamp-2 text-sm font-medium text-foreground">{product.name}</p>
          <p className="text-xs text-muted-foreground">{product.weight}</p>
        </div>
        <div className="mt-2 flex items-end justify-between">
          <div>
            <span className="text-sm font-bold text-primary">Rs.{product.price}</span>
            {discount > 0 && (
              <span className="ml-1 text-xs text-muted-foreground line-through">Rs.{product.mrp}</span>
            )}
          </div>
          {!cartItem ? (
            <button
              onClick={(e) => { e.stopPropagation(); addToCart(product); }}
              className="rounded-md border border-primary px-3 py-1 text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              ADD
            </button>
          ) : (
            <div className="flex items-center gap-2 rounded-md bg-primary px-1 py-0.5">
              <button onClick={(e) => { e.stopPropagation(); updateQuantity(product.id, cartItem.quantity - 1); }} className="text-primary-foreground">
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-[16px] text-center text-sm font-bold text-primary-foreground">{cartItem.quantity}</span>
              <button onClick={(e) => { e.stopPropagation(); updateQuantity(product.id, cartItem.quantity + 1); }} className="text-primary-foreground">
                <Plus className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
