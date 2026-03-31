import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { categories, categorySections } from '@/data/categories';
import { products } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import CartBar from '@/components/CartBar';
import BottomNav from '@/components/BottomNav';

const Products = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'default' | 'low' | 'high'>('default');
  const [showSort, setShowSort] = useState(false);

  // Only grocery-related categories
  const groceryCategories = categories.filter((c) =>
    ['grocery', 'snacks', 'local'].includes(c.section)
  );

  const filteredProducts = useMemo(() => {
    let items = products.filter((p) => {
      const cat = categories.find((c) => c.id === p.category);
      return cat && ['grocery', 'snacks', 'local'].includes(cat.section);
    });

    if (activeCategory !== 'all') {
      items = items.filter((p) => p.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.nameHindi && p.nameHindi.toLowerCase().includes(q))
      );
    }

    if (sortBy === 'low') items.sort((a, b) => a.price - b.price);
    if (sortBy === 'high') items.sort((a, b) => b.price - a.price);

    return items;
  }, [activeCategory, searchQuery, sortBy]);

  const categoryChips = [
    { id: 'all', name: 'All' },
    ...groceryCategories.map((c) => ({ id: c.id, name: c.name })),
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-card border-b border-border px-4 pt-3 pb-2">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-foreground">Products</h1>
          <button onClick={() => setShowSort(!showSort)} className="rounded-lg border border-border p-2">
            <SlidersHorizontal className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 rounded-xl bg-background border border-border px-3 py-3 mb-3">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, brand, category..." className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" />
        </div>

        {showSort && (
          <div className="flex gap-2 mb-2">
            {([['default', 'Relevant'], ['low', 'Price: Low'], ['high', 'Price: High']] as const).map(([key, label]) => (
              <button key={key} onClick={() => { setSortBy(key as typeof sortBy); setShowSort(false); }}
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${sortBy === key ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {categoryChips.slice(0, 10).map((c) => (
            <button key={c.id} onClick={() => setActiveCategory(c.id)}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                activeCategory === c.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
              }`}>
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products grid */}
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

      <CartBar />
      <BottomNav />
    </div>
  );
};

export default Products;
