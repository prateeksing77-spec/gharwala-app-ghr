import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useAppStore } from "@/stores/cartStore";
import BottomNav from "@/components/BottomNav";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useAppStore();
  const subtotal = getCartTotal();
  const delivery = subtotal >= 399 ? 0 : 30;
  const total = subtotal + delivery;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background pb-[70px]">
        <div className="sticky top-0 z-30 bg-background border-b border-border px-4 py-3">
          <h1 className="text-lg font-bold text-foreground">Cart</h1>
        </div>
        <div className="flex flex-col items-center justify-center pt-24 px-6">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-lg font-semibold text-foreground mb-1">Your cart is empty</h2>
          <p className="text-sm text-muted-foreground mb-6">Add items to get started</p>
          <button
            onClick={() => navigate("/")}
            className="rounded-xl bg-primary px-8 py-3 text-sm font-bold text-primary-foreground"
          >
            Browse Products
          </button>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-[70px]">
      <div className="sticky top-0 z-30 bg-background border-b border-border px-4 py-3">
        <h1 className="text-lg font-bold text-foreground">Cart ({cart.length} items)</h1>
      </div>

      <div className="px-4 pt-4 space-y-3">
        <AnimatePresence>
          {cart.map((item) => (
            <motion.div
              key={item.product.id}
              layout
              exit={{ opacity: 0, x: -100 }}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
            >
              <div className="h-16 w-16 rounded-lg bg-accent flex items-center justify-center text-2xl shrink-0">
                🛒
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{item.product.name}</p>
                <p className="text-xs text-muted-foreground">{item.product.unit}</p>
                <p className="text-sm font-bold text-primary mt-0.5">₹{item.product.price}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  className="h-7 w-7 rounded-lg border border-border flex items-center justify-center"
                >
                  <Minus className="h-3 w-3 text-foreground" />
                </button>
                <span className="text-sm font-bold text-foreground w-5 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center"
                >
                  <Plus className="h-3 w-3 text-primary-foreground" />
                </button>
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="h-7 w-7 rounded-lg flex items-center justify-center ml-1"
                >
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <div className="rounded-xl border border-border bg-card p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-foreground">₹{subtotal}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Delivery</span>
            <span className={delivery === 0 ? "text-primary font-medium" : "text-foreground"}>
              {delivery === 0 ? "FREE" : `₹${delivery}`}
            </span>
          </div>
          {delivery > 0 && (
            <p className="text-xs text-primary">Add ₹{399 - subtotal} more for free delivery</p>
          )}
          <div className="flex justify-between text-base font-bold pt-2 border-t border-border text-foreground">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>

        <button
          onClick={() => navigate("/checkout")}
          className="w-full rounded-xl bg-primary py-4 text-center text-base font-bold text-primary-foreground"
        >
          Checkout • ₹{total}
        </button>
      </div>

      <BottomNav />
    </div>
  );
};

export default Cart;
