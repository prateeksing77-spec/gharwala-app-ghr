import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, Search } from 'lucide-react';
import { useAppStore } from '@/stores/cartStore';
import { categories, categorySections } from '@/data/categories';
import { areas } from '@/data/products';
import BottomNav from '@/components/BottomNav';
import CartBar from '@/components/CartBar';
import BannerCarousel from '@/components/BannerCarousel';

const tabs = ['All', 'Seasonal', 'Local Specials'];

const Home = () => {
  const navigate = useNavigate();
  const { selectedArea, setArea, unreadCount } = useAppStore();
  const [activeTab, setActiveTab] = useState('All');
  const [showAreaPicker, setShowAreaPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSections = activeTab === 'Local Specials'
    ? categorySections.filter((s) => s.id === 'local')
    : activeTab === 'Seasonal'
    ? categorySections.filter((s) => s.id === 'grocery' || s.id === 'local')
    : categorySections;

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm px-4 pt-3 pb-2">
        <div className="flex items-center justify-between">
          <button onClick={() => setShowAreaPicker(!showAreaPicker)} className="flex items-center gap-1">
            <div>
              <p className="text-xs text-muted-foreground">Deliver to</p>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-foreground">{selectedArea}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </button>
          <button onClick={() => navigate('/notifications')} className="relative p-2">
            <Bell className="h-6 w-6 text-foreground" />
            {unreadCount() > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                {unreadCount()}
              </span>
            )}
          </button>
        </div>

        {showAreaPicker && (
          <div className="mt-2 rounded-lg border border-border bg-surface p-2">
            {areas.map((area) => (
              <button key={area} onClick={() => { setArea(area); setShowAreaPicker(false); }}
                className={`block w-full rounded px-3 py-2 text-left text-sm ${area === selectedArea ? 'bg-primary/20 text-primary' : 'text-foreground hover:bg-surface-elevated'}`}>
                {area}
              </button>
            ))}
          </div>
        )}

        {/* Search */}
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-surface px-3 py-2.5">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search atta, dal, rice..."
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>

        {/* Tabs */}
        <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeTab === tab ? 'bg-primary text-primary-foreground' : 'bg-surface text-muted-foreground'
              }`}
            >
              {tab}
              {tab === 'Seasonal' && (
                <span className="ml-1 rounded bg-accent px-1 py-0.5 text-[9px] font-bold text-accent-foreground">NEW</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-3 space-y-6">
        <BannerCarousel />

        {filteredSections.map((section) => {
          const sectionCats = categories.filter((c) => c.section === section.id);
          if (searchQuery) {
            const q = searchQuery.toLowerCase();
            const filtered = sectionCats.filter((c) => c.name.toLowerCase().includes(q));
            if (filtered.length === 0) return null;
          }
          return (
            <div key={section.id}>
              <div className="mb-3 flex items-center gap-2">
                <h2 className={`text-lg font-bold ${section.isGold ? 'text-accent' : 'text-foreground'}`}>
                  {section.name}
                </h2>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {sectionCats.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => navigate(`/category/${cat.id}`)}
                    className={`flex flex-col items-center gap-1.5 rounded-lg p-2.5 transition-colors ${
                      section.isGold ? 'border border-accent/30 bg-accent/5 hover:bg-accent/10' : 'bg-surface hover:bg-surface-elevated'
                    }`}
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${section.isGold ? 'bg-accent/20' : 'bg-primary/20'}`}>
                      <span className={`text-lg ${section.isGold ? 'text-accent' : 'text-primary'}`}>
                        {cat.name.charAt(0)}
                      </span>
                    </div>
                    <span className="text-center text-[10px] font-medium leading-tight text-foreground">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <CartBar />
      <BottomNav />
    </div>
  );
};

export default Home;
