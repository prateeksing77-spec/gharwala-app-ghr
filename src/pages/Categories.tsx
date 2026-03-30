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
          const isGold = section.isGold;
          return (
            <div key={section.id}>
              <div className="mb-3 flex items-center gap-2">
                {!isGold && <div className="h-5 w-[3px] rounded-full bg-accent" />}
                {isGold && <div className="h-5 w-[3px] rounded-full bg-[hsl(var(--accent-gold))]" />}
                <h2 className={`text-base font-bold ${isGold ? 'text-[hsl(var(--accent-gold))]' : 'text-foreground'}`}>
                  {section.name}
                </h2>
              </div>
              {isGold && <div className="mb-3 h-[1.5px] bg-gradient-to-r from-[hsl(var(--accent-gold))] to-transparent" />}
              <div className="grid grid-cols-3 gap-2">
                {cats.map((cat) => (
                  <button key={cat.id} onClick={() => navigate(`/category/${cat.id}`)}
                    className={`relative overflow-hidden rounded-xl aspect-square border transition-all active:scale-95 ${isGold ? 'border-[hsl(var(--accent-gold))]/40' : 'border-border'} hover:brightness-110`}>
                    <img src={cat.image || '/placeholder.svg'} alt={cat.name} className="h-full w-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <span className="absolute bottom-1.5 left-0 right-0 px-1 text-center text-[10px] font-semibold leading-tight text-white">{cat.name}</span>
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
