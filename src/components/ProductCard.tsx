import { Plus, Minus } from 'lucide-react';
import { Product } from '@/types';
import { useAppStore } from '@/stores/cartStore';

const ProductCard = ({ product }: { product: Product }) => {
  const { cart, addToCart, updateQuantity } = useAppStore();
  const cartItem = cart.find((i) => i.product.id === product.id);
  const qty = cartItem?.quantity || 0;

  return (
    <div className="rounded-xl border border-border bg-card p-3 flex flex-col">
      <div className="aspect-square w-full rounded-lg bg-muted overflow-hidden mb-2">
        <img src={product.image} alt={product.name} className="h-full w-full object-cover" loading="lazy" />
      </div>
      <p className="text-xs text-muted-foreground">{product.brand}</p>
      <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-tight mt-0.5">{product.name}</h3>
      <p className="text-xs text-muted-foreground mt-0.5">{product.unit}</p>
      <div className="flex items-center justify-between mt-auto pt-2">
        <span className="text-base font-bold text-primary">₹{product.price}</span>
        {qty === 0 ? (
          <button onClick={() => addToCart(product)} className="flex items-center gap-1 rounded-lg border-2 border-secondary px-3 py-1.5 text-sm font-semibold text-secondary transition-colors hover:bg-secondary hover:text-secondary-foreground">
            ADD
          </button>
        ) : (
          <div className="flex items-center gap-2 rounded-lg bg-primary px-2 py-1">
            <button onClick={() => updateQuantity(product.id, qty - 1)} className="text-primary-foreground"><Minus className="h-4 w-4" /></button>
            <span className="min-w-[16px] text-center text-sm font-bold text-primary-foreground">{qty}</span>
            <button onClick={() => updateQuantity(product.id, qty + 1)} className="text-primary-foreground"><Plus className="h-4 w-4" /></button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
