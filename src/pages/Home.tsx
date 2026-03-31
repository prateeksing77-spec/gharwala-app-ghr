import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Truck, ChevronRight } from 'lucide-react';
import { useAppStore } from '@/stores/cartStore';
import { categories, categorySections } from '@/data/categories';
import { products } from '@/data/products';
import { deliverySettings } from '@/data/settings';
import BottomNav from '@/components/BottomNav';
import CartBar from '@/components/CartBar';
import BannerCarousel from '@/components/BannerCarousel';
import KiraNeyLogo from '@/components/KiraNeyLogo';
import ProductCard from '@/components/ProductCard';

const mainCategories = [
  { id: 'dairy-bread-eggs', name: 'Dairy', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=200' },
  { id: 'atta-rice-dal', name: 'Grocery', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200' },
  { id: 'chips-namkeen', name: 'Snacks', image: 'https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=200' },
  { id: 'vegetables-fruits', name: 'Fruits', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200' },
  { id: 'farm-fresh', name: 'Vegetables', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200' },
  { id: 'bath-body', name: 'Personal Care', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200' },
];

const Home = () => {
  const navigate = useNavigate();
  const { unreadCount, orders } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');

  // Search filtering
  const searchResults = searchQuery.trim()
    ? products.filter((p) => {
        const q = searchQuery.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || (p.nameHindi && p.nameHindi.toLowerCase().includes(q));
      }).slice(0, 8)
    : [];

  // Buy Again from previous orders
  const buyAgainProducts = orders.length > 0
    ? [...new Map(orders.flatMap((o) => o.items).map((i) => [i.product.id, i.product])).values()].slice(0, 6)
    : [];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-card border-b border-border px-4 pt-3 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <KiraNeyLogo size={32} />
            <span className="text-lg font-bold text-foreground">KiraNey</span>
          </div>
          <button onClick={() => navigate('/notifications')} className="relative p-2">
            <Bell className="h-6 w-6 text-foreground" />
            {unreadCount() > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                {unreadCount()}
              </span>
            )}
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 rounded-xl bg-background border border-border px-3 py-3">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products, brands..." className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" />
        </div>
      </div>

      {/* Search results overlay */}
      {searchQuery.trim() && (
        <div className="px-4 pt-3">
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {searchResults.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="flex flex-col items-center py-16">
              <Search className="h-12 w-12 text-muted-foreground/30 mb-2" />
              <p className="text-muted-foreground">No products found</p>
            </div>
          )}
        </div>
      )}

      {!searchQuery.trim() && (
        <div className="px-4 pt-4 space-y-6">
          {/* Free delivery banner */}
          <div className="flex items-center gap-3 rounded-xl bg-primary/5 border border-primary/20 px-4 py-3">
            <Truck className="h-5 w-5 text-primary flex-shrink-0" />
            <p className="text-sm font-medium text-primary">Free delivery on orders above Rs.{deliverySettings.freeDeliveryAbove}</p>
          </div>

          <BannerCarousel />

          {/* Categories */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-foreground">Categories</h2>
              <button onClick={() => navigate('/products')} className="flex items-center gap-0.5 text-sm font-medium text-primary">
                See all <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {mainCategories.map((cat) => (
                <button key={cat.id} onClick={() => navigate(`/category/${cat.id}`)}
                  className="flex flex-col items-center gap-2 rounded-xl bg-card border border-border p-3 transition-all active:scale-95 hover:shadow-md">
                  <div className="h-16 w-16 rounded-full overflow-hidden bg-secondary">
                    <img src={cat.image} alt={cat.name} className="h-full w-full object-cover" loading="lazy" />
                  </div>
                  <span className="text-xs font-semibold text-foreground">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Buy Again */}
          {buyAgainProducts.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-foreground mb-3">Buy Again</h2>
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                {buyAgainProducts.map((p) => (
                  <div key={p.id} className="min-w-[150px] max-w-[150px]">
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Popular products */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-foreground">Popular Products</h2>
              <button onClick={() => navigate('/products')} className="flex items-center gap-0.5 text-sm font-medium text-primary">
                See all <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {products.slice(0, 6).map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </div>
      )}

      <CartBar />
      <BottomNav />
    </div>
  );
};

export default Home;
