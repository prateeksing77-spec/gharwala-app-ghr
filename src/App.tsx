import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAppStore } from "@/stores/cartStore";
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Products from "./pages/Products";
import CategoryPage from "./pages/CategoryPage";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderTracking from "./pages/OrderTracking";
import OrderHistory from "./pages/OrderHistory";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = useAppStore((s) => s.isLoggedIn);
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const App = () => (
  <>
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: '#fff',
          color: '#171717',
          border: '1px solid #e5e5e5',
          borderLeft: '3px solid hsl(130, 65%, 20%)',
          borderRadius: '0.75rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        },
      }}
    />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
        <Route path="/category/:id" element={<ProtectedRoute><CategoryPage /></ProtectedRoute>} />
        <Route path="/product/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/order-confirmation/:orderId" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
        <Route path="/order-tracking/:orderId" element={<ProtectedRoute><OrderTracking /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </>
);

export default App;
