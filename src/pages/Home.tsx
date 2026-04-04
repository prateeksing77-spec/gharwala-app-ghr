import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Search, MapPin, Bell, Sun, Moon, Mic, Bike, ChevronRight, Heart, ShoppingBag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/ProductCard";
import BottomNav from "@/components/BottomNav";
import { useTheme } from "@/components/ThemeProvider";
import { useAppStore } from "@/stores/cartStore";

const SEARCH_PLACEHOLDERS = ["Search atta...", "Search dal...", "Search sabzi...", "Search milk...", "Search paneer..."];

const PROMO_BANNERS = [
  { title: "Free Delivery on ₹299+", subtitle: "No minimum order hassle", gradient: "linear-gradient(135deg, hsl(142,71%,45%), hsl(142,50%,35%))" },
  { title: "Fresh Vegetables Daily 🥬", subtitle: "Farm to your doorstep", gradient: "linear-gradient(135deg, hsl(25,95%,53%), hsl(15,90%,45%))" },
  { title: "Loose Items at Best Prices", subtitle: "Save more, waste less", gradient: "linear-gradient(135deg, hsl(262,80%,50%), hsl(280,70%,40%))" },
];

const CATEGORY_EMOJIS: Record<string, string> = {
  "Vegetables & Fruits": "🥬",
  "Atta Rice & Dal": "🌾",
  "Oil Ghee & Masala": "🫒",
  "Dairy Bread & Eggs": "🥛",
  "Chips & Namkeen": "🍿",
  "Sweets & Chocolate": "🍫",
  "Cold Drinks & Juice": "🥤",
  "Tea Coffee & More": "☕",
  "Biscuits & Cookies": "🍪",
  "Soap & Shampoo": "🧴",
  "Cleaning & Detergent": "🧹",
  "Pooja Samagri": "🪔",
  "Stationery": "✏️",
  "Loose Dal": "🫘",
  "Loose Rice": "🍚",
  "Loose Masala": "🌶️",
  "Loose Atta & Besan": "🫓",
};

const TOP_GROUP_IDS: Record<string, string> = {
  "Grocery & Kitchen": "a0000000-0000-0000-0000-000000000001",
  "Snacks & Drinks": "a0000000-0000-0000-0000-000000000002",
  "Household": "a0000000-0000-0000-0000-000000000003",
  "Loose Items": "a0000000-0000-0000-0000-000000000004",
};

const Home = () => {
  const navigate = useNavigate();
  const area = localStorage.getItem("kiraney-area") || "Select Area";
  const { theme, toggleTheme } = useTheme();
  const { getCartCount } = useAppStore();
  const [categories, setCategories] = useState<any[]>([]);
  const [topDeals, setTopDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchPlaceholder, setSearchPlaceholder] = useState(0);
  const [promoIndex, setPromoIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const pullStartY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Rotating search placeholder
  useEffect(() => {
    const interval = setInterval(() => {
      setSearchPlaceholder((p) => (p + 1) % SEARCH_PLACEHOLDERS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Auto-slide promo banners
  useEffect(() => {
    const interval = setInterval(() => {
      setPromoIndex((p) => (p + 1) % PROMO_BANNERS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [catRes, dealsRes] = await Promise.all([
      supabase.from("categories").select("*").order("sort_order"),
      supabase.from("products").select("*").eq("in_stock", true).not("mrp", "is", null).order("sort_order").limit(20),
    ]);

    setCategories(catRes.data || []);

    // Calculate deals - products with highest discount %
    const products = (dealsRes.data || [])
      .filter((p: any) => p.mrp && p.mrp > p.price)
      .sort((a: any, b: any) => {
        const discA = ((a.mrp - a.price) / a.mrp) * 100;
        const discB = ((b.mrp - b.price) / b.mrp) * 100;
        return discB - discA;
      })
      .slice(0, 10);
    setTopDeals(products);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Pull to refresh
  const handleTouchStart = (e: React.TouchEvent) => {
    if (containerRef.current && containerRef.current.scrollTop === 0) {
      pullStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = async (e: React.TouchEvent) => {
    const diff = e.changedTouches[0].clientY - pullStartY.current;
    if (diff > 80 && containerRef.current?.scrollTop === 0) {
      setRefreshing(true);
      await fetchData();
      setTimeout(() => setRefreshing(false), 500);
    }
  };

  // Group categories by parent
  const topGroups = categories.filter((c) => !c.parent_id);
  const getChildren = (parentId: string) => categories.filter((c) => c.parent_id === parentId);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-background pb-[70px] overflow-y-auto"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull to refresh indicator */}
      <AnimatePresence>
        {refreshing && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 48, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex items-center justify-center bg-primary/10"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full"
            />
            <span className="ml-2 text-xs text-primary font-medium">Refreshing...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border px-4 py-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <ShoppingBag className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-base font-bold text-foreground leading-none">Kiraney</h1>
              <button
                onClick={() => navigate("/select-area")}
                className="flex items-center gap-1 mt-0.5"
              >
                <MapPin className="h-3 w-3 text-primary" />
                <span className="text-[11px] text-muted-foreground">{area}</span>
                <span className="text-[10px] text-muted-foreground">▾</span>
              </button>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-accent transition-colors">
              {theme === "dark" ? <Sun className="h-5 w-5 text-foreground" /> : <Moon className="h-5 w-5 text-foreground" />}
            </button>
            <button className="p-2 rounded-lg hover:bg-accent transition-colors relative">
              <Bell className="h-5 w-5 text-foreground" />
              <span className="absolute top-1 right-1 h-4 w-4 bg-destructive rounded-full text-[9px] text-white font-bold flex items-center justify-center">
                2
              </span>
            </button>
            <button
              onClick={() => navigate("/account")}
              className="h-8 w-8 rounded-full bg-accent border border-border flex items-center justify-center ml-1"
            >
              <span className="text-xs font-bold text-foreground">U</span>
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 pt-3 space-y-4">
        {/* Search Bar */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/categories")}
          className="flex items-center gap-3 w-full rounded-xl border border-border bg-card px-4 shadow-sm"
          style={{ height: 46 }}
        >
          <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <div className="flex-1 text-left overflow-hidden h-5">
            <AnimatePresence mode="wait">
              <motion.span
                key={searchPlaceholder}
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -12, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="block text-sm text-muted-foreground"
              >
                {SEARCH_PLACEHOLDERS[searchPlaceholder]}
              </motion.span>
            </AnimatePresence>
          </div>
          <Mic className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </motion.button>

        {/* Delivery Banner */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-primary/10 border border-primary/20 px-4 py-3 flex items-center gap-3"
        >
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Bike className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">Delivery in 30-45 mins</p>
            <p className="text-[11px] text-muted-foreground">Fresh groceries at your doorstep</p>
          </div>
          <div className="flex gap-0.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.3 }}
                className="h-1.5 w-1.5 rounded-full bg-primary"
              />
            ))}
          </div>
        </motion.div>

        {/* Promo Banner Carousel */}
        <div className="relative overflow-hidden rounded-[14px]" style={{ height: 130 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={promoIndex}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="absolute inset-0 rounded-[14px] p-5 flex flex-col justify-center"
              style={{ background: PROMO_BANNERS[promoIndex].gradient }}
            >
              <h2 className="text-lg font-bold text-white">{PROMO_BANNERS[promoIndex].title}</h2>
              <p className="text-white/80 text-[13px] mt-1">{PROMO_BANNERS[promoIndex].subtitle}</p>
              <button className="mt-3 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-4 py-1.5 rounded-lg self-start">
                Shop Now
              </button>
            </motion.div>
          </AnimatePresence>
          {/* Dot indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {PROMO_BANNERS.map((_, i) => (
              <button
                key={i}
                onClick={() => setPromoIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === promoIndex ? "w-5 bg-white" : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Category Grids grouped by top-level */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((g) => (
              <div key={g}>
                <Skeleton className="h-5 w-32 mb-3" />
                <div className="grid grid-cols-4 gap-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <Skeleton className="h-16 w-16 rounded-full" />
                      <Skeleton className="h-3 w-14" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          topGroups
            .filter((g) => Object.values(TOP_GROUP_IDS).includes(g.id))
            .map((group) => {
              const children = getChildren(group.id);
              if (children.length === 0) return null;
              return (
                <div key={group.id}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[15px] font-bold text-foreground">{group.name}</h3>
                    <button
                      onClick={() => navigate(`/category/${group.id}`)}
                      className="flex items-center gap-0.5 text-xs text-primary font-medium"
                    >
                      See All <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-y-4 gap-x-2">
                    {children.map((cat: any, i: number) => (
                      <motion.button
                        key={cat.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.04 }}
                        whileTap={{ scale: 1.08 }}
                        onClick={() => navigate(`/category/${cat.id}`)}
                        className="flex flex-col items-center gap-1.5"
                      >
                        <div className="h-[60px] w-[60px] rounded-full bg-accent/80 flex items-center justify-center text-2xl border border-border shadow-sm">
                          {CATEGORY_EMOJIS[cat.name] || "🛒"}
                        </div>
                        <span className="text-[11px] text-foreground font-medium text-center leading-tight line-clamp-2 w-[68px]">
                          {cat.name}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              );
            })
        )}

        {/* Top Deals */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[15px] font-bold text-foreground">🔥 Top Deals</h3>
            <button className="text-xs text-primary font-medium flex items-center gap-0.5">
              View All <ChevronRight className="h-3 w-3" />
            </button>
          </div>
          {loading ? (
            <div className="flex gap-3 overflow-x-auto scrollbar-hide">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-52 w-36 rounded-xl flex-shrink-0" />
              ))}
            </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4">
              {topDeals.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="min-w-[148px] max-w-[148px] flex-shrink-0"
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Bought Earlier - Placeholder */}
        <div className="pb-4">
          <h3 className="text-[15px] font-bold text-foreground mb-3">🕐 Bought Earlier</h3>
          <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-center">
            <p className="text-sm text-muted-foreground">Your recently ordered items will appear here</p>
            <p className="text-xs text-muted-foreground mt-1">Start shopping to build your history!</p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Home;
