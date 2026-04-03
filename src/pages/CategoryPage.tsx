import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/ProductCard";
import BottomNav from "@/components/BottomNav";

const CategoryPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      if (slug) {
        const { data: cat } = await supabase.from("categories").select("*").eq("id", slug).single();
        setCategory(cat);
        const { data } = await supabase.from("products").select("*").eq("category_id", slug).order("sort_order");
        setProducts(data || []);
      }
      setLoading(false);
    };
    load();
  }, [slug]);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-[70px]">
      <div className="sticky top-0 z-30 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">{category?.name || "Category"}</h1>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4" style={{ height: 42 }}>
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search in this category..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 gap-3"
          >
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16 text-muted-foreground text-sm">No products found</div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default CategoryPage;
