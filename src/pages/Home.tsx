import { useNavigate } from 'react-router-dom';
import { Search, User, Truck, ChevronRight } from 'lucide-react';
import { products, categories } from '@/data/products';
import { useAppStore } from '@/stores/cartStore';
import BottomNav from '@/components/BottomNav';
import ProductCard from '@/components/ProductCard';

const categoryMeta: Record<string, { emoji: string }> = {
  Dairy: { emoji: '🥛' },
  Grocery: { emoji: '🥘' },
  Snacks: { emoji: '🍿' },
  Fruits: { emoji: '🍎' },
  Vegetables: { emoji: '🥬' },
  'Personal Care': { emoji: '💄' },
};

const Home = () => {
  const navigate = useNavigate();
  const { orders } = useAppStore();

  const buyAgainProducts = orders.length > 0
    ? [...new Map(orders.flatMap((o) => o.items).map((i) => [i.product.id, i.product])).values()].slice(0, 6)
    : [];

  const dealProducts = products.filter((_, i) => [0, 8, 15, 20].includes(i));

  return (
    <div className="min-h-screen bg-background pb-[70px]">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-card border-b border-border px-4 pt-3 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-muted-foreground">📍 Delivering to</p>
            <p className="text-sm font-semibold text-foreground">My Area</p>
          </div>
          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
            <User className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

      </div>

      {/* Search Bar */}
      <div className="px-4 mt-4">
        <div className="flex items-center gap-2 h-[46px] rounded-[12px] bg-card border border-border px-3">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            readOnly
            placeholder="Search for atta, dal, milk..."
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-[#667788]"
          />
        </div>
      </div>

      {/* Banner */}
      <div className="mx-4 mt-3 h-[140px] rounded-[14px] bg-gradient-to-r from-primary to-[#FF8F5E] px-6 flex flex-col justify-center">
        <p className="text-[20px] font-bold text-white">Free Delivery above ₹399! 🛵</p>
        <p className="text-[13px] text-white mt-1">Order now & save more</p>
      </div>

      <div className="px-4 pt-4 space-y-6">

        {/* Categories */}
        <div id="categories">
          <h2 className="text-lg font-bold text-foreground mb-3">Categories</h2>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
            {categories.map((cat) => (
              <button key={cat} onClick={() => navigate(`/category/${cat.toLowerCase().replace(/ /g, '-')}`)}
                className="flex flex-col items-center gap-1.5 min-w-[64px]">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-2xl">
                  {categoryMeta[cat]?.emoji || '📦'}
                </div>
                <span className="text-xs font-medium text-foreground whitespace-nowrap">{cat}</span>
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
            <button onClick={() => navigate('/category/all')} className="flex items-center gap-0.5 text-sm font-medium text-primary">
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
