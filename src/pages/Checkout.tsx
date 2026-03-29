import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Plus, CreditCard, Banknote } from 'lucide-react';
import { useAppStore } from '@/stores/cartStore';
import { areas } from '@/data/products';
import toast from 'react-hot-toast';
import BottomNav from '@/components/BottomNav';

const Checkout = () => {
  const navigate = useNavigate();
  const { addresses, addAddress, cart, getCartTotal, placeOrder } = useAppStore();
  const [selectedAddress, setSelectedAddress] = useState(addresses[0]?.id || '');
  const [payment, setPayment] = useState<'cod' | 'upi'>('cod');
  const [showAddForm, setShowAddForm] = useState(addresses.length === 0);
  const [form, setForm] = useState({ name: '', phone: '', house: '', street: '', landmark: '', area: areas[0], pincode: '' });

  const subtotal = getCartTotal();
  const delivery = subtotal >= 299 ? 0 : 30;
  const total = subtotal + delivery;

  const validatePhone = (v: string) => /^[6-9]\d{9}$/.test(v);
  const validatePincode = (v: string) => /^\d{6}$/.test(v);

  const handleAddAddress = () => {
    if (!form.name.trim() || !form.house.trim() || !form.street.trim()) {
      toast.error('Fill all required fields');
      return;
    }
    if (!validatePhone(form.phone)) { toast.error('Invalid phone number'); return; }
    if (!validatePincode(form.pincode)) { toast.error('Invalid pincode'); return; }
    addAddress({ ...form, isDefault: false });
    setShowAddForm(false);
    toast.success('Address added');
  };

  const handlePlaceOrder = () => {
    const addr = addresses.find((a) => a.id === selectedAddress);
    if (!addr && !showAddForm) {
      toast.error('Select a delivery address');
      return;
    }
    if (cart.length === 0) { toast.error('Cart is empty'); return; }

    let finalAddr = addr;
    if (!finalAddr && showAddForm) {
      if (!form.name.trim() || !validatePhone(form.phone) || !form.house.trim()) {
        toast.error('Complete the address form');
        return;
      }
      addAddress({ ...form, isDefault: true });
      finalAddr = { ...form, id: 'temp', isDefault: true };
    }

    const orderId = placeOrder(finalAddr!, payment);
    navigate(`/order-confirmation/${orderId}`, { replace: true });
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="sticky top-0 z-30 flex items-center gap-3 bg-background/95 backdrop-blur-sm px-4 py-3">
        <button onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5 text-foreground" /></button>
        <h1 className="text-lg font-bold text-foreground">Checkout</h1>
      </div>

      <div className="px-4 space-y-4">
        {/* Addresses */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-foreground flex items-center gap-2"><MapPin className="h-4 w-4" /> Delivery Address</h3>
            {addresses.length > 0 && (
              <button onClick={() => setShowAddForm(!showAddForm)} className="text-sm text-primary flex items-center gap-1">
                <Plus className="h-3 w-3" /> Add New
              </button>
            )}
          </div>

          {addresses.map((addr) => (
            <button key={addr.id} onClick={() => { setSelectedAddress(addr.id); setShowAddForm(false); }}
              className={`w-full rounded-lg border p-3 text-left ${selectedAddress === addr.id && !showAddForm ? 'border-primary bg-primary/10' : 'border-border bg-surface'}`}>
              <p className="text-sm font-medium text-foreground">{addr.name}</p>
              <p className="text-xs text-muted-foreground">{addr.house}, {addr.street}, {addr.area} - {addr.pincode}</p>
            </button>
          ))}

          {showAddForm && (
            <div className="space-y-3 rounded-lg border border-border bg-surface p-4">
              {(['name', 'phone', 'house', 'street', 'landmark'] as const).map((field) => (
                <input key={field} value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value.slice(0, field === 'phone' ? 10 : 100) })}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
                  type={field === 'phone' ? 'tel' : 'text'}
                  maxLength={field === 'phone' ? 10 : 100}
                />
              ))}
              <select value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary">
                {areas.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
              <input value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                placeholder="Pincode" type="tel" maxLength={6}
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary" />
              {addresses.length === 0 ? null : (
                <button onClick={handleAddAddress} className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground">Save Address</button>
              )}
            </div>
          )}
        </div>

        {/* Payment */}
        <div className="space-y-2">
          <h3 className="font-bold text-foreground flex items-center gap-2"><CreditCard className="h-4 w-4" /> Payment Method</h3>
          <button onClick={() => setPayment('cod')}
            className={`flex w-full items-center gap-3 rounded-lg border p-3 ${payment === 'cod' ? 'border-primary bg-primary/10' : 'border-border bg-surface'}`}>
            <Banknote className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-foreground">Cash on Delivery</span>
          </button>
          <button onClick={() => setPayment('upi')}
            className={`flex w-full items-center gap-3 rounded-lg border p-3 ${payment === 'upi' ? 'border-primary bg-primary/10' : 'border-border bg-surface'}`}>
            <CreditCard className="h-5 w-5 text-accent" />
            <span className="text-sm font-medium text-foreground">UPI Payment</span>
          </button>
        </div>

        {/* Summary */}
        <div className="space-y-2 rounded-lg bg-surface p-4">
          <h3 className="font-bold text-foreground">Order Summary</h3>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Items ({cart.length})</span><span className="text-foreground">Rs.{subtotal}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Delivery</span><span className={delivery === 0 ? 'text-primary' : 'text-foreground'}>{delivery === 0 ? 'FREE' : `Rs.${delivery}`}</span></div>
          <div className="border-t border-border pt-2 flex justify-between font-bold"><span className="text-foreground">Total</span><span className="text-foreground">Rs.{total}</span></div>
        </div>
      </div>

      <div className="fixed bottom-16 left-0 right-0 z-40 px-4 pb-2">
        <button onClick={handlePlaceOrder} className="w-full rounded-lg bg-primary py-3.5 font-bold text-primary-foreground">
          Place Order - Rs.{total}
        </button>
      </div>
      <BottomNav />
    </div>
  );
};

export default Checkout;
