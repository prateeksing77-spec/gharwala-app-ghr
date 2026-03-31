import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, Trash2, ShoppingCart, Tag, Truck } from 'lucide-react';
import { useAppStore } from '@/stores/cartStore';
import { coupons } from '@/data/products';
import { deliverySettings } from '@/data/settings';
import BottomNav from '@/components/BottomNav';
import toast from 'react-hot-toast';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useAppStore();
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<typeof coupons[0] | null>(null);

  const subtotal = getCartTotal();
  const delivery = subtotal >= deliverySettings.freeDeliveryAbove ? 0 : deliverySettings.deliveryCharge;
  const discount = appliedCoupon
    ? appliedCoupon.type === 'percent' ? Math.round(subtotal * appliedCoupon.discount / 100) : appliedCoupon.discount
    : 0;
  const total = subtotal + delivery - discount;
  const freeDeliveryGap = deliverySettings.freeDeliveryAbove - subtotal;

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    const coupon = coupons.find((c) => c.code === code);
    if (!coupon) { toast.error('Invalid coupon code'); return; }
    if (subtotal < coupon.minOrder) { toast.error(`Min order Rs.${coupon.minOrder} required`); return; }
    setAppliedCoupon(coupon);
    toast.success('Coupon applied!');
  };

  if (cart.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <ShoppingCart className="h-20 w-20 text-muted-foreground/20 mb-4" />
        <h2 className="text-xl font-bold text-foreground mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">Add items to get started</p>
        <button onClick={() => navigate('/products')} className="rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground">
          Browse Products
        </button>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="sticky top-0 z-30 flex items-center gap-3 bg-card border-b border-border px-4 py-3">
        <button onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5 text-foreground" /></button>
        <h1 className="text-lg font-bold text-foreground">Cart ({cart.length} items)</h1>
      </div>

      {freeDeliveryGap > 0 && (
        <div className="mx-4 mt-3 flex items-center gap-2 rounded-xl bg-primary/5 border border-primary/20 px-3 py-2.5">
          <Truck className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium text-primary">Add Rs.{Math.ceil(freeDeliveryGap)} more for FREE delivery</span>
        </div>
      )}

      <div className="space-y-2 px-4 mt-3">
        {cart.map((item) => (
          <div key={item.product.id} className="flex items-center gap-3 rounded-xl bg-card border border-border p-3">
            <img src={item.product.image} alt={item.product.name} className="h-16 w-16 rounded-lg bg-secondary object-cover" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">{item.product.name}</p>
              <p className="text-xs text-muted-foreground">{item.selectedWeight || item.product.weight}</p>
              <p className="text-sm font-bold text-primary">Rs.{item.product.price * item.quantity}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button onClick={() => removeFromCart(item.product.id)}><Trash2 className="h-4 w-4 text-destructive" /></button>
              <div className="flex items-center gap-2 rounded-lg bg-primary px-2 py-0.5">
                <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}><Minus className="h-3.5 w-3.5 text-primary-foreground" /></button>
                <span className="min-w-[16px] text-center text-sm font-bold text-primary-foreground">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}><Plus className="h-3.5 w-3.5 text-primary-foreground" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Coupon */}
      <div className="mx-4 mt-4 flex gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5">
          <Tag className="h-4 w-4 text-muted-foreground" />
          <input value={couponInput} onChange={(e) => setCouponInput(e.target.value)} placeholder="Coupon code"
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" />
        </div>
        <button onClick={applyCoupon} className="rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground">Apply</button>
      </div>
      {appliedCoupon && (
        <p className="mx-4 mt-1 text-xs font-medium text-primary">{appliedCoupon.code} applied - Rs.{discount} off</p>
      )}

      {/* Bill */}
      <div className="mx-4 mt-4 space-y-2 rounded-xl bg-card border border-border p-4">
        <h3 className="font-bold text-foreground">Bill Details</h3>
        <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span className="text-foreground">Rs.{subtotal}</span></div>
        <div className="flex justify-between text-sm"><span className="text-muted-foreground">Delivery</span><span className={delivery === 0 ? 'text-primary font-medium' : 'text-foreground'}>{delivery === 0 ? 'FREE' : `Rs.${delivery}`}</span></div>
        {discount > 0 && <div className="flex justify-between text-sm"><span className="text-muted-foreground">Discount</span><span className="text-primary font-medium">-Rs.{discount}</span></div>}
        <div className="border-t border-border pt-2 flex justify-between font-bold"><span className="text-foreground">Total</span><span className="text-foreground">Rs.{total}</span></div>
      </div>

      <div className="fixed bottom-16 left-0 right-0 z-40 px-4 pb-2">
        <button onClick={() => navigate('/checkout')} className="w-full rounded-xl bg-primary py-3.5 font-bold text-primary-foreground shadow-lg shadow-primary/20">
          Proceed to Checkout - Rs.{total}
        </button>
      </div>
      <BottomNav />
    </div>
  );
};

export default Cart;
