import { useNavigate, useLocation } from "react-router-dom";
import { Home, LayoutGrid, ShoppingCart, Clock, User } from "lucide-react";
import { useAppStore } from "@/stores/cartStore";
import { motion } from "framer-motion";

const tabs = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/categories", icon: LayoutGrid, label: "Categories" },
  { path: "/cart", icon: ShoppingCart, label: "Cart" },
  { path: "/orders", icon: Clock, label: "Orders" },
  { path: "/account", icon: User, label: "Account" },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const cartCount = useAppStore((s) => s.getCartCount());

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50" style={{ height: 60 }}>
      <div className="mx-auto max-w-[480px] h-full border-t border-border bg-background">
        <div className="flex items-center justify-around h-full">
          {tabs.map((tab) => {
            const active = pathname === tab.path;
            const isCart = tab.label === "Cart";
            return (
              <button
                key={tab.label}
                onClick={() => navigate(tab.path)}
                className="relative flex flex-col items-center gap-0.5 px-3 py-1 transition-colors"
              >
                <tab.icon
                  className="h-5 w-5 transition-colors"
                  style={{ color: active ? "hsl(142, 71%, 45%)" : "hsl(var(--muted-foreground))" }}
                />
                {isCart && cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-1 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-bold text-destructive-foreground"
                  >
                    {cartCount}
                  </motion.span>
                )}
                {active && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -top-px left-1/2 -translate-x-1/2 h-0.5 w-6 rounded-full bg-primary"
                  />
                )}
                <span
                  className="font-medium transition-colors"
                  style={{
                    fontSize: 10,
                    color: active ? "hsl(142, 71%, 45%)" : "hsl(var(--muted-foreground))",
                  }}
                >
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
