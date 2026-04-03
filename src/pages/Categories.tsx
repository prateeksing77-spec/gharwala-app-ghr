import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import BottomNav from "@/components/BottomNav";

const Categories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    supabase
      .from("categories")
      .select("*")
      .order("sort_order")
      .then(({ data }) => {
        setCategories(data || []);
        setLoading(false);
      });
  }, []);

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-[70px]">
      <div className="sticky top-0 z-30 bg-background border-b border-border px-4 py-3">
        <h1 className="text-lg font-bold text-foreground">Categories</h1>
      </div>

      <div className="px-4 pt-4 space-y-4">
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4" style={{ height: 42 }}>
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((cat, i) => (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(`/category/${cat.id}`)}
                className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card p-5 hover:border-primary/40 transition-all"
              >
                <span className="text-3xl">🛒</span>
                <span className="text-sm font-medium text-foreground text-center">{cat.name}</span>
              </motion.button>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground text-sm">
            No categories found
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Categories;
