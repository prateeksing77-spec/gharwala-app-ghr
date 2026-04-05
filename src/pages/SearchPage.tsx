import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Search, X, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/ProductCard";
import ProductDetailSheet from "@/components/ProductDetailSheet";

const STORAGE_KEY = "kiraney-recent-searches";

const SearchPage = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setRecentSearches(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timeout = setTimeout(async () => {
      setLoading(true);
      const { data } = await supabase
        .from("products")
        .select("*")
        .or(`name.ilike.%${query}%,brand.ilike.%${query}%`)
        .order("sort_order")
        .limit(30);
      setResults(data || []);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const saveSearch = (term: string) => {
    const updated = [term, ...recentSearches.filter((s) => s !== term)].slice(0, 8);
    setRecentSearches(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) saveSearch(query.trim());
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-background border-b border-border px-4 py-2.5">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <button type="button" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex-1 flex items-center gap-2 rounded-xl border border-border bg-card px-3" style={{ height: 40 }}>
            <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, brands..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")}>
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="px-4 pt-4">
        {/* Recent searches */}
        {!query.trim() && recentSearches.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Recent Searches</h3>
              <button onClick={clearRecent} className="text-xs text-primary font-medium">Clear All</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((term, i) => (
                <motion.button
                  key={term}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => { setQuery(term); saveSearch(term); }}
                  className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5"
                >
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-foreground">{term}</span>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-2 gap-3 mt-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-56 rounded-xl" />
            ))}
          </div>
        )}

        {/* Results */}
        {!loading && query.trim() && results.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-3">{results.length} results for "{query}"</p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 gap-3 pb-8"
            >
              {results.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => setSelectedProduct(product)}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}

        {/* No results */}
        {!loading && query.trim() && results.length === 0 && (
          <div className="text-center py-20">
            <span className="text-5xl block mb-4">🔍</span>
            <p className="text-sm font-medium text-foreground">No products found</p>
            <p className="text-xs text-muted-foreground mt-1">Try a different search term</p>
          </div>
        )}

        {/* Empty state */}
        {!query.trim() && recentSearches.length === 0 && (
          <div className="text-center py-20">
            <span className="text-5xl block mb-4">🔍</span>
            <p className="text-sm text-muted-foreground">Search for groceries, brands, categories...</p>
          </div>
        )}
      </div>

      <ProductDetailSheet
        product={selectedProduct}
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};

export default SearchPage;
