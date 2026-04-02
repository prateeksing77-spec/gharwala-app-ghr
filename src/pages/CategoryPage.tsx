import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { products, categories } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import BottomNav from '@/components/BottomNav';

const CategoryPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(() => {
    if (!slug || slug === 'all') return 'All';
    const found = categories.find((c) => c.toLowerCase().replace(/ /g, '-') === slug);
    return found || 'All';
  });

  const filteredProducts = useMemo(() => {
    let items = [...products];
    if (activeCategory !== 'All') {
      items = items.filter((p) => p.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    return items;
  }, [activeCategory, searchQuery]);

  const chips = ['All', ...categories];

  return (
    <div className="min-h-screen bg-background pb-[70px]">
      <div className="sticky top-0 z-30 bg-card border-b border-border px-4 pt-3 pb-2">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5 text-foreground" /></button>
          <h1 className="text-xl font-bold text-foreground">
            {activeCategory === 'All' ? 'All Products' : activeCategory}
          </h1>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-muted px-3 py-3 mb-3">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" />
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {chips.map((c) => (
            <button key={c} onClick={() => setActiveCategory(c)}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                activeCategory === c ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-3">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="flex flex-col items-center py-20">
            <Search className="h-12 w-12 text-muted-foreground/30 mb-2" />
            <p className="text-muted-foreground">No products found</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default CategoryPage;
