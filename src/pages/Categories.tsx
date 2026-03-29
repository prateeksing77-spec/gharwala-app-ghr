import { useNavigate } from 'react-router-dom';
import { categories, categorySections } from '@/data/categories';
import BottomNav from '@/components/BottomNav';
import CartBar from '@/components/CartBar';

const Categories = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm px-4 py-3">
        <h1 className="text-xl font-bold text-foreground">All Categories</h1>
      </div>

      <div className="px-4 space-y-6">
        {categorySections.map((section) => {
          const cats = categories.filter((c) => c.section === section.id);
          return (
            <div key={section.id}>
              <h2 className={`mb-3 text-base font-bold ${section.isGold ? 'text-accent' : 'text-foreground'}`}>
                {section.name}
              </h2>
              <div className="grid grid-cols-3 gap-2">
                {cats.map((cat) => (
                  <button key={cat.id} onClick={() => navigate(`/category/${cat.id}`)}
                    className={`rounded-lg p-3 text-center ${section.isGold ? 'border border-accent/30 bg-accent/5' : 'bg-surface'}`}>
                    <div className={`mx-auto mb-1.5 flex h-10 w-10 items-center justify-center rounded-full ${section.isGold ? 'bg-accent/20' : 'bg-primary/20'}`}>
                      <span className={section.isGold ? 'text-accent' : 'text-primary'}>{cat.name.charAt(0)}</span>
                    </div>
                    <span className="text-xs font-medium text-foreground">{cat.name}</span>
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
