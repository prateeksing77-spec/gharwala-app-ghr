import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, Minus, Plus, ShoppingCart, RotateCcw, Phone, Bike, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [openSection, setOpenSection] = useState<string | null>(null);

  if (!product) return <div className="flex min-h-screen items-center justify-center bg-background text-foreground">Product not found</div>;

  const cartItem = cart.find((i) => i.product.id === product.id);
  const discount = product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 6);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addToCart(product, selectedWeight);
    toast.success('Added to cart');
  };

  const toggleSection = (s: string) => setOpenSection(openSection === s ? null : s);

  const AccordionSection = ({ title, children, id: sId }: { title: string; children: React.ReactNode; id: string }) => (
    <div className="border-b border-border">
      <button onClick={() => toggleSection(sId)} className="flex w-full items-center justify-between py-3">
        <span className="text-sm font-semibold text-foreground">{title}</span>
        {openSection === sId ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${openSection === sId ? 'max-h-96 pb-3' : 'max-h-0'}`}>
        {children}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between bg-background/95 backdrop-blur-sm px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5 text-foreground" /></button>
          <h1 className="text-base font-semibold text-foreground line-clamp-1">{product.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5"><Heart className="h-5 w-5 text-muted-foreground" /></button>
          <button className="p-1.5"><Share2 className="h-5 w-5 text-muted-foreground" /></button>
        </div>
      </div>

      {/* Image */}
      <div className="bg-[#F5F5F5] p-6 flex items-center justify-center relative">
        <img src={product.image} alt={product.name} className="h-52 w-52 object-contain" />
        <div className="absolute left-3 top-3 flex flex-col gap-1">
          {discount > 0 && <span className="rounded bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">{discount}% OFF</span>}
          {product.isLocal && <span className="rounded bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground">LOCAL</span>}
          {product.isFarmFresh && <span className="rounded bg-primary/70 px-2 py-0.5 text-xs font-bold text-primary-foreground">FARM FRESH</span>}
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Name & Price */}
        <div>
          <h2 className="text-xl font-bold text-foreground">{product.name}</h2>
          {product.nameHindi && <p className="text-sm text-muted-foreground">{product.nameHindi}</p>}
        </div>

        {/* Weight variants */}
        {product.weightVariants && product.weightVariants.length > 1 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {product.weightVariants.map((w) => (
              <button key={w} onClick={() => setSelectedWeight(w)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium whitespace-nowrap ${selectedWeight === w ? 'border-accent bg-accent text-accent-foreground' : 'border-border text-muted-foreground'}`}>
                {w}
              </button>
            ))}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-accent">Rs.{product.price}</span>
          {discount > 0 && (
            <>
              <span className="text-lg text-muted-foreground line-through">Rs.{product.mrp}</span>
              <span className="rounded-full bg-primary/20 px-2 py-0.5 text-sm font-bold text-primary">{discount}% OFF</span>
            </>
          )}
        </div>

        {/* Trust section */}
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center gap-1 rounded-lg bg-card p-3 border border-border">
            <RotateCcw className="h-5 w-5 text-accent" />
            <span className="text-[10px] font-medium text-foreground">Replace</span>
            <span className="text-[9px] text-muted-foreground">24 hours</span>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-lg bg-card p-3 border border-border">
            <Phone className="h-5 w-5 text-accent" />
            <span className="text-[10px] font-medium text-foreground">Call us</span>
            <span className="text-[9px] text-muted-foreground">Anytime</span>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-lg bg-card p-3 border border-border">
            <Bike className="h-5 w-5 text-accent" />
            <span className="text-[10px] font-medium text-foreground">Fast</span>
            <span className="text-[9px] text-muted-foreground">Delivery</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>

        {/* Accordion sections */}
        <div>
          <AccordionSection title="Product Info" id="info">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Category</span><span className="text-foreground">{product.category.replace(/-/g, ' ')}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Weight</span><span className="text-foreground">{product.weight}</span></div>
              {product.isLocal && <div className="flex justify-between"><span className="text-muted-foreground">Source</span><span className="text-foreground">Local</span></div>}
              <div className="flex justify-between"><span className="text-muted-foreground">Return Policy</span><span className="text-foreground">24hr replacement</span></div>
            </div>
          </AccordionSection>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div>
            <h3 className="mb-3 text-lg font-bold text-foreground">Similar Products</h3>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
              {related.map((p) => (
                <div key={p.id} className="min-w-[160px] max-w-[160px]">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fixed bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{selectedWeight || product.weight}</p>
            <p className="text-lg font-bold text-accent">Rs.{product.price}</p>
            <p className="text-[10px] text-muted-foreground">Inclusive of taxes</p>
          </div>
          {!cartItem ? (
            <button onClick={handleAdd} className="flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-semibold text-accent-foreground">
              <ShoppingCart className="h-5 w-5" /> Add to cart
            </button>
          ) : (
            <div className="flex items-center gap-3 rounded-lg bg-accent px-4 py-2">
              <button onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}><Minus className="h-5 w-5 text-accent-foreground" /></button>
              <span className="min-w-[24px] text-center font-bold text-accent-foreground">{cartItem.quantity}</span>
              <button onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}><Plus className="h-5 w-5 text-accent-foreground" /></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
