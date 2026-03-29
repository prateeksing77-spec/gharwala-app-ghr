import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, CheckCheck } from 'lucide-react';
import { useAppStore } from '@/stores/cartStore';
import BottomNav from '@/components/BottomNav';

const Notifications = () => {
  const navigate = useNavigate();
  const { notifications, markAllRead } = useAppStore();

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-30 flex items-center justify-between bg-background/95 backdrop-blur-sm px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5 text-foreground" /></button>
          <h1 className="text-lg font-bold text-foreground">Notifications</h1>
        </div>
        <button onClick={markAllRead} className="flex items-center gap-1 text-sm text-primary">
          <CheckCheck className="h-4 w-4" /> Mark all read
        </button>
      </div>

      <div className="px-4 space-y-2">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Bell className="h-16 w-16 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">No notifications</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className={`rounded-lg p-4 ${n.read ? 'bg-surface' : 'bg-primary/10 border border-primary/20'}`}>
              <div className="flex items-start gap-3">
                {!n.read && <div className="mt-1.5 h-2 w-2 rounded-full bg-primary flex-shrink-0" />}
                <div>
                  <p className="text-sm font-medium text-foreground">{n.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default Notifications;
