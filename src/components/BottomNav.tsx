import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Clock, LayoutGrid, ShoppingCart } from 'lucide-react';
import { useAppStore } from '@/stores/cartStore';

const tabs = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/orders', icon: Clock, label: 'Order Again' },
  { path: '/#categories', icon: LayoutGrid, label: 'Categories' },
  { path: '/cart', icon: ShoppingCart, label: 'Cart' },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const cartCount = useAppStore((s) => s.getCartCount());

  const handleClick = (tab: typeof tabs[0]) => {
    if (tab.path === '/#categories') {
      if (pathname !== '/') navigate('/');
      setTimeout(() => {
        document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      navigate(tab.path);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50" style={{ height: 60 }}>
      <div className="mx-auto max-w-[480px] h-full border-t bg-background" style={{ borderColor: '#1A2A3A' }}>
        <div className="flex items-center justify-around h-full">
          {tabs.map((tab) => {
            const active = tab.path === '/#categories'
              ? pathname === '/'
              : pathname === tab.path;
            const isCart = tab.label === 'Cart';
            return (
              <button
                key={tab.label}
                onClick={() => handleClick(tab)}
                className="relative flex flex-col items-center gap-0.5 px-3 py-1 transition-colors"
              >
                <tab.icon className="h-5 w-5" style={{ color: active ? '#FF6B35' : '#667788' }} />
                {isCart && cartCount > 0 && (
                  <span className="absolute -right-1 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                    {cartCount}
                  </span>
                )}
                <span className="font-medium" style={{ fontSize: 10, color: active ? '#FF6B35' : '#667788' }}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
