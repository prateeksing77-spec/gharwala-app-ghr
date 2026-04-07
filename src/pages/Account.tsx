import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  MapPin,
  Heart,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  Sun,
  Moon,
  ShoppingBag,
  Wallet,
  MessageCircle,
  Share2,
  Star,
  Info,
  Pencil,
  Trash2,
  Plus,
  X,
  Check,
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";

const Account = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [profile, setProfile] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showAddresses, setShowAddresses] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const area = localStorage.getItem("kiraney-area") || "";

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    setProfile(data);
  };

  const loadAddresses = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false });
    setAddresses(data || []);
  };

  const loadFavorites = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("favorites")
      .select("*, products(*)")
      .eq("user_id", user.id);
    setFavorites(data || []);
  };

  const deleteAddress = async (id: string) => {
    await supabase.from("addresses").delete().eq("id", id);
    toast.success("Address deleted");
    loadAddresses();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("kiraney-user");
    localStorage.removeItem("kiraney-area");
    navigate("/auth", { replace: true });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Kiraney - Grocery Delivery",
          text: "Get groceries delivered in 30 mins! Try Kiraney app.",
          url: window.location.origin,
        });
      } catch {}
    } else {
      toast.info("Share not supported on this device");
    }
  };

  const quickActions = [
    {
      icon: ShoppingBag,
      label: "Orders",
      action: () => navigate("/orders"),
    },
    {
      icon: Wallet,
      label: "Wallet",
      badge: "Soon",
      action: () => toast.info("Wallet coming soon!"),
    },
    {
      icon: MessageCircle,
      label: "Help",
      action: () => window.open("https://wa.me/919876543210", "_blank"),
    },
  ];

  const settingsItems = [
    {
      icon: MapPin,
      label: "Address Book",
      action: () => {
        setShowAddresses(true);
        loadAddresses();
      },
    },
    {
      icon: Heart,
      label: "Favorites",
      action: () => {
        setShowFavorites(true);
        loadFavorites();
      },
    },
    {
      icon: Bell,
      label: "Notifications",
      action: () => navigate("/notifications"),
    },
    {
      icon: Share2,
      label: "Share App",
      action: handleShare,
    },
    {
      icon: Star,
      label: "Rate Us",
      action: () => toast.info("Rating link coming soon"),
    },
    {
      icon: Info,
      label: "About Kiraney",
      sub: "v1.0.0",
      action: () => toast("Kiraney v1.0.0 — Fresh groceries, fast delivery 🚀"),
    },
  ];

  const initials = (profile?.name || "G")[0].toUpperCase();

  return (
    <div className="min-h-screen bg-background pb-[70px]">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background border-b border-border px-4 py-3">
        <h1 className="text-lg font-bold text-foreground">Account</h1>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border bg-card p-4 flex items-center gap-4"
        >
          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
            {initials}
          </div>
          <div className="flex-1">
            <p className="text-base font-semibold text-foreground">
              {profile?.name || "Guest"}
            </p>
            {profile?.phone && (
              <p className="text-sm text-muted-foreground">
                {profile.phone}
              </p>
            )}
            {area && (
              <span className="inline-block text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full mt-1">
                📍 {area}
              </span>
            )}
          </div>
          <button className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          {quickActions.map((qa, i) => (
            <motion.button
              key={qa.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={qa.action}
              className="relative rounded-xl border border-border bg-card p-3 flex flex-col items-center gap-1.5"
            >
              <qa.icon className="h-5 w-5 text-primary" />
              <span className="text-xs font-medium text-foreground">
                {qa.label}
              </span>
              {qa.badge && (
                <span className="absolute top-1.5 right-1.5 text-[8px] font-bold bg-accent text-accent-foreground px-1.5 py-0.5 rounded-full">
                  {qa.badge}
                </span>
              )}
            </motion.button>
          ))}
        </div>

        {/* Theme Toggle */}
        <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              key={theme}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ type: "spring", damping: 10 }}
            >
              {theme === "dark" ? (
                <Moon className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Sun className="h-5 w-5 text-muted-foreground" />
              )}
            </motion.div>
            <span className="text-sm font-medium text-foreground">
              Dark Mode
            </span>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative h-6 w-11 rounded-full transition-colors ${
              theme === "dark" ? "bg-primary" : "bg-muted"
            }`}
          >
            <motion.span
              layout
              className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow"
              style={{ left: theme === "dark" ? 22 : 2 }}
            />
          </button>
        </div>

        {/* Settings List */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {settingsItems.map((item, i) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.04 }}
              onClick={item.action}
              className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-accent transition-colors ${
                i < settingsItems.length - 1
                  ? "border-b border-border"
                  : ""
              }`}
            >
              <item.icon className="h-5 w-5 text-muted-foreground" />
              <span className="flex-1 text-sm font-medium text-foreground text-left">
                {item.label}
              </span>
              {item.sub && (
                <span className="text-xs text-muted-foreground mr-1">
                  {item.sub}
                </span>
              )}
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </motion.button>
          ))}
        </div>

        {/* Logout */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-destructive/30 py-3"
        >
          <LogOut className="h-4 w-4 text-destructive" />
          <span className="text-sm font-medium text-destructive">Logout</span>
        </motion.button>
      </div>

      {/* Logout Confirmation */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-8"
            onClick={() => setShowLogoutConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-2xl p-6 w-full max-w-[320px] space-y-4"
            >
              <h3 className="text-base font-bold text-foreground text-center">
                Logout?
              </h3>
              <p className="text-sm text-muted-foreground text-center">
                Are you sure you want to logout?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium text-foreground"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 rounded-xl bg-destructive py-2.5 text-sm font-medium text-destructive-foreground"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Address Book Sheet */}
      <AnimatePresence>
        {showAddresses && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40"
            onClick={() => setShowAddresses(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-0 left-0 right-0 max-h-[80vh] bg-background rounded-t-2xl overflow-auto"
            >
              <div className="sticky top-0 bg-background border-b border-border px-4 py-3 flex items-center justify-between">
                <h2 className="text-base font-bold text-foreground">
                  Address Book
                </h2>
                <button onClick={() => setShowAddresses(false)}>
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
              <div className="p-4 space-y-3">
                {addresses.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No saved addresses
                  </p>
                ) : (
                  addresses.map((addr, i) => (
                    <motion.div
                      key={addr.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="rounded-xl border border-border bg-card p-3 flex items-start gap-3"
                    >
                      <MapPin className="h-4 w-4 text-primary mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-foreground">
                            {addr.label || "Address"}
                          </span>
                          {addr.is_default && (
                            <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {addr.full_address}
                        </p>
                        {addr.area && (
                          <p className="text-xs text-muted-foreground">
                            {addr.area}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => deleteAddress(addr.id)}
                        className="h-7 w-7 rounded-full bg-destructive/10 flex items-center justify-center"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Favorites Sheet */}
      <AnimatePresence>
        {showFavorites && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40"
            onClick={() => setShowFavorites(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-0 left-0 right-0 max-h-[80vh] bg-background rounded-t-2xl overflow-auto"
            >
              <div className="sticky top-0 bg-background border-b border-border px-4 py-3 flex items-center justify-between">
                <h2 className="text-base font-bold text-foreground">
                  Favorites
                </h2>
                <button onClick={() => setShowFavorites(false)}>
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
              <div className="p-4">
                {favorites.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                      No favorites yet
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {favorites.map((fav: any) => {
                      const p = fav.products;
                      if (!p) return null;
                      return (
                        <div
                          key={fav.id}
                          className="rounded-xl border border-border bg-card p-2.5"
                        >
                          <div className="aspect-square rounded-lg bg-muted mb-2 flex items-center justify-center text-2xl">
                            🛒
                          </div>
                          <p className="text-xs font-medium text-foreground line-clamp-2">
                            {p.name}
                          </p>
                          <p className="text-xs font-bold text-foreground mt-1">
                            ₹{p.price}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
};

export default Account;
