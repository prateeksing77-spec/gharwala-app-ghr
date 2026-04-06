import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import BottomNav from "@/components/BottomNav";

const statusMap: Record<string, { label: string; color: string }> = {
  placed: { label: "Order Placed", color: "hsl(142, 71%, 45%)" },
  confirmed: { label: "Confirmed", color: "hsl(38, 92%, 50%)" },
  out_for_delivery: { label: "Out for Delivery", color: "hsl(200, 80%, 50%)" },
  delivered: { label: "Delivered", color: "hsl(142, 71%, 45%)" },
};

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const { data: { user } } = await supabase.auth.getUser();
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

  return (
    <div className="min-h-screen bg-background pb-[70px]">
      <div className="sticky top-0 z-30 bg-background border-b border-border px-4 py-3">
        <h1 className="text-lg font-bold text-foreground">My Orders</h1>
      </div>

      {loading ? (
        <div className="px-4 pt-4 space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center pt-24 px-6">
          <Package className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-lg font-semibold text-foreground mb-1">No orders yet</h2>
          <p className="text-sm text-muted-foreground mb-6">Place your first order!</p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="rounded-xl bg-primary px-8 py-3 text-sm font-bold text-primary-foreground"
          >
            Start Shopping
          </motion.button>
        </div>
      ) : (
        <div className="px-4 pt-4 space-y-3">
          {orders.map((order, i) => {
            const status = statusMap[order.status] || statusMap.placed;
            const items = Array.isArray(order.items) ? order.items : [];
            const expanded = expandedId === order.id;
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-border bg-card overflow-hidden"
              >
                <button
                  onClick={() => setExpandedId(expanded ? null : order.id)}
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
                          {new Date(order.created_at).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ color: status.color, backgroundColor: `${status.color}20` }}
                      >
                        {status.label}
                      </span>
                      {expanded ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-border mt-2">
                    <span className="text-muted-foreground">
                      {items.length} item{items.length !== 1 ? "s" : ""} • {order.payment_method?.toUpperCase()}
                    </span>
                    <span className="font-bold text-foreground">₹{order.total}</span>
                  </div>
                </button>

                {expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="border-t border-border px-4 pb-4 pt-2 space-y-2"
                  >
                    {items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-xs">
                        <span className="text-muted-foreground">
                          {item.name} × {item.quantity}
                        </span>
                        <span className="text-foreground">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-border space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="text-foreground">₹{order.subtotal}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Delivery</span>
                        <span className={order.delivery_charge === 0 ? "text-primary" : "text-foreground"}>
                          {order.delivery_charge === 0 ? "FREE" : `₹${order.delivery_charge}`}
                        </span>
                      </div>
                    </div>
                    {order.delivery_address && (
                      <div className="pt-2 border-t border-border">
                        <p className="text-xs text-muted-foreground">
                          📍 {(order.delivery_address as any).full_address}, {(order.delivery_address as any).area}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default Orders;
