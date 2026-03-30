import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, SlidersHorizontal, Search } from 'lucide-react';
import { categories } from '@/data/categories';
import { products } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import CartBar from '@/components/CartBar';
import BottomNav from '@/components/BottomNav';

const CategoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const category = categories.find((c) => c.id === id);
  const [activeSub, setActiveSub] = useState('All');
  const [sortBy, setSortBy] = useState<'default' | 'low' | 'high' | 'discount'>('default');
  const [showSort, setShowSort] = useState(false);

  const categoryProducts = useMemo(() => {
    let items = products.filter((p) => p.category === id);
    if (activeSub !== 'All') items = items.filter((p) => p.subcategory === activeSub);
    if (sortBy === 'low') items.sort((a, b) => a.price - b.price);
    if (sortBy === 'high') items.sort((a, b) => b.price - a.price);
    if (sortBy === 'discount') items.sort((a, b) => (b.mrp - b.price) / b.mrp - (a.mrp - a.price) / a.mrp);
    return items;
  }, [id, activeSub, sortBy]);

  if (!category) return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <Search className="h-16 w-16 text-muted-foreground/30 mb-3" />
      <p className="text-muted-foreground">Koi product nahi mila</p>
    </div>
  );

  const subcategories = ['All', ...category.subcategories];

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5 text-foreground" /></button>
            <h1 className="text-lg font-bold text-foreground">{category.name}</h1>
          </div>
          <button onClick={() => setShowSort(!showSort)} className="relative rounded-lg bg-card p-2">
            <SlidersHorizontal className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {showSort && (
          <div className="mt-2 flex gap-2 flex-wrap">
            {(['default', 'low', 'high', 'discount'] as const).map((s) => (
              <button key={s} onClick={() => { setSortBy(s); setShowSort(false); }}
                className={`rounded-full px-3 py-1 text-xs font-medium ${sortBy === s ? 'bg-accent text-accent-foreground' : 'bg-card text-muted-foreground'}`}>
                {s === 'default' ? 'Relevant' : s === 'low' ? 'Price: Low' : s === 'high' ? 'Price: High' : 'Discount'}
              </button>
            ))}
          </div>
        )}

        <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {subcategories.map((sub) => (
            <button key={sub} onClick={() => setActiveSub(sub)}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium ${activeSub === sub ? 'bg-accent text-accent-foreground' : 'bg-card text-muted-foreground'}`}>
              {sub}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 px-4 pt-3">
        {categoryProducts.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
      {categoryProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <Search className="h-16 w-16 text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground">Koi product nahi mila</p>
        </div>
      )}

      <CartBar />
      <BottomNav />
    </div>
  );
};

export default CategoryPage;
