import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, Tag, Clock, MapPin, ChevronRight, Truck } from "lucide-react";
import { useAppStore } from "@/stores/cartStore";
import BottomNav from "@/components/BottomNav";
import { toast } from "sonner";

const MIN_ORDER = 99;

const SwipeableCartItem = ({
  item,
  onUpdateQty,
  onRemove,
}: {
  item: { product: any; quantity: number };
  onUpdateQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}) => {
  const x = useMotionValue(0);
  const bg = useTransform(x, [-120, 0], ["hsl(0,72%,51%)", "transparent"]);
  const opacity = useTransform(x, [-120, -60, 0], [1, 0.5, 0]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x < -100) {
      onRemove(item.product.id);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Delete bg */}
      <motion.div
        className="absolute inset-0 flex items-center justify-end pr-4 rounded-xl"
        style={{ backgroundColor: bg }}
      >
        <motion.div style={{ opacity }}>
          <Trash2 className="h-5 w-5 text-destructive-foreground" />
        </motion.div>
      </motion.div>

      <motion.div
        drag="x"
        dragConstraints={{ left: -120, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 relative z-10"
      >
        <div className="h-14 w-14 rounded-lg bg-accent flex items-center justify-center text-xl shrink-0 overflow-hidden">
          {item.product.image_url ? (
            <img src={item.product.image_url} alt={item.product.name} className="h-full w-full object-cover" />
          ) : (
            "🛒"
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{item.product.name}</p>
          <p className="text-xs text-muted-foreground">{item.product.weight || item.product.unit}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-sm font-bold text-primary">₹{item.product.price}</span>
            {item.product.mrp && item.product.mrp > item.product.price && (
              <span className="text-xs text-muted-foreground line-through">₹{item.product.mrp}</span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className="text-xs font-semibold text-foreground">₹{item.product.price * item.quantity}</span>
          <div className="flex items-center gap-0">
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => onUpdateQty(item.product.id, item.quantity - 1)}
              className="h-7 w-7 rounded-l-lg border border-border flex items-center justify-center bg-muted"
            >
              <Minus className="h-3 w-3 text-foreground" />
            </motion.button>
            <span className="text-xs font-bold text-foreground w-7 h-7 flex items-center justify-center border-y border-border bg-card">
              {item.quantity}
            </span>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => {
                if (item.quantity >= 10) {
                  toast.error("Maximum 10 items allowed");
                  return;
                }
                onUpdateQty(item.product.id, item.quantity + 1);
              }}
              className="h-7 w-7 rounded-r-lg border border-border flex items-center justify-center bg-primary"
            >
              <Plus className="h-3 w-3 text-primary-foreground" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Cart = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, getCartTotal, clearCart, getCartCount } = useAppStore();
  const [coupon, setCoupon] = useState("");
  const [showCoupon, setShowCoupon] = useState(false);

  const subtotal = getCartTotal();
  const deliveryCharge = subtotal >= 299 ? 0 : 20;
  const handlingCharge = 5;
  const total = subtotal + deliveryCharge + handlingCharge;
  const cartCount = getCartCount();
  const area = localStorage.getItem("kiraney-area") || "Select area";

  // Calculate MRP savings
  const mrpTotal = cart.reduce((sum, i) => {
    const mrp = i.product.mrp && i.product.mrp > i.product.price ? i.product.mrp : i.product.price;
    return sum + mrp * i.quantity;
  }, 0);
  const savings = mrpTotal - subtotal;

  const canCheckout = subtotal >= MIN_ORDER;

  const handleRemove = (id: string) => {
    removeFromCart(id);
    toast.success("Item removed");
  };

  const handleClearCart = () => {
    clearCart();
    toast.success("Cart cleared");
  };

  const handleApplyCoupon = () => {
    toast("No coupons available right now", { icon: "🎫" });
    setCoupon("");
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background pb-[70px]">
        <div className="sticky top-0 z-30 bg-background border-b border-border px-4 py-3">
          <h1 className="text-lg font-bold text-foreground">Cart</h1>
        </div>
        <div className="flex flex-col items-center justify-center pt-20 px-6">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ShoppingBag className="h-20 w-20 text-muted-foreground mb-4" />
          </motion.div>
          <h2 className="text-lg font-semibold text-foreground mb-1">Your cart is empty</h2>
          <p className="text-sm text-muted-foreground mb-6 text-center">
            Looks like you haven't added anything yet
          </p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            animate={{ y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: 0.5 }}
            onClick={() => navigate("/")}
            className="rounded-xl bg-primary px-8 py-3 text-sm font-bold text-primary-foreground"
          >
            Start Shopping
          </motion.button>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-[130px]">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background border-b border-border px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-foreground">Cart ({cartCount} items)</h1>
        <button onClick={handleClearCart} className="text-xs font-medium text-destructive">
          Clear Cart
        </button>
      </div>

      <div className="px-4 pt-4 space-y-3">
        {/* Cart Items */}
        <AnimatePresence>
          {cart.map((item) => (
            <motion.div
              key={item.product.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -200, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SwipeableCartItem
                item={item}
                onUpdateQty={updateQuantity}
                onRemove={handleRemove}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Coupon Section */}
        <motion.div
          className="rounded-xl border border-border bg-card overflow-hidden"
          layout
        >
          <button
            onClick={() => setShowCoupon(!showCoupon)}
            className="flex items-center gap-2 w-full p-3"
          >
            <Tag className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground flex-1 text-left">Apply Coupon</span>
            <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${showCoupon ? "rotate-90" : ""}`} />
          </button>
          <AnimatePresence>
            {showCoupon && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-3 pb-3 flex gap-2">
                  <input
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
                  />
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleApplyCoupon}
                    className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground"
                  >
                    Apply
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Bill Details */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-2">
          <h3 className="text-sm font-semibold text-foreground mb-2">Bill Details</h3>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Items total</span>
            <div className="flex items-center gap-1.5">
              {savings > 0 && (
                <span className="text-xs text-muted-foreground line-through">₹{mrpTotal}</span>
              )}
              <span className="text-foreground">₹{subtotal}</span>
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Delivery charge</span>
            <span className={deliveryCharge === 0 ? "text-primary font-medium" : "text-foreground"}>
              {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Handling charge</span>
            <span className="text-foreground">₹{handlingCharge}</span>
          </div>
          {deliveryCharge > 0 && (
            <p className="text-xs text-primary">Add ₹{299 - subtotal} more for free delivery</p>
          )}
          <div className="flex justify-between text-base font-bold pt-2 border-t border-border text-foreground">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
          {savings > 0 && (
            <p className="text-xs font-medium text-primary">🎉 You save ₹{savings} on this order</p>
          )}
        </div>

        {/* Delivery Info */}
        <div className="rounded-xl border border-border bg-card p-3 flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
            <Truck className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{area}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-primary" />
              <span className="text-xs font-medium text-foreground">Delivery in 30-45 mins</span>
            </div>
          </div>
        </div>

        {/* Minimum order warning */}
        {!canCheckout && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-destructive/10 border border-destructive/30 p-3"
          >
            <p className="text-xs font-medium text-destructive">
              ⚠️ Add items worth ₹{MIN_ORDER - subtotal} more to place order (min ₹{MIN_ORDER})
            </p>
          </motion.div>
        )}
      </div>

      {/* Bottom Sticky Bar */}
      <div className="fixed bottom-[60px] left-0 right-0 z-40">
        <div className="mx-auto max-w-[480px] bg-card border-t border-border px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-lg font-bold text-foreground">₹{total}</p>
          </div>
          <motion.button
            whileTap={{ scale: canCheckout ? 0.95 : 1 }}
            onClick={() => canCheckout && navigate("/checkout")}
            className={`rounded-xl px-6 py-3 text-sm font-bold flex items-center gap-2 transition-opacity ${
              canCheckout
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            Proceed to Checkout
            <motion.span
              animate={canCheckout ? { x: [0, 4, 0] } : {}}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              →
            </motion.span>
          </motion.button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Cart;
