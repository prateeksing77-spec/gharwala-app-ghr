import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useAppStore } from "@/stores/cartStore";

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, placeOrder } = useAppStore();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [house, setHouse] = useState("");
  const [street, setStreet] = useState("");
  const [area, setArea] = useState(localStorage.getItem("kiraney-area") || "");
  const [pincode, setPincode] = useState("");
  const [placed, setPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const subtotal = getCartTotal();
  const delivery = subtotal >= 399 ? 0 : 30;
  const total = subtotal + delivery;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Required";
    if (!/^[6-9]\d{9}$/.test(phone)) e.phone = "Enter valid 10-digit phone";
    if (!house.trim()) e.house = "Required";
    if (!street.trim()) e.street = "Required";
    if (!area) e.area = "Select area";
    if (!/^\d{6}$/.test(pincode)) e.pincode = "Enter valid 6-digit PIN";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePlaceOrder = () => {
    if (!validate()) return;
    const id = placeOrder({ id: "", name, phone, house, street, area, pincode });
    setOrderId(id);
    setPlaced(true);
  };

  if (placed) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <CheckCircle className="h-20 w-20 text-primary mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-1">Order Placed!</h1>
        <p className="text-muted-foreground mb-1">Order ID: {orderId}</p>
        <p className="text-sm text-muted-foreground mb-6">Cash on Delivery • ₹{total}</p>
        <button
          onClick={() => navigate("/orders")}
          className="rounded-xl bg-primary px-8 py-3 text-sm font-bold text-primary-foreground"
        >
          View Orders
        </button>
        <button onClick={() => navigate("/")} className="mt-3 text-sm text-primary font-medium">
          Back to Home
        </button>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary";

  return (
    <div className="min-h-screen bg-background pb-6">
      <div className="sticky top-0 z-30 bg-background border-b border-border px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground">Checkout</h1>
      </div>

      <div className="px-4 pt-4 space-y-4">
        <div>
          <h2 className="text-base font-semibold text-foreground mb-3">Delivery Address</h2>
          <div className="space-y-3">
            {[
              { label: "Full Name", value: name, set: setName, key: "name" },
              { label: "Phone Number", value: phone, set: setPhone, key: "phone", type: "tel", maxLength: 10 },
              { label: "House / Flat No.", value: house, set: setHouse, key: "house" },
              { label: "Street / Mohalla", value: street, set: setStreet, key: "street" },
            ].map((f) => (
              <div key={f.key}>
                <input
                  value={f.value}
                  onChange={(e) => f.set(e.target.value)}
                  placeholder={f.label}
                  type={f.type || "text"}
                  maxLength={f.maxLength}
                  className={inputClass}
                />
                {errors[f.key] && <p className="text-xs text-destructive mt-1">{errors[f.key]}</p>}
              </div>
            ))}

            <div>
              <input value={area} onChange={(e) => setArea(e.target.value)} placeholder="Area" className={inputClass} />
              {errors.area && <p className="text-xs text-destructive mt-1">{errors.area}</p>}
            </div>

            <div>
              <input
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="PIN Code"
                type="tel"
                maxLength={6}
                className={inputClass}
              />
              {errors.pincode && <p className="text-xs text-destructive mt-1">{errors.pincode}</p>}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <h2 className="text-base font-semibold text-foreground mb-2">Payment</h2>
          <div className="flex items-center gap-2 rounded-lg bg-accent px-3 py-2.5">
            <div className="h-4 w-4 rounded-full border-[5px] border-primary" />
            <span className="text-sm font-medium text-foreground">Cash on Delivery</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <h2 className="text-base font-semibold text-foreground mb-3">Order Summary</h2>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Items ({cart.length})</span>
              <span className="text-foreground">₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery</span>
              <span className={delivery === 0 ? "text-primary font-medium" : "text-foreground"}>
                {delivery === 0 ? "FREE" : `₹${delivery}`}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-border text-base font-bold text-foreground">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handlePlaceOrder}
          className="w-full rounded-xl bg-primary py-4 text-center text-base font-bold text-primary-foreground"
        >
          Place Order • ₹{total}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
