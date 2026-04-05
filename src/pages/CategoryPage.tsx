import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Search, Share2, Heart, Star, Minus, Plus, Clock, SlidersHorizontal, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppStore } from "@/stores/cartStore";
import ProductDetailSheet from "@/components/ProductDetailSheet";
import BottomNav from "@/components/BottomNav";

type SortOption = "default" | "price_low" | "price_high" | "discount";

const CATEGORY_EMOJIS: Record<string, string> = {
  "Fresh Vegetables": "🥬", "Fresh Fruits": "🍎", "Coriander & Others": "🌿",
  "Atta": "🌾", "Rice": "🍚", "Dal": "🫘", "Besan Sooji & Maida": "🫓",
  "Oil": "🫒", "Desi Ghee": "🧈", "Cow Ghee": "🧈", "Powdered Spices": "🌶️",
  "Salt Sugar & Jaggery": "🧂", "Whole Spices": "🫚",
  "Milk": "🥛", "Bread & Pav": "🍞", "Eggs": "🥚", "Curd & Yogurt": "🥛",
  "Cheese & Butter": "🧀", "Paneer & Tofu": "🧀",
  "Chips & Namkeen": "🍿", "Sweets & Chocolate": "🍫",
  "Cold Drinks & Juice": "🥤", "Tea Coffee & More": "☕",
  "Biscuits & Cookies": "🍪", "Soap & Shampoo": "🧴",
  "Cleaning & Detergent": "🧹", "Pooja Samagri": "🪔", "Stationery": "✏️",
  "Loose Dal": "🫘", "Loose Rice": "🍚", "Loose Masala": "🌶️", "Loose Atta & Besan": "🫓",
  "Vegetables & Fruits": "🥬", "Atta Rice & Dal": "🌾", "Oil Ghee & Masala": "🫒",
  "Dairy Bread & Eggs": "🥛",
};

const CategoryPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { cart, addToCart, updateQuantity } = useAppStore();

  const [category, setCategory] = useState<any>(null);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [activeSubCat, setActiveSubCat] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortOption>("default");
  const [showSort, setShowSort] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  // Determine if this is a mid-level category (has sub-categories) or a leaf
  useEffect(() => {
    const load = async () => {
      if (!slug) return;
      setLoading(true);

      // Get current category
      const { data: cat } = await supabase.from("categories").select("*").eq("id", slug).single();
      setCategory(cat);

      // Get children of this category
      const { data: children } = await supabase.from("categories").select("*").eq("parent_id", slug).order("sort_order");

      if (children && children.length > 0) {
        // This is a mid-level category — show sub-category sidebar
        setSubCategories(children);
        setActiveSubCat(children[0].id);

        // Load products for the first sub-category
        const { data: prods } = await supabase
          .from("products")
          .select("*")
          .eq("category_id", children[0].id)
          .order("sort_order");
        setProducts(prods || []);
      } else {
        // This is a leaf category or mid-level without children — load products directly
        setSubCategories([]);
        setActiveSubCat(null);
        const { data: prods } = await supabase
          .from("products")
          .select("*")
          .eq("category_id", slug)
          .order("sort_order");
        setProducts(prods || []);
      }
      setLoading(false);
    };
    load();
  }, [slug]);

  // Load products when sub-category changes
  const handleSubCatClick = async (subId: string) => {
    setActiveSubCat(subId);
    setLoading(true);
    const { data } = await supabase.from("products").select("*").eq("category_id", subId).order("sort_order");
    setProducts(data || []);
    setLoading(false);
  };

  // Sorted and filtered products
  const sortedProducts = useMemo(() => {
    const list = [...products];
    switch (sort) {
      case "price_low": return list.sort((a, b) => a.price - b.price);
      case "price_high": return list.sort((a, b) => b.price - a.price);
      case "discount": return list.sort((a, b) => {
        const dA = a.mrp ? ((a.mrp - a.price) / a.mrp) * 100 : 0;
        const dB = b.mrp ? ((b.mrp - b.price) / b.mrp) * 100 : 0;
        return dB - dA;
      });
      default: return list;
    }
  }, [products, sort]);

  // Get unique brands from products
  const brands = useMemo(() => {
    const set = new Set(products.map((p) => p.brand).filter(Boolean));
    return Array.from(set);
  }, [products]);

  const toggleLike = (id: string) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAdd = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      brand: product.brand || "",
      category: "",
      price: product.price,
      unit: product.unit || product.weight || "",
      image: product.image_url || "",
    });
  };

  const hasSidebar = subCategories.length > 0;

  return (
    <div className="min-h-screen bg-background pb-[70px]">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-background border-b border-border px-4 py-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </button>
            <h1 className="text-base font-bold text-foreground truncate max-w-[180px]">
              {category?.name || "Category"}
            </h1>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => navigate("/search")} className="p-2 rounded-lg hover:bg-accent">
              <Search className="h-5 w-5 text-foreground" />
            </button>
            <button className="p-2 rounded-lg hover:bg-accent">
              <Share2 className="h-5 w-5 text-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-[49px] z-20 bg-background border-b border-border px-4 py-2 flex items-center gap-2 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => setShowSort(!showSort)}
          className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground flex-shrink-0"
        >
          <SlidersHorizontal className="h-3 w-3" />
          Sort
          <ChevronDown className="h-3 w-3" />
        </button>
        {brands.slice(0, 5).map((brand) => (
          <button
            key={brand}
            className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground flex-shrink-0"
          >
            {brand}
          </button>
        ))}
      </div>

      {/* Sort Dropdown */}
      <AnimatePresence>
        {showSort && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute z-20 left-4 top-[100px] bg-card border border-border rounded-xl shadow-lg p-1 min-w-[180px]"
          >
            {([
              ["default", "Relevance"],
              ["price_low", "Price: Low to High"],
              ["price_high", "Price: High to Low"],
              ["discount", "Discount"],
            ] as [SortOption, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => { setSort(key); setShowSort(false); }}
                className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                  sort === key ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-accent"
                }`}
              >
                {label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`flex ${hasSidebar ? "" : "flex-col"}`}>
        {/* Left Sidebar */}
        {hasSidebar && (
          <div className="w-[22%] border-r border-border bg-card/50 sticky top-[89px] h-[calc(100vh-89px-70px)] overflow-y-auto scrollbar-hide">
            {subCategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => handleSubCatClick(sub.id)}
                className={`w-full flex flex-col items-center gap-1 py-3 px-1 text-center border-l-[3px] transition-all ${
                  activeSubCat === sub.id
                    ? "border-l-primary bg-background"
                    : "border-l-transparent hover:bg-accent/50"
                }`}
              >
                <span className="text-xl">{CATEGORY_EMOJIS[sub.name] || "🛒"}</span>
                <span
                  className={`text-[10px] leading-tight line-clamp-2 ${
                    activeSubCat === sub.id ? "font-bold text-primary" : "text-muted-foreground font-medium"
                  }`}
                >
                  {sub.name}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Right Content - Product Grid */}
        <div className={`${hasSidebar ? "w-[78%]" : "w-full"} p-3`}>
          {loading ? (
            <div className="grid grid-cols-2 gap-2.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-xl" />
              ))}
            </div>
          ) : sortedProducts.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 gap-2.5"
            >
              {sortedProducts.map((product, i) => {
                const cartItem = cart.find((c) => c.product.id === product.id);
                const qty = cartItem?.quantity || 0;
                const discount = product.mrp && product.mrp > product.price
                  ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;
                const isLiked = likedIds.has(product.id);

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="rounded-xl border border-border bg-card overflow-hidden relative"
                  >
                    {/* Out of stock overlay */}
                    {!product.in_stock && (
                      <div className="absolute inset-0 z-10 bg-background/60 flex items-center justify-center rounded-xl">
                        <span className="text-xs font-bold text-muted-foreground bg-muted px-3 py-1 rounded-full">Out of Stock</span>
                      </div>
                    )}

                    {/* Image */}
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="relative w-full h-28 bg-accent flex items-center justify-center"
                    >
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-3xl">🛒</span>
                      )}
                      {/* Heart */}
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleLike(product.id); }}
                        className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-background/80 flex items-center justify-center"
                      >
                        <motion.div animate={isLiked ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.3 }}>
                          <Heart className={`h-3 w-3 ${isLiked ? "fill-destructive text-destructive" : "text-muted-foreground"}`} />
                        </motion.div>
                      </button>
                      {/* Veg/Non-veg */}
                      {product.is_veg !== null && (
                        <span className={`absolute top-1.5 left-1.5 h-4 w-4 rounded-sm border-2 flex items-center justify-center ${
                          product.is_veg ? "border-green-500" : "border-red-500"
                        }`}>
                          <span className={`h-2 w-2 rounded-full ${product.is_veg ? "bg-green-500" : "bg-red-500"}`} />
                        </span>
                      )}
                      {/* Discount badge */}
                      {discount > 0 && (
                        <span className="absolute bottom-1.5 left-1.5 bg-primary text-primary-foreground text-[9px] font-bold px-1.5 py-0.5 rounded">
                          {discount}% OFF
                        </span>
                      )}
                    </button>

                    {/* Details */}
                    <div className="p-2 space-y-0.5">
                      {/* Weight */}
                      {(product.unit || product.weight) && (
                        <span className="inline-block text-[10px] text-muted-foreground bg-accent/50 px-1.5 py-0.5 rounded">
                          {product.unit || product.weight}
                        </span>
                      )}
                      <p
                        onClick={() => setSelectedProduct(product)}
                        className="text-xs font-medium text-foreground line-clamp-2 leading-tight cursor-pointer"
                      >
                        {product.name}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center gap-0.5">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-[10px] text-muted-foreground">4.2</span>
                      </div>

                      {/* Delivery time */}
                      <div className="flex items-center gap-0.5">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground">30 MINS</span>
                      </div>

                      {/* Stock warning */}
                      {product.stock_count !== null && product.stock_count < 10 && product.in_stock && (
                        <p className="text-[10px] font-medium text-orange-500">Only {product.stock_count} left</p>
                      )}

                      {/* Price */}
                      <div className="flex items-center gap-1 pt-0.5">
                        <span className="text-sm font-bold text-foreground">₹{product.price}</span>
                        {product.mrp && product.mrp > product.price && (
                          <span className="text-[10px] text-muted-foreground line-through">₹{product.mrp}</span>
                        )}
                      </div>

                      {/* Add button */}
                      <div className="pt-1">
                        {product.in_stock === false ? null : qty === 0 ? (
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAdd(product)}
                            className="w-full rounded-lg bg-primary/10 border border-primary py-1.5 text-xs font-bold text-primary"
                          >
                            ADD
                          </motion.button>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => updateQuantity(product.id, qty - 1)}
                              className="h-7 w-7 rounded-md border border-border flex items-center justify-center"
                            >
                              <Minus className="h-3 w-3 text-foreground" />
                            </button>
                            <span className="text-xs font-bold text-foreground w-4 text-center">{qty}</span>
                            <button
                              onClick={() => updateQuantity(product.id, qty + 1)}
                              className="h-7 w-7 rounded-md bg-primary flex items-center justify-center"
                            >
                              <Plus className="h-3 w-3 text-primary-foreground" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <div className="text-center py-16">
              <span className="text-4xl block mb-3">📦</span>
              <p className="text-sm text-muted-foreground">No products found</p>
            </div>
          )}
        </div>
      </div>

      {/* Product Detail Sheet */}
      <ProductDetailSheet
        product={selectedProduct}
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <BottomNav />
    </div>
  );
};

export default CategoryPage;
