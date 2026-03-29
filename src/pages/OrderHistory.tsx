import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Package } from 'lucide-react';
import { useAppStore } from '@/stores/cartStore';
import BottomNav from '@/components/BottomNav';

const tabs = ['All', 'Active', 'Delivered'];

const OrderHistory = () => {
  const navigate = useNavigate();
  const orders = useAppStore((s) => s.orders);
  const { addToCart } = useAppStore();
  const [activeTab, setActiveTab] = useState('All');

  const filtered = activeTab === 'All' ? orders
    : activeTab === 'Active' ? orders.filter((o) => o.status !== 'delivered')
    : orders.filter((o) => o.status === 'delivered');

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-30 flex items-center gap-3 bg-background/95 backdrop-blur-sm px-4 py-3">
        <button onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5 text-foreground" /></button>
        <h1 className="text-lg font-bold text-foreground">My Orders</h1>
      </div>

      <div className="px-4">
        <div className="flex gap-2 mb-4">
          {tabs.map((t) => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium ${activeTab === t ? 'bg-primary text-primary-foreground' : 'bg-surface text-muted-foreground'}`}>
              {t}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Package className="h-16 w-16 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((order) => (
              <div key={order.id} className="rounded-lg bg-surface p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-primary">{order.id}</p>
                    <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    order.status === 'delivered' ? 'bg-primary/20 text-primary' : 'bg-accent/20 text-accent'
                  }`}>
                    {order.status.replace(/_/g, ' ').toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{order.items.length} items - Rs.{order.total}</p>
                <div className="flex gap-2">
                  <button onClick={() => navigate(`/order-tracking/${order.id}`)}
                    className="flex-1 rounded-lg border border-border py-2 text-sm font-medium text-foreground">
                    Track
                  </button>
                  <button onClick={() => { order.items.forEach((i) => addToCart(i.product)); navigate('/cart'); }}
                    className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground">
                    <RotateCcw className="h-3.5 w-3.5" /> Reorder
                  </button>
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

export default OrderHistory;
