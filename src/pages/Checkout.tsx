import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, CreditCard, Lock, FileText, Plus, Home as HomeIcon, Briefcase, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/stores/cartStore";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart, getCartCount } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [orderNotes, setOrderNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  // Address state
  const [showAddressSheet, setShowAddressSheet] = useState(false);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [newAddress, setNewAddress] = useState({ label: "Home", full_address: "", area: localStorage.getItem("kiraney-area") || "", landmark: "" });
  const [areas, setAreas] = useState<string[]>([]);

  const subtotal = getCartTotal();
  const deliveryCharge = subtotal >= 299 ? 0 : 20;
  const handlingCharge = 5;
  const total = subtotal + deliveryCharge + handlingCharge;

  const mrpTotal = cart.reduce((sum, i) => {
    const mrp = i.product.mrp && i.product.mrp > i.product.price ? i.product.mrp : i.product.price;
    return sum + mrp * i.quantity;
  }, 0);
  const savings = mrpTotal - subtotal;

  useEffect(() => {
    loadAddresses();
    loadAreas();
  }, []);

  const loadAddresses = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("addresses").select("*").eq("user_id", user.id).order("is_default", { ascending: false });
    if (data && data.length > 0) {
      setAddresses(data);
      setSelectedAddress(data.find((a) => a.is_default) || data[0]);
    }
  };

  const loadAreas = async () => {
    const { data } = await supabase.from("serviceable_areas").select("area_name").eq("is_active", true);
    if (data) setAreas(data.map((a) => a.area_name));
  };

  const handleSaveAddress = async () => {
    if (!newAddress.full_address.trim()) {
      toast.error("Please enter your full address");
      return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please login first");
      navigate("/auth");
      return;
    }
    const { data, error } = await supabase.from("addresses").insert({
      user_id: user.id,
      label: newAddress.label,
      full_address: newAddress.full_address,
      area: newAddress.area,
      landmark: newAddress.landmark,
      is_default: addresses.length === 0,
    }).select().single();
    if (error) {
      toast.error("Failed to save address");
      return;
    }
    setAddresses([...addresses, data]);
    setSelectedAddress(data);
    setShowNewAddress(false);
    setShowAddressSheet(false);
    toast.success("Address saved!");
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please add a delivery address");
      return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please login first");
      navigate("/auth");
      return;
    }

    setLoading(true);
    const orderItems = cart.map((i) => ({
      product_id: i.product.id,
      name: i.product.name,
      price: i.product.price,
      mrp: i.product.mrp,
      quantity: i.quantity,
      weight: i.product.weight || i.product.unit,
    }));

    const { data: order, error } = await supabase.from("orders").insert({
      user_id: user.id,
      items: orderItems as any,
      subtotal,
      delivery_charge: deliveryCharge,
      total,
      delivery_address: {
        label: selectedAddress.label,
        full_address: selectedAddress.full_address,
        area: selectedAddress.area,
        landmark: selectedAddress.landmark,
      } as any,
      payment_method: paymentMethod,
      order_notes: orderNotes || null,
      status: "placed",
    }).select().single();

    if (error) {
      toast.error("Failed to place order");
      setLoading(false);
      return;
    }

    // Create notification
    await supabase.from("notifications").insert({
      user_id: user.id,
      title: "Order Placed! 🎉",
      message: `Your order has been placed successfully. Estimated delivery: 30-45 minutes.`,
      type: "order",
    });

    clearCart();
    setLoading(false);
    navigate("/order-success", { state: { orderId: order.id, total } });
  };

  const labelIcons: Record<string, any> = { Home: HomeIcon, Work: Briefcase, Other: Tag };

  if (cart.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-background border-b border-border px-4 py-3 flex items-center gap-3">
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </motion.button>
        <h1 className="text-lg font-bold text-foreground">Checkout</h1>
      </div>

      <div className="px-4 pt-4 space-y-3">
        {/* Delivery Address */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" /> Delivery Address
            </h2>
            <button onClick={() => setShowAddressSheet(true)} className="text-xs font-medium text-primary">
              {selectedAddress ? "Change" : "Add"}
            </button>
          </div>
          {selectedAddress ? (
            <div className="rounded-lg bg-accent p-3">
              <p className="text-xs font-semibold text-foreground mb-0.5">{selectedAddress.label}</p>
              <p className="text-xs text-muted-foreground">{selectedAddress.full_address}</p>
              {selectedAddress.landmark && (
                <p className="text-xs text-muted-foreground">Near: {selectedAddress.landmark}</p>
              )}
              <p className="text-xs text-muted-foreground">{selectedAddress.area}</p>
            </div>
          ) : (
            <button
              onClick={() => { setShowAddressSheet(true); setShowNewAddress(true); }}
              className="w-full rounded-lg border border-dashed border-primary/40 p-3 flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">Add Delivery Address</span>
            </button>
          )}
        </div>

        {/* Delivery Time */}
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
            <Clock className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Standard Delivery</p>
            <p className="text-xs text-muted-foreground">30-45 minutes</p>
          </div>
        </div>

        {/* Payment Method */}
        <div className="rounded-xl border border-border bg-card p-4">
          <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-primary" /> Payment Method
          </h2>
          <div className="space-y-2">
            <button
              onClick={() => setPaymentMethod("cod")}
              className={`w-full rounded-lg p-3 flex items-center gap-3 border transition-colors ${
                paymentMethod === "cod" ? "border-primary bg-primary/5" : "border-border"
              }`}
            >
              <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                paymentMethod === "cod" ? "border-primary" : "border-muted-foreground"
              }`}>
                {paymentMethod === "cod" && <div className="h-2 w-2 rounded-full bg-primary" />}
              </div>
              <span className="text-sm font-medium text-foreground flex-1 text-left">Cash on Delivery</span>
              {paymentMethod === "cod" && <span className="text-xs text-primary font-medium">✓</span>}
            </button>
            <div className="w-full rounded-lg p-3 flex items-center gap-3 border border-border opacity-50 cursor-not-allowed">
              <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
              <span className="text-sm text-muted-foreground flex-1 text-left">Online Payment</span>
              <div className="flex items-center gap-1">
                <Lock className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded">Coming Soon</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Notes */}
        <div className="rounded-xl border border-border bg-card p-4">
          <h2 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" /> Order Notes
          </h2>
          <textarea
            value={orderNotes}
            onChange={(e) => setOrderNotes(e.target.value)}
            placeholder="Any special instructions? (optional)"
            rows={2}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary resize-none"
          />
        </div>

        {/* Bill Summary */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-2">
          <h3 className="text-sm font-semibold text-foreground mb-2">Bill Summary</h3>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Items total ({getCartCount()})</span>
            <span className="text-foreground">₹{subtotal}</span>
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
          <div className="flex justify-between text-base font-bold pt-2 border-t border-border text-foreground">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
          {savings > 0 && (
            <p className="text-xs font-medium text-primary">🎉 You save ₹{savings} on this order</p>
          )}
        </div>

        {/* Place Order */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handlePlaceOrder}
          disabled={loading || !selectedAddress}
          className="w-full rounded-xl bg-primary py-4 text-center text-base font-bold text-primary-foreground disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full"
            />
          ) : (
            `Place Order • ₹${total}`
          )}
        </motion.button>
      </div>

      {/* Address Selection Bottom Sheet */}
      <AnimatePresence>
        {showAddressSheet && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setShowAddressSheet(false); setShowNewAddress(false); }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50"
            >
              <div className="mx-auto max-w-[480px] bg-card rounded-t-2xl max-h-[70vh] overflow-y-auto">
                <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
                  <h2 className="text-base font-bold text-foreground">
                    {showNewAddress ? "Add New Address" : "Select Address"}
                  </h2>
                  <button onClick={() => { setShowAddressSheet(false); setShowNewAddress(false); }} className="text-sm text-muted-foreground">
                    ✕
                  </button>
                </div>

                {showNewAddress ? (
                  <div className="p-4 space-y-3">
                    {/* Label */}
                    <div className="flex gap-2">
                      {["Home", "Work", "Other"].map((lbl) => {
                        const Icon = labelIcons[lbl] || Tag;
                        return (
                          <motion.button
                            key={lbl}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setNewAddress({ ...newAddress, label: lbl })}
                            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border transition-colors ${
                              newAddress.label === lbl
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border text-muted-foreground"
                            }`}
                          >
                            <Icon className="h-3 w-3" /> {lbl}
                          </motion.button>
                        );
                      })}
                    </div>
                    <textarea
                      value={newAddress.full_address}
                      onChange={(e) => setNewAddress({ ...newAddress, full_address: e.target.value })}
                      placeholder="Full address (House no, Street, Colony...)"
                      rows={3}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary resize-none"
                    />
                    <select
                      value={newAddress.area}
                      onChange={(e) => setNewAddress({ ...newAddress, area: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
                    >
                      <option value="">Select Area</option>
                      {areas.map((a) => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                    <input
                      value={newAddress.landmark}
                      onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })}
                      placeholder="Landmark (optional)"
                      className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
                    />
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={handleSaveAddress}
                      className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground"
                    >
                      Save Address
                    </motion.button>
                  </div>
                ) : (
                  <div className="p-4 space-y-2">
                    {addresses.map((addr) => (
                      <motion.button
                        key={addr.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { setSelectedAddress(addr); setShowAddressSheet(false); }}
                        className={`w-full text-left rounded-xl p-3 border transition-colors ${
                          selectedAddress?.id === addr.id ? "border-primary bg-primary/5" : "border-border"
                        }`}
                      >
                        <p className="text-xs font-semibold text-foreground">{addr.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{addr.full_address}</p>
                        <p className="text-xs text-muted-foreground">{addr.area}</p>
                      </motion.button>
                    ))}
                    <button
                      onClick={() => setShowNewAddress(true)}
                      className="w-full rounded-xl border border-dashed border-primary/40 p-3 flex items-center justify-center gap-2"
                    >
                      <Plus className="h-4 w-4 text-primary" />
                      <span className="text-sm text-primary font-medium">Add New Address</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Checkout;
