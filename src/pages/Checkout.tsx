import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Plus, CreditCard, Banknote, Shield, Upload, Image } from 'lucide-react';
import { useAppStore } from '@/stores/cartStore';
import { areas } from '@/data/products';
import { deliverySettings, upiSettings } from '@/data/settings';
import toast from 'react-hot-toast';
import BottomNav from '@/components/BottomNav';

const sanitize = (v: string) => v.replace(/<[^>]*>/g, '').replace(/[<>"'&]/g, '');
const validatePhone = (v: string) => /^[6-9]\d{9}$/.test(v);
const validatePincode = (v: string) => /^\d{6}$/.test(v);
const validateName = (v: string) => /^[a-zA-Z\s]{1,50}$/.test(v.trim());

const Checkout = () => {
  const navigate = useNavigate();
  const { addresses, addAddress, cart, getCartTotal, placeOrder } = useAppStore();
  const [selectedAddress, setSelectedAddress] = useState(addresses[0]?.id || '');
  const [payment, setPayment] = useState<'cod' | 'upi'>('cod');
  const [showAddForm, setShowAddForm] = useState(addresses.length === 0);
  const [form, setForm] = useState({ name: '', phone: '', house: '', street: '', landmark: '', area: areas[0], pincode: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [upiScreenshot, setUpiScreenshot] = useState<string | null>(null);

  const subtotal = getCartTotal();
  const delivery = subtotal >= deliverySettings.freeDeliveryAbove ? 0 : deliverySettings.deliveryCharge;
  const total = subtotal + delivery;

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!validateName(form.name)) errs.name = 'Only letters and spaces, max 50 chars';
    if (!validatePhone(form.phone)) errs.phone = 'Valid 10-digit number starting with 6-9';
    if (!sanitize(form.house).trim()) errs.house = 'Required';
    if (!sanitize(form.street).trim()) errs.street = 'Required';
    if (!validatePincode(form.pincode)) errs.pincode = 'Valid 6-digit PIN code';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddAddress = () => {
    if (!validateForm()) return;
    const sanitized = {
      name: sanitize(form.name).trim(),
      phone: form.phone,
      house: sanitize(form.house).trim().slice(0, 200),
      street: sanitize(form.street).trim().slice(0, 200),
      landmark: sanitize(form.landmark).trim().slice(0, 200),
      area: form.area,
      pincode: form.pincode,
      isDefault: false,
    };
    addAddress(sanitized);
    setShowAddForm(false);
    toast.success('Address added');
  };

  const handleScreenshot = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUpiScreenshot(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handlePlaceOrder = () => {
    const addr = addresses.find((a) => a.id === selectedAddress);
    if (!addr && !showAddForm) {
      toast.error('Select a delivery address');
      return;
    }
    if (cart.length === 0) { toast.error('Cart is empty'); return; }
    if (subtotal < deliverySettings.minOrderAmount) { toast.error(`Minimum order Rs.${deliverySettings.minOrderAmount}`); return; }

    let finalAddr = addr;
    if (!finalAddr && showAddForm) {
      if (!validateForm()) return;
      const sanitized = {
        name: sanitize(form.name).trim(),
        phone: form.phone,
        house: sanitize(form.house).trim().slice(0, 200),
        street: sanitize(form.street).trim().slice(0, 200),
        landmark: sanitize(form.landmark).trim().slice(0, 200),
        area: form.area,
        pincode: form.pincode,
        isDefault: true,
      };
      addAddress(sanitized);
      finalAddr = { ...sanitized, id: 'temp' };
    }

    const orderId = placeOrder(finalAddr!, payment);
    toast.success('Order placed successfully!');
    navigate(`/order-confirmation/${orderId}`, { replace: true });
  };

  const formField = (field: 'name' | 'phone' | 'house' | 'street' | 'landmark', label: string, type = 'text') => (
    <div key={field}>
      <input value={form[field]}
        onChange={(e) => {
          let val = e.target.value;
          if (field === 'phone') val = val.replace(/\D/g, '').slice(0, 10);
          else val = val.slice(0, 200);
          setForm({ ...form, [field]: val });
          if (errors[field]) setErrors({ ...errors, [field]: '' });
        }}
        placeholder={label + (field === 'landmark' ? ' (optional)' : ' *')}
        className={`w-full rounded-lg border bg-background px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-accent ${errors[field] ? 'border-destructive' : 'border-border'}`}
        type={type}
        maxLength={field === 'phone' ? 10 : 200}
      />
      {errors[field] && <p className="mt-0.5 text-xs text-destructive">{errors[field]}</p>}
    </div>
  );

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
              <button onClick={() => setShowAddForm(!showAddForm)} className="text-sm text-accent flex items-center gap-1">
                <Plus className="h-3 w-3" /> Add New
              </button>
            )}
          </div>

          {addresses.map((addr) => (
            <button key={addr.id} onClick={() => { setSelectedAddress(addr.id); setShowAddForm(false); }}
              className={`w-full rounded-lg border p-3 text-left ${selectedAddress === addr.id && !showAddForm ? 'border-accent bg-accent/10' : 'border-border bg-card'}`}>
              <p className="text-sm font-medium text-foreground">{addr.name}</p>
              <p className="text-xs text-muted-foreground">{addr.house}, {addr.street}, {addr.area} - {addr.pincode}</p>
            </button>
          ))}

          {showAddForm && (
            <div className="space-y-3 rounded-lg border border-border bg-card p-4">
              {formField('name', 'Name')}
              {formField('phone', 'Phone', 'tel')}
              {formField('house', 'House / Flat')}
              {formField('street', 'Street / Mohalla')}
              {formField('landmark', 'Landmark')}
              <div>
                <select value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-accent">
                  {areas.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <input value={form.pincode} onChange={(e) => { setForm({ ...form, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) }); if (errors.pincode) setErrors({ ...errors, pincode: '' }); }}
                  placeholder="PIN Code *" type="tel" maxLength={6}
                  className={`w-full rounded-lg border bg-background px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-accent ${errors.pincode ? 'border-destructive' : 'border-border'}`} />
                {errors.pincode && <p className="mt-0.5 text-xs text-destructive">{errors.pincode}</p>}
              </div>
              {addresses.length === 0 ? null : (
                <button onClick={handleAddAddress} className="w-full rounded-lg bg-accent py-2.5 text-sm font-semibold text-accent-foreground">Save Address</button>
              )}
            </div>
          )}
        </div>

        {/* Payment */}
        <div className="space-y-2">
          <h3 className="font-bold text-foreground flex items-center gap-2"><CreditCard className="h-4 w-4" /> Payment Method</h3>
          <button onClick={() => setPayment('cod')}
            className={`flex w-full items-center gap-3 rounded-lg border p-3 ${payment === 'cod' ? 'border-accent bg-accent/10' : 'border-border bg-card'}`}>
            <Banknote className="h-5 w-5 text-accent" />
            <span className="text-sm font-medium text-foreground">Cash on Delivery</span>
          </button>
          <button onClick={() => setPayment('upi')}
            className={`flex w-full items-center gap-3 rounded-lg border p-3 ${payment === 'upi' ? 'border-accent bg-accent/10' : 'border-border bg-card'}`}>
            <CreditCard className="h-5 w-5 text-accent" />
            <span className="text-sm font-medium text-foreground">UPI Payment</span>
          </button>

          {payment === 'upi' && (
            <div className="rounded-lg border border-border bg-card p-4 space-y-3">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">UPI ID</p>
                <p className="text-base font-bold text-accent">{upiSettings.upiId}</p>
              </div>
              <div className="flex justify-center">
                <div className="h-32 w-32 rounded-lg bg-foreground/10 flex items-center justify-center">
                  <Image className="h-10 w-10 text-muted-foreground" />
                </div>
              </div>
              <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-accent py-2.5 text-sm font-medium text-accent">
                <Upload className="h-4 w-4" />
                Upload Payment Screenshot
                <input type="file" accept="image/*" onChange={handleScreenshot} className="hidden" />
              </label>
              {upiScreenshot && (
                <img src={upiScreenshot} alt="Payment screenshot" className="mx-auto h-24 rounded-lg object-contain" />
              )}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="space-y-2 rounded-lg bg-card p-4">
          <h3 className="font-bold text-foreground">Order Summary</h3>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Items ({cart.length})</span><span className="text-foreground">Rs.{subtotal}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Delivery</span><span className={delivery === 0 ? 'text-primary' : 'text-foreground'}>{delivery === 0 ? 'FREE' : `Rs.${delivery}`}</span></div>
          <div className="border-t border-border pt-2 flex justify-between font-bold"><span className="text-foreground">Total</span><span className="text-foreground">Rs.{total}</span></div>
        </div>

        {/* Secured footer */}
        <div className="flex items-center justify-center gap-1.5 py-2">
          <Shield className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Secured by KiraNey</span>
        </div>
      </div>

      <div className="fixed bottom-16 left-0 right-0 z-40 px-4 pb-2">
        <button onClick={handlePlaceOrder} className="w-full rounded-lg bg-accent py-3.5 font-bold text-accent-foreground">
          Place Order - Rs.{total}
        </button>
      </div>
      <BottomNav />
    </div>
  );
};

export default Checkout;
