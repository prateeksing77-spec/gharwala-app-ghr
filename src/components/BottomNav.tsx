import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, ShoppingCart, ClipboardList } from 'lucide-react';
import { useAppStore } from '@/stores/cartStore';

const tabs = [
  { path: '/home', icon: Home, label: 'Home' },
  { path: '/products', icon: ShoppingBag, label: 'Products' },
  { path: '/cart', icon: ShoppingCart, label: 'Cart' },
  { path: '/orders', icon: ClipboardList, label: 'Orders' },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const cartCount = useAppStore((s) => s.getCartCount());

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card">
      <div className="mx-auto flex max-w-lg items-center justify-around py-2">
        {tabs.map((tab) => {
          const active = pathname === tab.path || (tab.path === '/products' && pathname.startsWith('/category'));
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`relative flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors ${active ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <tab.icon className="h-5 w-5" />
              {tab.label === 'Cart' && cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {cartCount}
                </span>
              )}
              <span className={`text-[11px] ${active ? 'font-semibold' : 'font-medium'}`}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
