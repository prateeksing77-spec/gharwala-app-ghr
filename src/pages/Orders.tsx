import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Clock,
  ChevronDown,
  ChevronUp,
  Phone,
  MapPin,
  HelpCircle,
  XCircle,
  RotateCcw,
  Bike,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAppStore } from "@/stores/cartStore";
import { Skeleton } from "@/components/ui/skeleton";
import BottomNav from "@/components/BottomNav";
import { toast } from "sonner";

const statusSteps = [
  { key: "placed", label: "Order Placed", emoji: "📦" },
  { key: "confirmed", label: "Accepted", emoji: "✅" },
  { key: "out_for_delivery", label: "Out for Delivery", emoji: "🚴" },
  { key: "delivered", label: "Delivered", emoji: "🏠" },
];

const statusIndex = (s: string) => statusSteps.findIndex((st) => st.key === s);

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"active" | "past">("active");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const addToCart = useAppStore((s) => s.addToCart);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setOrders(data || []);
    setLoading(false);
  };

  const activeOrders = orders.filter(
    (o) => !["delivered", "cancelled"].includes(o.status || "")
  );
  const pastOrders = orders.filter((o) =>
    ["delivered", "cancelled"].includes(o.status || "")
  );

  const currentList = tab === "active" ? activeOrders : pastOrders;

  const handleReorder = (order: any) => {
    const items = Array.isArray(order.items) ? order.items : [];
    let added = 0;
    items.forEach((item: any) => {
      if (item.name && item.price) {
        addToCart({
          id: item.product_id || item.id || crypto.randomUUID(),
          name: item.name,
          brand: item.brand || "",
          category: "",
          price: item.price,
          mrp: item.mrp,
          unit: item.unit || "pc",
          weight: item.weight,
          image: item.image || item.image_url || "",
          in_stock: true,
        });
        added++;
      }
    });
    if (added > 0) toast.success(`${added} items added to cart`);
    else toast.error("Could not reorder items");
  };

  const handleCancel = async (orderId: string) => {
    setCancellingId(null);
    // In a real app this would call an API. For now just show toast.
    toast.success("Order cancellation requested");
  };

  const formatTime = (ts: string) =>
    new Date(ts).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="min-h-screen bg-background pb-[70px]">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background border-b border-border px-4 py-3">
        <h1 className="text-lg font-bold text-foreground">My Orders</h1>
      </div>

      {/* Tabs */}
      <div className="relative flex border-b border-border">
        {(["active", "past"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 py-3 text-sm font-medium text-center transition-colors relative"
            style={{
              color:
                tab === t
                  ? "hsl(142, 71%, 45%)"
                  : "hsl(var(--muted-foreground))",
            }}
          >
            {t === "active" ? "Active" : "Past Orders"}
            {tab === t && (
              <motion.div
                layoutId="ordersTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              />
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="px-4 pt-4 space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : currentList.length === 0 ? (
        <div className="flex flex-col items-center justify-center pt-24 px-6">
          <Package className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-lg font-semibold text-foreground mb-1">
            {tab === "active" ? "No active orders" : "No past orders"}
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            {tab === "active"
              ? "Place your first order!"
              : "Your completed orders will appear here"}
          </p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="rounded-xl bg-primary px-8 py-3 text-sm font-bold text-primary-foreground"
          >
            Order Now
          </motion.button>
        </div>
      ) : (
        <div className="px-4 pt-4 space-y-3">
          <AnimatePresence mode="popLayout">
            {currentList.map((order, i) => {
              const items = Array.isArray(order.items) ? order.items : [];
              const expanded = expandedId === order.id;
              const currentIdx = statusIndex(order.status || "placed");
              const isCancelled = order.status === "cancelled";

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-xl border border-border bg-card overflow-hidden"
                >
                  {/* Summary */}
                  <button
                    onClick={() =>
                      setExpandedId(expanded ? null : order.id)
                    }
                    className="w-full p-4 text-left"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-bold text-foreground font-mono">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {formatTime(order.created_at)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isCancelled ? (
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full text-destructive bg-destructive/10">
                            Cancelled
                          </span>
                        ) : order.status === "delivered" ? (
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full text-primary bg-primary/10">
                            Delivered ✅
                          </span>
                        ) : null}
                        {expanded ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>

                    {/* Progress bar for active orders */}
                    {tab === "active" && !isCancelled && (
                      <div className="mt-3 flex items-center gap-1">
                        {statusSteps.map((step, si) => {
                          const done = si <= currentIdx;
                          const isCurrent = si === currentIdx;
                          return (
                            <div key={step.key} className="flex-1 flex flex-col items-center gap-1">
                              <div className="w-full flex items-center">
                                <div
                                  className={`h-1.5 w-full rounded-full transition-all ${
                                    done ? "bg-primary" : "bg-muted"
                                  }`}
                                >
                                  {isCurrent && (
                                    <motion.div
                                      animate={{ opacity: [0.4, 1, 0.4] }}
                                      transition={{ repeat: Infinity, duration: 1.5 }}
                                      className="h-full rounded-full bg-primary"
                                    />
                                  )}
                                </div>
                              </div>
                              <span className="text-[9px] text-muted-foreground text-center leading-tight">
                                {step.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Items summary + total */}
                    <div className="flex justify-between text-sm pt-2 border-t border-border mt-3">
                      <span className="text-muted-foreground text-xs">
                        {items.slice(0, 2).map((it: any) => it.name).join(", ")}
                        {items.length > 2 && ` +${items.length - 2} more`}
                      </span>
                      <span className="font-bold text-foreground">
                        ₹{order.total}
                      </span>
                    </div>
                  </button>

                  {/* Expanded Detail */}
                  {expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className="border-t border-border px-4 pb-4 pt-3 space-y-3"
                    >
                      {/* Status timeline */}
                      {!isCancelled && (
                        <div className="space-y-2 pl-2">
                          {statusSteps.map((step, si) => {
                            const done = si <= currentIdx;
                            const isCurrent = si === currentIdx;
                            return (
                              <div key={step.key} className="flex items-start gap-3">
                                <div className="flex flex-col items-center">
                                  <div
                                    className={`h-5 w-5 rounded-full flex items-center justify-center text-xs ${
                                      done
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-muted-foreground"
                                    }`}
                                  >
                                    {isCurrent ? (
                                      <motion.span
                                        animate={{ scale: [1, 1.3, 1] }}
                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                      >
                                        {step.emoji}
                                      </motion.span>
                                    ) : done ? (
                                      "✓"
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                  {si < statusSteps.length - 1 && (
                                    <div
                                      className={`w-0.5 h-4 ${
                                        done ? "bg-primary" : "bg-muted"
                                      }`}
                                    />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p
                                    className={`text-xs font-medium ${
                                      done
                                        ? "text-foreground"
                                        : "text-muted-foreground"
                                    }`}
                                  >
                                    {step.label}
                                  </p>
                                  {done && (
                                    <p className="text-[10px] text-muted-foreground">
                                      {si === 0 ? formatTime(order.created_at) : "—"}
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Delivery person (mock) */}
                      {order.status === "out_for_delivery" && (
                        <div className="rounded-lg border border-border p-3 flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Bike className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-medium text-foreground">
                              Delivery Partner
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              Ramesh K.
                            </p>
                          </div>
                          <a
                            href="tel:+919876543210"
                            className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center"
                          >
                            <Phone className="h-4 w-4 text-primary" />
                          </a>
                        </div>
                      )}

                      {/* Items list */}
                      <div className="space-y-1">
                        {items.map((item: any, idx: number) => (
                          <div
                            key={idx}
                            className="flex justify-between text-xs"
                          >
                            <span className="text-muted-foreground">
                              {item.name} × {item.quantity}
                            </span>
                            <span className="text-foreground">
                              ₹{item.price * item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Bill */}
                      <div className="pt-2 border-t border-border space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">
                            Subtotal
                          </span>
                          <span className="text-foreground">
                            ₹{order.subtotal}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">
                            Delivery
                          </span>
                          <span
                            className={
                              order.delivery_charge === 0
                                ? "text-primary"
                                : "text-foreground"
                            }
                          >
                            {order.delivery_charge === 0
                              ? "FREE"
                              : `₹${order.delivery_charge}`}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-foreground">Total</span>
                          <span className="text-foreground">
                            ₹{order.total}
                          </span>
                        </div>
                      </div>

                      {/* Address */}
                      {order.delivery_address && (
                        <div className="flex items-start gap-2 pt-2 border-t border-border">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
                          <p className="text-xs text-muted-foreground">
                            {(order.delivery_address as any).full_address},{" "}
                            {(order.delivery_address as any).area}
                          </p>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex gap-2 pt-2">
                        {tab === "past" && (
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleReorder(order)}
                            className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-primary py-2 text-xs font-medium text-primary"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                            Reorder
                          </motion.button>
                        )}
                        {order.status === "placed" && (
                          <>
                            {cancellingId === order.id ? (
                              <div className="flex-1 flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">
                                  Cancel order?
                                </span>
                                <button
                                  onClick={() => handleCancel(order.id)}
                                  className="text-xs font-medium text-destructive"
                                >
                                  Yes
                                </button>
                                <button
                                  onClick={() => setCancellingId(null)}
                                  className="text-xs font-medium text-muted-foreground"
                                >
                                  No
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setCancellingId(order.id)}
                                className="flex items-center gap-1 text-xs text-destructive"
                              >
                                <XCircle className="h-3.5 w-3.5" />
                                Cancel
                              </button>
                            )}
                          </>
                        )}
                        <a
                          href="https://wa.me/919876543210"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-primary"
                        >
                          <HelpCircle className="h-3.5 w-3.5" />
                          Need Help?
                        </a>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default Orders;
