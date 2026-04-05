import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Star, Minus, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAppStore } from "@/stores/cartStore";

interface ProductDetailSheetProps {
  product: any;
  open: boolean;
  onClose: () => void;
}

const ProductDetailSheet = ({ product, open, onClose }: ProductDetailSheetProps) => {
  const { cart, addToCart, updateQuantity } = useAppStore();
  const [similar, setSimilar] = useState<any[]>([]);
  const [descOpen, setDescOpen] = useState(false);
  const [liked, setLiked] = useState(false);

  const cartItem = cart.find((i) => i.product.id === product?.id);
  const quantity = cartItem?.quantity || 0;

  const discount =
    product?.mrp && product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  const pricePerUnit = product?.weight
    ? (() => {
        const match = product.weight.match(/(\d+)\s*(g|kg|ml|l)/i);
        if (!match) return null;
        const val = parseFloat(match[1]);
        const unit = match[2].toLowerCase();
        if (unit === "kg") return `₹${(product.price / (val * 10)).toFixed(1)}/100 g`;
        if (unit === "g") return `₹${((product.price / val) * 100).toFixed(1)}/100 g`;
        if (unit === "l") return `₹${(product.price / (val * 10)).toFixed(1)}/100 ml`;
        if (unit === "ml") return `₹${((product.price / val) * 100).toFixed(1)}/100 ml`;
        return null;
      })()
    : null;

  useEffect(() => {
    if (product?.category_id) {
      supabase
        .from("products")
        .select("*")
        .eq("category_id", product.category_id)
        .neq("id", product.id)
        .limit(6)
        .then(({ data }) => setSimilar(data || []));
    }
  }, [product]);

  const handleAdd = () => {
    if (!product) return;
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

  if (!product) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-w-[480px] mx-auto bg-background rounded-t-2xl max-h-[85vh] overflow-y-auto"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="h-1 w-10 rounded-full bg-muted-foreground/30" />
            </div>

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur flex items-center justify-center border border-border"
            >
              <X className="h-4 w-4 text-foreground" />
            </button>

            {/* Image */}
            <div className="relative h-56 bg-accent flex items-center justify-center mx-4 rounded-xl overflow-hidden">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <span className="text-6xl">🛒</span>
              )}
              <button
                onClick={() => setLiked(!liked)}
                className="absolute top-3 right-3 h-8 w-8 rounded-full bg-background/80 flex items-center justify-center"
              >
                <motion.div animate={liked ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.3 }}>
                  <Heart className={`h-4 w-4 ${liked ? "fill-destructive text-destructive" : "text-muted-foreground"}`} />
                </motion.div>
              </button>
              {discount > 0 && (
                <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded">
                  {discount}% OFF
                </span>
              )}
            </div>

            <div className="p-4 space-y-3">
              {/* Brand & Name */}
              <div>
                {product.brand && (
                  <p className="text-xs text-muted-foreground">{product.brand}</p>
                )}
                <h2 className="text-lg font-bold text-foreground">{product.name}</h2>
                <p className="text-sm text-muted-foreground">{product.unit || product.weight}</p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium text-foreground">4.2</span>
                <span className="text-xs text-muted-foreground">(1,204)</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-foreground">₹{product.price}</span>
                {product.mrp && product.mrp > product.price && (
                  <span className="text-sm text-muted-foreground line-through">MRP ₹{product.mrp}</span>
                )}
                {discount > 0 && (
                  <span className="text-xs font-bold text-primary">{discount}% OFF</span>
                )}
              </div>
              {pricePerUnit && (
                <p className="text-xs text-muted-foreground">{pricePerUnit}</p>
              )}

              {/* Veg indicator */}
              {product.is_veg !== null && (
                <div className="flex items-center gap-1.5">
                  <span
                    className={`h-4 w-4 rounded-sm border-2 flex items-center justify-center ${
                      product.is_veg ? "border-green-500" : "border-red-500"
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${product.is_veg ? "bg-green-500" : "bg-red-500"}`} />
                  </span>
                  <span className="text-xs text-muted-foreground">{product.is_veg ? "Veg" : "Non-Veg"}</span>
                </div>
              )}

              {/* Stock warning */}
              {product.stock_count !== null && product.stock_count < 10 && product.in_stock && (
                <p className="text-xs font-medium text-orange-500">Only {product.stock_count} left!</p>
              )}

              {/* Add to Cart */}
              <div className="pt-2">
                {!product.in_stock ? (
                  <div className="w-full py-3 rounded-xl bg-muted text-center text-sm font-semibold text-muted-foreground">
                    Out of Stock
                  </div>
                ) : quantity === 0 ? (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleAdd}
                    className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold"
                  >
                    Add to Cart — ₹{product.price}
                  </motion.button>
                ) : (
                  <div className="flex items-center justify-center gap-4 py-2">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="h-10 w-10 rounded-xl border border-border flex items-center justify-center"
                    >
                      <Minus className="h-4 w-4 text-foreground" />
                    </button>
                    <span className="text-lg font-bold text-foreground w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center"
                    >
                      <Plus className="h-4 w-4 text-primary-foreground" />
                    </button>
                  </div>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <button
                  onClick={() => setDescOpen(!descOpen)}
                  className="w-full flex items-center justify-between py-2 border-t border-border"
                >
                  <span className="text-sm font-medium text-foreground">Product Details</span>
                  {descOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </button>
              )}
              <AnimatePresence>
                {descOpen && product.description && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="text-sm text-muted-foreground pb-2">{product.description}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Similar Products */}
              {similar.length > 0 && (
                <div className="pt-2 border-t border-border">
                  <h3 className="text-sm font-bold text-foreground mb-3">Similar Products</h3>
                  <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                    {similar.map((p) => (
                      <div key={p.id} className="min-w-[120px] max-w-[120px] flex-shrink-0 rounded-xl border border-border bg-card overflow-hidden">
                        <div className="h-20 bg-accent flex items-center justify-center">
                          {p.image_url ? (
                            <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-2xl">🛒</span>
                          )}
                        </div>
                        <div className="p-2">
                          <p className="text-[11px] font-medium text-foreground line-clamp-2 leading-tight">{p.name}</p>
                          <p className="text-xs font-bold text-foreground mt-1">₹{p.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="h-4" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProductDetailSheet;
