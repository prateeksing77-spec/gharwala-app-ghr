import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useAppStore } from "@/stores/cartStore";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    mrp?: number | null;
    unit?: string | null;
    weight?: string | null;
    brand?: string | null;
    image_url?: string | null;
    is_veg?: boolean | null;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { cart, addToCart, updateQuantity } = useAppStore();
  const cartItem = cart.find((i) => i.product.id === product.id);
  const quantity = cartItem?.quantity || 0;
  const discount = product.mrp && product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  const handleAdd = () => {
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

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className="rounded-xl border border-border bg-card overflow-hidden"
    >
      <div className="relative h-28 bg-accent flex items-center justify-center">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-4xl">🛒</span>
        )}
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded">
            {discount}% OFF
          </span>
        )}
        {product.is_veg !== null && (
          <span
            className={`absolute top-2 right-2 h-4 w-4 rounded-sm border-2 flex items-center justify-center ${
              product.is_veg ? "border-green-500" : "border-red-500"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${product.is_veg ? "bg-green-500" : "bg-red-500"}`}
            />
          </span>
        )}
      </div>

      <div className="p-2.5 space-y-1">
        <p className="text-xs text-muted-foreground">{product.brand}</p>
        <p className="text-sm font-medium text-foreground line-clamp-2 leading-tight">{product.name}</p>
        <p className="text-xs text-muted-foreground">{product.unit || product.weight}</p>

        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="text-sm font-bold text-foreground">₹{product.price}</span>
            {product.mrp && product.mrp > product.price && (
              <span className="text-xs text-muted-foreground line-through ml-1">₹{product.mrp}</span>
            )}
          </div>

          {quantity === 0 ? (
            <button
              onClick={handleAdd}
              className="rounded-lg bg-primary/10 border border-primary px-3 py-1 text-xs font-bold text-primary"
            >
              ADD
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => updateQuantity(product.id, quantity - 1)}
                className="h-6 w-6 rounded-md border border-border flex items-center justify-center"
              >
                <Minus className="h-3 w-3 text-foreground" />
              </button>
              <span className="text-xs font-bold text-foreground w-4 text-center">{quantity}</span>
              <button
                onClick={() => updateQuantity(product.id, quantity + 1)}
                className="h-6 w-6 rounded-md bg-primary flex items-center justify-center"
              >
                <Plus className="h-3 w-3 text-primary-foreground" />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
