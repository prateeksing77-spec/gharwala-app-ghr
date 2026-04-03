import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, MapPin, Bell, Truck, Sun, Moon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/ProductCard";
import BottomNav from "@/components/BottomNav";
import { useTheme } from "@/components/ThemeProvider";

const Home = () => {
  const navigate = useNavigate();
  const area = localStorage.getItem("kiraney-area") || "Select Area";
  const { theme, toggleTheme } = useTheme();
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from("categories").select("*").order("sort_order"),
      supabase.from("products").select("*").eq("in_stock", true).order("sort_order").limit(10),
    ]).then(([catRes, prodRes]) => {
      setCategories(catRes.data || []);
      setProducts(prodRes.data || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background pb-[70px]">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Deliver to</p>
              <button
                onClick={() => navigate("/select-area")}
                className="text-sm font-semibold text-foreground"
              >
                {area} ▾
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-accent transition-colors">
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-foreground" />
              ) : (
                <Moon className="h-5 w-5 text-foreground" />
              )}
            </button>
            <button className="p-2 rounded-lg hover:bg-accent transition-colors">
              <Bell className="h-5 w-5 text-foreground" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-5">
        {/* Search */}
        <button
          onClick={() => navigate("/categories")}
          className="flex items-center gap-3 w-full rounded-xl border border-border bg-card px-4"
          style={{ height: 46 }}
        >
          <Search className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Search for atta, dal, milk...</span>
        </button>

        {/* Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[14px] p-5 flex flex-col justify-center"
          style={{
            height: 140,
            background: "linear-gradient(135deg, hsl(142,71%,45%), hsl(142,60%,55%))",
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <Truck className="h-5 w-5 text-white" />
            <span className="text-white/80 text-xs font-medium">FREE DELIVERY</span>
          </div>
          <h2 className="text-xl font-bold text-white">Free Delivery above ₹399! 🛵</h2>
          <p className="text-white/80 text-[13px] mt-1">Order now & save more</p>
        </motion.div>

        {/* Categories */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-foreground">Shop by Category</h3>
            <button onClick={() => navigate("/categories")} className="text-xs text-primary font-medium">
              See All
            </button>
          </div>
          {loading ? (
            <div className="flex gap-3 overflow-x-auto scrollbar-hide">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <Skeleton className="h-3 w-12" />
                </div>
              ))}
            </div>
          ) : categories.length > 0 ? (
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
              {categories.map((cat, i) => (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => navigate(`/category/${cat.id}`)}
                  className="flex flex-col items-center gap-2 min-w-[72px]"
                >
                  <div className="h-16 w-16 rounded-full bg-accent flex items-center justify-center text-2xl border border-border">
                    🛒
                  </div>
                  <span className="text-xs text-foreground font-medium text-center leading-tight line-clamp-2">
                    {cat.name}
                  </span>
                </motion.button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">Categories coming soon!</p>
          )}
        </div>

        {/* Products */}
        <div>
          <h3 className="text-base font-bold text-foreground mb-3">Popular Products</h3>
          {loading ? (
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-xl" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground text-sm">
              Products coming soon! 🚀
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Home;
