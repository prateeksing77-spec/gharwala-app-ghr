import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, ShoppingCart } from 'lucide-react';
import { products } from '@/data/products';
import { useAppStore } from '@/stores/cartStore';
import ProductCard from '@/components/ProductCard';
import BottomNav from '@/components/BottomNav';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === id);
  const { cart, addToCart, updateQuantity } = useAppStore();

  const [selectedWeight, setSelectedWeight] = useState(product?.weight || '');
  const [qty, setQty] = useState(1);

  if (!product) return <div className="flex min-h-screen items-center justify-center bg-background text-foreground">Product not found</div>;

  const cartItem = cart.find((i) => i.product.id === product.id);
  const discount = product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addToCart(product, selectedWeight);
    toast.success('Added to cart');
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-30 flex items-center gap-3 bg-background/95 backdrop-blur-sm px-4 py-3">
        <button onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5 text-foreground" /></button>
        <h1 className="text-lg font-bold text-foreground">Product Details</h1>
      </div>

      <div className="bg-foreground/5 p-8 flex items-center justify-center relative">
        <img src={product.image} alt={product.name} className="h-48 w-48 object-contain" />
        <div className="absolute left-3 top-3 flex flex-col gap-1">
          {discount > 0 && <span className="rounded bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground">{discount}% OFF</span>}
          {product.isLocal && <span className="rounded bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">LOCAL</span>}
          {product.isFarmFresh && <span className="rounded bg-primary/70 px-2 py-0.5 text-xs font-bold text-primary-foreground">FARM FRESH</span>}
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">{product.name}</h2>
          {product.nameHindi && <p className="text-sm text-muted-foreground">{product.nameHindi}</p>}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-primary">Rs.{product.price}</span>
          {discount > 0 && (
            <>
              <span className="text-lg text-muted-foreground line-through">Rs.{product.mrp}</span>
              <span className="rounded bg-accent/20 px-2 py-0.5 text-sm font-bold text-accent">{discount}% OFF</span>
            </>
          )}
        </div>

        {product.weightVariants && product.weightVariants.length > 1 && (
          <div className="flex gap-2">
            {product.weightVariants.map((w) => (
              <button key={w} onClick={() => setSelectedWeight(w)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium ${selectedWeight === w ? 'border-primary bg-primary/20 text-primary' : 'border-border text-muted-foreground'}`}>
                {w}
              </button>
            ))}
          </div>
        )}

        <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>

        {!cartItem ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 rounded-lg bg-surface px-3 py-2">
              <button onClick={() => setQty(Math.max(1, qty - 1))}><Minus className="h-5 w-5 text-muted-foreground" /></button>
              <span className="min-w-[24px] text-center font-bold text-foreground">{qty}</span>
              <button onClick={() => setQty(qty + 1)}><Plus className="h-5 w-5 text-muted-foreground" /></button>
            </div>
            <button onClick={handleAdd} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary py-3 font-semibold text-primary-foreground">
              <ShoppingCart className="h-5 w-5" /> Add to Cart
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between rounded-lg bg-surface p-3">
            <span className="text-sm text-muted-foreground">In cart</span>
            <div className="flex items-center gap-3 rounded-lg bg-primary px-3 py-1.5">
              <button onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}><Minus className="h-4 w-4 text-primary-foreground" /></button>
              <span className="min-w-[20px] text-center font-bold text-primary-foreground">{cartItem.quantity}</span>
              <button onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}><Plus className="h-4 w-4 text-primary-foreground" /></button>
            </div>
          </div>
        )}

        {related.length > 0 && (
          <div>
            <h3 className="mb-3 text-lg font-bold text-foreground">Related Products</h3>
            <div className="grid grid-cols-2 gap-3">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default ProductDetail;
