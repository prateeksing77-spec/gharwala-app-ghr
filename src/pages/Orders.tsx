import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, Clock } from "lucide-react";
import { useAppStore } from "@/stores/cartStore";
import BottomNav from "@/components/BottomNav";

const statusMap: Record<string, { label: string; color: string }> = {
  placed: { label: "Order Placed", color: "hsl(var(--primary))" },
  confirmed: { label: "Confirmed", color: "hsl(38, 92%, 50%)" },
  out_for_delivery: { label: "Out for Delivery", color: "hsl(200, 80%, 50%)" },
  delivered: { label: "Delivered", color: "hsl(142, 71%, 45%)" },
};

const Orders = () => {
  const navigate = useNavigate();
  const { orders } = useAppStore();

  return (
    <div className="min-h-screen bg-background pb-[70px]">
      <div className="sticky top-0 z-30 bg-background border-b border-border px-4 py-3">
        <h1 className="text-lg font-bold text-foreground">My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center pt-24 px-6">
          <Package className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-lg font-semibold text-foreground mb-1">No orders yet</h2>
          <p className="text-sm text-muted-foreground mb-6">Place your first order!</p>
          <button
            onClick={() => navigate("/")}
            className="rounded-xl bg-primary px-8 py-3 text-sm font-bold text-primary-foreground"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="px-4 pt-4 space-y-3">
          {orders.map((order, i) => {
            const status = statusMap[order.status] || statusMap.placed;
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-border bg-card p-4 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-bold text-foreground">{order.id}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ color: status.color, backgroundColor: `${status.color}20` }}
                  >
                    {status.label}
                  </span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-border">
                  <span className="text-muted-foreground">
                    {order.items.length} item{order.items.length > 1 ? "s" : ""}
                  </span>
                  <span className="font-bold text-foreground">₹{order.total}</span>
                </div>
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
