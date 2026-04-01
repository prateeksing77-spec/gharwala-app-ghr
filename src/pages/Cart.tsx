import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useAppStore } from '@/stores/cartStore';
import BottomNav from '@/components/BottomNav';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useAppStore();
  const subtotal = getCartTotal();
  const delivery = subtotal >= 199 ? 0 : 30;
  const freeDeliveryGap = subtotal < 199 ? 199 - subtotal : 0;
  const total = subtotal + delivery;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="px-4 pt-6">
          <h1 className="text-xl font-bold text-foreground mb-8">Cart</h1>
          <div className="flex flex-col items-center py-16">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mb-3" />
            <p className="text-lg font-semibold text-foreground">Your cart is empty</p>
            <p className="text-sm text-muted-foreground mt-1">Add items to get started</p>
            <button onClick={() => navigate('/products')} className="mt-4 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">
              Browse Products
            </button>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-44">
      <div className="px-4 pt-6">
        <h1 className="text-xl font-bold text-foreground mb-4">Cart ({cart.length} items)</h1>

        {freeDeliveryGap > 0 && (
          <div className="rounded-xl bg-secondary/10 border border-secondary/30 px-4 py-3 mb-4">
            <p className="text-sm font-medium text-secondary">Add ₹{freeDeliveryGap} more for FREE delivery!</p>
          </div>
        )}

        <div className="space-y-3">
          {cart.map((item) => (
            <div key={item.product.id} className="flex gap-3 rounded-xl border border-border bg-card p-3">
              <div className="h-16 w-16 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground line-clamp-1">{item.product.name}</h3>
                <p className="text-xs text-muted-foreground">{item.product.unit}</p>
                <p className="text-sm font-bold text-primary mt-1">₹{item.product.price * item.quantity}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button onClick={() => removeFromCart(item.product.id)} className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-2 rounded-lg bg-primary px-2 py-1">
                  <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="text-primary-foreground"><Minus className="h-3.5 w-3.5" /></button>
                  <span className="text-xs font-bold text-primary-foreground">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="text-primary-foreground"><Plus className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-14 left-0 right-0 bg-card border-t border-border px-4 py-4 z-40">
        <div className="space-y-1 mb-3">
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span className="text-foreground">₹{subtotal}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Delivery</span><span className={delivery === 0 ? 'text-secondary font-medium' : 'text-foreground'}>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span></div>
          <div className="flex justify-between text-base font-bold"><span>Total</span><span>₹{total}</span></div>
        </div>
        <button onClick={() => navigate('/checkout')} className="w-full rounded-xl bg-primary py-3.5 text-center text-sm font-bold text-primary-foreground">
          Place Order • ₹{total}
        </button>
      </div>

      <BottomNav />
    </div>
  );
};

export default Cart;
