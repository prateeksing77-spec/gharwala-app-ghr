import { useNavigate } from 'react-router-dom';
import { User, Package, MapPin, Bell, HelpCircle, Info, Shield, FileText, LogOut, ChevronRight } from 'lucide-react';
import { useAppStore } from '@/stores/cartStore';
import BottomNav from '@/components/BottomNav';

const menuItems = [
  { icon: Package, label: 'My Orders', path: '/orders' },
  { icon: MapPin, label: 'Saved Addresses', path: '/checkout' },
  { icon: Bell, label: 'Notifications', path: '/notifications' },
  { icon: HelpCircle, label: 'Help & Support', path: null },
  { icon: Info, label: 'About KiraNey', path: null },
  { icon: FileText, label: 'Terms & Conditions', path: null },
  { icon: Shield, label: 'Privacy Policy', path: null },
];

const Profile = () => {
  const navigate = useNavigate();
  const { phone, userName, logout } = useAppStore();

  const handleLogout = () => { logout(); navigate('/', { replace: true }); };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-card border-b border-border px-4 pt-6 pb-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary">
            <User className="h-7 w-7 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">{userName}</h2>
            <p className="text-sm text-muted-foreground">+91 {phone}</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-2 space-y-0.5">
        {menuItems.map((item) => (
          <button key={item.label} onClick={() => item.path && navigate(item.path)}
            className="flex w-full items-center justify-between rounded-xl px-3 py-3.5 text-foreground hover:bg-secondary transition-colors">
            <div className="flex items-center gap-3">
              <item.icon className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">{item.label}</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        ))}

        <button onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3.5 text-destructive hover:bg-secondary transition-colors mt-4">
          <LogOut className="h-5 w-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
      <BottomNav />
    </div>
  );
};

export default Profile;
