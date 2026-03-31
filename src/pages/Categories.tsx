import { useNavigate } from 'react-router-dom';
import { categories, categorySections } from '@/data/categories';
import BottomNav from '@/components/BottomNav';
import CartBar from '@/components/CartBar';

const Categories = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-30 bg-card border-b border-border px-4 py-3">
        <h1 className="text-xl font-bold text-foreground">All Categories</h1>
      </div>

      <div className="px-4 pt-3 space-y-6">
        {categorySections.map((section) => {
          const cats = categories.filter((c) => c.section === section.id);
          return (
            <div key={section.id}>
              <h2 className="text-base font-bold text-foreground mb-3">{section.name}</h2>
              <div className="grid grid-cols-3 gap-3">
                {cats.map((cat) => (
                  <button key={cat.id} onClick={() => navigate(`/category/${cat.id}`)}
                    className="flex flex-col items-center gap-2 rounded-xl bg-card border border-border p-3 transition-all active:scale-95">
                    <div className="h-14 w-14 rounded-full overflow-hidden bg-secondary">
                      <img src={cat.image || '/placeholder.svg'} alt={cat.name} className="h-full w-full object-cover" loading="lazy" />
                    </div>
                    <span className="text-[10px] font-semibold text-foreground text-center leading-tight">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <CartBar />
      <BottomNav />
    </div>
  );
};

export default Categories;
