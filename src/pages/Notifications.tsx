import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Bell,
  Package,
  Tag,
  Info,
  CheckCheck,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const typeIcons: Record<string, any> = {
  order_update: Package,
  promotion: Tag,
  general: Info,
};

const timeAgo = (ts: string) => {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setNotifications(data || []);
    setLoading(false);
  };

  const markAllRead = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false);
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, is_read: true }))
    );
    toast.success("All marked as read");
  };

  const dismiss = (id: string) => {
    setDismissed((prev) => new Set(prev).add(id));
  };

  const visibleNotifications = notifications.filter(
    (n) => !dismissed.has(n.id)
  );
  const unreadCount = visibleNotifications.filter(
    (n) => !n.is_read
  ).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Notifications</h1>
          {unreadCount > 0 && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
              {unreadCount} new
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1 text-xs font-medium text-primary"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <div className="px-4 pt-4 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : visibleNotifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center pt-24 px-6">
          <Bell className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-lg font-semibold text-foreground mb-1">
            No notifications
          </h2>
          <p className="text-sm text-muted-foreground">
            We'll notify you about orders & offers
          </p>
        </div>
      ) : (
        <div className="px-4 pt-3 space-y-2">
          <AnimatePresence mode="popLayout">
            {visibleNotifications.map((notif, i) => {
              const Icon =
                typeIcons[notif.type || "general"] || Bell;
              return (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -200 }}
                  transition={{ delay: i * 0.04 }}
                  drag="x"
                  dragConstraints={{ left: -100, right: 0 }}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -80) dismiss(notif.id);
                  }}
                  className={`rounded-xl border bg-card p-3 flex items-start gap-3 cursor-grab active:cursor-grabbing ${
                    notif.is_read
                      ? "border-border"
                      : "border-primary/30"
                  }`}
                >
                  <div
                    className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${
                      notif.is_read
                        ? "bg-muted"
                        : "bg-primary/10"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 ${
                        notif.is_read
                          ? "text-muted-foreground"
                          : "text-primary"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p
                        className={`text-sm font-medium truncate ${
                          notif.is_read
                            ? "text-foreground"
                            : "text-foreground"
                        }`}
                      >
                        {notif.title}
                      </p>
                      {!notif.is_read && (
                        <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                      )}
                    </div>
                    {notif.message && (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {notif.message}
                      </p>
                    )}
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {timeAgo(notif.created_at)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Notifications;
