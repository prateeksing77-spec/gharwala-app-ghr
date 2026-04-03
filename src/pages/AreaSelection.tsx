import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Bell, Loader2, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AreaSelection = () => {
  const navigate = useNavigate();
  const [areas, setAreas] = useState<{ id: string; area_name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [showNotify, setShowNotify] = useState(false);
  const [phone, setPhone] = useState("");
  const [areaName, setAreaName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase
      .from("serviceable_areas")
      .select("id, area_name")
      .eq("is_active", true)
      .order("area_name")
      .then(({ data }) => {
        setAreas(data || []);
        setLoading(false);
      });
  }, []);

  const handleSelect = (area: string) => {
    setSelected(area);
    localStorage.setItem("kiraney-area", area);
    setTimeout(() => navigate("/", { replace: true }), 400);
  };

  const handleNotify = async () => {
    if (!/^[6-9]\d{9}$/.test(phone)) {
      toast.error("Enter a valid 10-digit phone number");
      return;
    }
    if (!areaName.trim()) {
      toast.error("Enter your area name");
      return;
    }
    setSubmitting(true);
    await supabase.from("notify_requests").insert({ phone, area_name: areaName });
    setSubmitting(false);
    toast.success("We'll notify you when we launch in your area!");
    setShowNotify(false);
    setPhone("");
    setAreaName("");
  };

  return (
    <div className="min-h-screen bg-background px-5 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <MapPin className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Select Your Delivery Area</h1>
          <p className="text-muted-foreground text-sm">Choose your area to see available products</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {areas.map((area, i) => (
              <motion.button
                key={area.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleSelect(area.area_name)}
                className={`relative flex items-center gap-2.5 rounded-xl border p-3.5 text-left transition-all ${
                  selected === area.area_name
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span className="text-sm font-medium text-foreground truncate">{area.area_name}</span>
                {selected === area.area_name && (
                  <CheckCircle className="h-4 w-4 text-primary absolute top-2 right-2" />
                )}
              </motion.button>
            ))}
          </div>
        )}

        <div className="text-center pt-2">
          <button
            onClick={() => setShowNotify(!showNotify)}
            className="text-sm text-primary font-medium"
          >
            Can't find your area? Notify me
          </button>
        </div>

        <AnimatePresence>
          {showNotify && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 overflow-hidden"
            >
              <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Bell className="h-4 w-4 text-primary" />
                  Get notified when we launch
                </div>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="Phone number"
                  type="tel"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
                />
                <input
                  value={areaName}
                  onChange={(e) => setAreaName(e.target.value)}
                  placeholder="Your area name"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
                />
                <button
                  onClick={handleNotify}
                  disabled={submitting}
                  className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Notify Me"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AreaSelection;
