import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { DollarSign, ShoppingCart, Package, Users, TrendingUp, ArrowRight, ShieldCheck } from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get("/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const cards = [
    { label: "Revenue Archive", value: `₹${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", path: "/admin/analytics" },
    { label: "Fulfillment Log", value: stats.totalOrders, icon: ShoppingCart, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100", path: "/admin/orders" },
    { label: "Inventory Map", value: stats.totalProducts, icon: Package, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100", path: "/admin/products" },
    { label: "Member Directory", value: stats.totalUsers, icon: Users, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100", path: "/admin/users" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500 uppercase">

      {/* 🌟 PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Executive Dashboard</h1>
          <p className="text-gray-500 font-medium mt-1 uppercase italic">Consolidated intelligence for the Luxe Boutique.</p>
        </div>
        <div className="flex items-center gap-3 px-5 py-3 bg-white rounded-2xl border border-gray-100 shadow-sm text-[10px] font-black tracking-widest text-gray-400 italic">
          <TrendingUp size={16} className="text-green-500" />
          <span>Real-time Sync Active</span>
        </div>
      </div>

      {/* 📊 STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <div
            key={idx}
            onClick={() => navigate(card.path)}
            className={`bg-white p-8 rounded-[2.5rem] border ${card.border} shadow-xl shadow-gray-100/50 hover:shadow-2xl hover:shadow-gray-200/50 transition-all group overflow-hidden relative cursor-pointer active:scale-95 duration-500`}
          >
            <div className={`absolute top-0 right-0 w-24 h-24 ${card.bg} opacity-10 rounded-bl-[4rem] group-hover:scale-125 transition-transform duration-700`} />

            <div className="flex flex-col gap-8 relative z-10">
              <div className={`w-14 h-14 ${card.bg} ${card.color} rounded-2xl flex items-center justify-center shadow-inner`}>
                <card.icon size={28} />
              </div>
              <div>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2 italic leading-none">{card.label}</p>
                <h2 className="text-3xl font-black text-gray-900 tracking-tighter italic leading-none">{card.value}</h2>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 🛠️ QUICK ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">

        <div className="group relative">
          <div className="absolute inset-0 bg-purple-600 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-10 transition-opacity" />
          <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100/50 relative overflow-hidden flex flex-col justify-between h-full hover:border-purple-200 transition-all duration-500">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-[10px] font-black tracking-widest mb-4">
                <ShieldCheck size={12} />
                Secured Module
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">Cataloque Intelligence</h3>
              <p className="text-gray-500 text-xs font-medium leading-loose max-w-[340px] italic">Refine the boutique's exclusive collection, manage inventory reserves, and calibrate premium pricing strategies.</p>
            </div>
            <button
              onClick={() => navigate('/admin/products')}
              className="mt-12 flex items-center gap-4 w-fit px-8 py-5 bg-gray-900 text-white rounded-[1.8rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-gray-200 hover:bg-black hover:-translate-y-1 transition-all group/btn"
            >
              Navigate to Products
              <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
            </button>
            <Package size={240} className="absolute -bottom-16 -right-16 text-gray-50 group-hover:text-purple-50 group-hover:scale-110 transition-all duration-1000 rotate-12" />
          </div>
        </div>

        <div className="group relative">
          <div className="absolute inset-0 bg-indigo-600 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-20 transition-opacity" />
          <div className="bg-gradient-to-br from-indigo-600 to-purple-800 p-10 rounded-[3rem] shadow-2xl shadow-indigo-100 relative overflow-hidden flex flex-col justify-between h-full">
            <div className="relative z-10 text-white">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-white rounded-full text-[10px] font-black tracking-widest mb-4">
                <TrendingUp size={12} />
                High Priority
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tight">Fulfillment Protocol</h3>
              <p className="text-white/70 text-xs font-medium leading-loose max-w-[340px] italic">Monitor global transaction flow, authorize fulfillment cycles, and audit client relationship metadata.</p>
            </div>
            <button
              onClick={() => navigate('/admin/orders')}
              className="mt-12 flex items-center gap-4 w-fit px-8 py-5 bg-white text-indigo-700 rounded-[1.8rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-900/20 hover:bg-indigo-50 hover:-translate-y-1 transition-all group/btn"
            >
              Initiate Fulfillment
              <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
            </button>
            <ShoppingCart size={240} className="absolute -bottom-16 -right-16 text-white/5 group-hover:text-white/10 group-hover:scale-110 transition-all duration-1000 -rotate-12" />
          </div>
        </div>

      </div>
    </div>
  );
}
