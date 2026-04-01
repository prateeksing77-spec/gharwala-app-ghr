import { useNavigate } from 'react-router-dom';
import { Search, User, Truck, ChevronRight } from 'lucide-react';
import { products } from '@/data/products';
import { useAppStore } from '@/stores/cartStore';
import BottomNav from '@/components/BottomNav';
import KiraNeyLogo from '@/components/KiraNeyLogo';
import ProductCard from '@/components/ProductCard';

const categoryIcons = [
  { id: 'Dairy', emoji: '🥛', label: 'Dairy' },
  { id: 'Grocery', emoji: '🥘', label: 'Grocery' },
  { id: 'Snacks', emoji: '🍿', label: 'Snacks' },
  { id: 'Fruits', emoji: '🍎', label: 'Fruits' },
  { id: 'Vegetables', emoji: '🥬', label: 'Vegetables' },
  { id: 'Personal Care', emoji: '💄', label: 'Personal Care' },
];

const Home = () => {
  const navigate = useNavigate();
  const { orders } = useAppStore();

  // Buy again from previous orders
  const buyAgainProducts = orders.length > 0
    ? [...new Map(orders.flatMap((o) => o.items).map((i) => [i.product.id, i.product])).values()].slice(0, 6)
    : [];

  const dealProducts = products.filter((_, i) => [0, 8, 15, 20].includes(i));

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-card border-b border-border px-4 pt-3 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <KiraNeyLogo size={32} />
            <div>
              <p className="text-xs text-muted-foreground">📍 Delivering to</p>
              <p className="text-sm font-semibold text-foreground">My Area</p>
            </div>
          </div>
          <button onClick={() => navigate('/profile')} className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
            <User className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Search bar (UI only) */}
        <button onClick={() => navigate('/products')} className="flex w-full items-center gap-2 rounded-xl bg-muted px-3 py-3">
          <Search className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Search dal, atta, milk...</span>
        </button>
      </div>

      <div className="px-4 pt-4 space-y-6">
        {/* Banner */}
        <div className="rounded-xl bg-gradient-to-r from-primary to-primary/80 px-5 py-4">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary-foreground" />
            <p className="text-sm font-semibold text-primary-foreground">Free Delivery above ₹199! 🛵</p>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-3">Categories</h2>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
            {categoryIcons.map((cat) => (
              <button key={cat.id} onClick={() => navigate(`/products?category=${cat.id}`)}
                className="flex flex-col items-center gap-1.5 min-w-[64px]">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-2xl">
                  {cat.emoji}
                </div>
                <span className="text-xs font-medium text-foreground whitespace-nowrap">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Buy Again */}
        {buyAgainProducts.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-foreground mb-3">🔄 Buy Again</h2>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
              {buyAgainProducts.map((p) => (
                <div key={p.id} className="min-w-[150px] max-w-[150px]">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Today's Deals */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-foreground">⚡ Today's Deals</h2>
            <button onClick={() => navigate('/products')} className="flex items-center gap-0.5 text-sm font-medium text-primary">
              See all <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {dealProducts.map((p) => (
              <div key={p.id} className="min-w-[160px] max-w-[160px]">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Home;
