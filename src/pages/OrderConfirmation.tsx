import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Home } from 'lucide-react';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 10 }}
      >
        <CheckCircle className="h-24 w-24 text-primary" />
      </motion.div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 text-center space-y-2"
      >
        <h1 className="text-2xl font-bold text-foreground">Order Placed!</h1>
        <p className="text-muted-foreground">Your order has been placed successfully</p>
        <p className="text-lg font-bold text-primary">{orderId}</p>
        <p className="text-sm text-muted-foreground">Estimated delivery: 30-45 minutes</p>
      </motion.div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 flex w-full max-w-sm flex-col gap-3"
      >
        <button onClick={() => navigate(`/order-tracking/${orderId}`)}
          className="flex items-center justify-center gap-2 rounded-lg bg-primary py-3 font-semibold text-primary-foreground">
          Track Order <ArrowRight className="h-5 w-5" />
        </button>
        <button onClick={() => navigate('/home')}
          className="flex items-center justify-center gap-2 rounded-lg bg-surface py-3 font-semibold text-foreground">
          <Home className="h-5 w-5" /> Continue Shopping
        </button>
      </motion.div>
    </div>
  );
};

export default OrderConfirmation;
