import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, MessageCircle, CheckCircle, Circle, Package, Truck, ChefHat } from 'lucide-react';
import { useAppStore } from '@/stores/cartStore';
import BottomNav from '@/components/BottomNav';

const steps = [
  { key: 'placed', label: 'Order Placed', icon: Package },
  { key: 'confirmed', label: 'Order Confirmed', icon: CheckCircle },
  { key: 'preparing', label: 'Preparing', icon: ChefHat },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle },
];

const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const order = useAppStore((s) => s.orders.find((o) => o.id === orderId));

  if (!order) return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="text-muted-foreground">Order not found</p>
    </div>
  );

  const currentIndex = steps.findIndex((s) => s.key === order.status);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-30 flex items-center gap-3 bg-background/95 backdrop-blur-sm px-4 py-3">
        <button onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5 text-foreground" /></button>
        <h1 className="text-lg font-bold text-foreground">Track Order</h1>
      </div>

      <div className="px-4 space-y-6">
        <div className="rounded-lg bg-surface p-4 space-y-1">
          <p className="text-sm text-muted-foreground">Order ID</p>
          <p className="text-lg font-bold text-primary">{order.id}</p>
          <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleString()}</p>
        </div>

        {/* Stepper */}
        <div className="space-y-0">
          {steps.map((step, i) => {
            const completed = i <= currentIndex;
            const isCurrent = i === currentIndex;
            const StepIcon = step.icon;
            return (
              <div key={step.key} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${completed ? 'bg-primary' : 'bg-surface-elevated'} ${isCurrent ? 'animate-pulse-glow' : ''}`}>
                    {completed ? <StepIcon className="h-4 w-4 text-primary-foreground" /> : <Circle className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  {i < steps.length - 1 && <div className={`h-8 w-0.5 ${i < currentIndex ? 'bg-primary' : 'bg-border'}`} />}
                </div>
                <div className="pb-6">
                  <p className={`text-sm font-medium ${completed ? 'text-foreground' : 'text-muted-foreground'}`}>{step.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Details */}
        <div className="rounded-lg bg-surface p-4 space-y-2">
          <h3 className="font-bold text-foreground">Order Details</h3>
          {order.items.map((item) => (
            <div key={item.product.id} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{item.product.name} x{item.quantity}</span>
              <span className="text-foreground">Rs.{item.product.price * item.quantity}</span>
            </div>
          ))}
          <div className="border-t border-border pt-2 flex justify-between font-bold">
            <span className="text-foreground">Total</span>
            <span className="text-foreground">Rs.{order.total}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary py-3 font-semibold text-primary-foreground">
            <Phone className="h-4 w-4" /> Call
          </button>
          <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-surface py-3 font-semibold text-foreground">
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default OrderTracking;
