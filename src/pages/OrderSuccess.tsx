import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Package, Home as HomeIcon } from "lucide-react";


const confettiColors = ["#22c55e", "#f59e0b", "#3b82f6", "#ef4444", "#a855f7", "#ec4899"];

const Particle = ({ index }: { index: number }) => {
  const angle = (index / 20) * Math.PI * 2;
  const distance = 60 + Math.random() * 80;
  const x = Math.cos(angle) * distance;
  const y = Math.sin(angle) * distance;
  const color = confettiColors[index % confettiColors.length];
  const size = 4 + Math.random() * 6;

  return (
    <motion.div
      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
      animate={{ x, y, opacity: 0, scale: 0 }}
      transition={{ duration: 1.2, delay: 0.2 + index * 0.02, ease: "easeOut" }}
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        top: "50%",
        left: "50%",
        marginTop: -size / 2,
        marginLeft: -size / 2,
      }}
    />
  );
};

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId, total } = (location.state as any) || {};


  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      {/* Confetti */}
      <div className="relative">
        {Array.from({ length: 20 }).map((_, i) => (
          <Particle key={i} index={i} />
        ))}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 10, stiffness: 100, delay: 0.1 }}
        >
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
            >
              <CheckCircle className="h-14 w-14 text-primary" />
            </motion.div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-6"
      >
        <h1 className="text-2xl font-bold text-foreground mb-1">Order Placed Successfully! 🎉</h1>
        {orderId && (
          <p className="text-sm text-muted-foreground mb-1">
            Order ID: <span className="font-mono font-medium text-foreground">{orderId.slice(0, 8).toUpperCase()}</span>
          </p>
        )}
        {total && (
          <p className="text-sm text-muted-foreground">Cash on Delivery • ₹{total}</p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-4 rounded-xl border border-border bg-card p-4 w-full flex items-center gap-3"
      >
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Package className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">Estimated Delivery</p>
          <p className="text-xs text-muted-foreground">30-45 minutes</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="mt-6 w-full space-y-3"
      >
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/orders")}
          className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground flex items-center justify-center gap-2"
        >
          <Package className="h-4 w-4" />
          Track Order
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/")}
          className="w-full rounded-xl border border-border bg-card py-3.5 text-sm font-medium text-foreground flex items-center justify-center gap-2"
        >
          <HomeIcon className="h-4 w-4" />
          Continue Shopping
        </motion.button>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;
