import { useAppStore } from '@/stores/cartStore';
import { Package, ChevronRight } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

const statusColors: Record<string, string> = {
  placed: 'bg-primary/10 text-primary',
  confirmed: 'bg-secondary/10 text-secondary',
  out_for_delivery: 'bg-primary/10 text-primary',
  delivered: 'bg-secondary/10 text-secondary',
};

const statusLabels: Record<string, string> = {
  placed: 'Processing',
  confirmed: 'Confirmed',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
};

const Orders = () => {
  const { orders } = useAppStore();

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="px-4 pt-6">
        <h1 className="text-xl font-bold text-foreground mb-4">My Orders</h1>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center py-16">
            <Package className="h-16 w-16 text-muted-foreground/30 mb-3" />
            <p className="text-lg font-semibold text-foreground">No orders yet</p>
            <p className="text-sm text-muted-foreground mt-1">Your orders will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-foreground">{order.id}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[order.status] || 'bg-muted text-muted-foreground'}`}>
                    {statusLabels[order.status] || order.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
                <div className="text-xs text-muted-foreground mb-2">
                  {order.items.length} item{order.items.length > 1 ? 's' : ''}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-base font-bold text-foreground">₹{order.total}</span>
                  <span className="text-xs text-muted-foreground">Cash on Delivery</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default Orders;
