import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Mail, Lock, AlertCircle, ChevronRight, UserCheck } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("/api/admin/login", {
        email,
        password
      });

      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("adminEmail", res.data.email);
      localStorage.setItem("admin", "true");

      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Access Denied: Invalid administrative credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9ff] relative overflow-hidden font-sans uppercase">

      {/* 🌌 AMBIENT BACKGROUND ELEMENTS */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-100/50 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px]" />

      <div className="w-full max-w-[480px] px-6 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">

        {/* 🏢 LOGIN CARD */}
        <div className="bg-white/70 backdrop-blur-2xl p-10 md:p-14 rounded-[3.5rem] shadow-2xl shadow-purple-100/50 border border-white relative overflow-hidden">

          {/* Decorative Top Accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600" />

          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gray-900 rounded-[2rem] flex items-center justify-center text-white mx-auto mb-6 shadow-2xl shadow-gray-200 rotate-6 hover:rotate-0 transition-transform duration-500">
              <Shield size={36} className="text-purple-400" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-2 italic">Executive Vault</h2>
            <p className="text-gray-400 text-[10px] font-black tracking-[0.2em] leading-relaxed italic">Administrative Access Protocol Required</p>
          </div>

          {error && (
            <div className="mb-8 p-5 bg-red-50 border border-red-100 rounded-[1.5rem] flex items-center gap-4 animate-in shake duration-500">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 flex-shrink-0">
                <AlertCircle size={18} />
              </div>
              <p className="text-[10px] font-black text-red-700 tracking-wide uppercase italic leading-tight">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-400 tracking-[0.2em] ml-1 mb-2 italic">Personnel ID</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors" size={20} />
                <input
                  type="email"
                  placeholder="name@boutique.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl pl-14 pr-6 py-5 text-sm font-black focus:bg-white focus:ring-4 focus:ring-purple-50 focus:border-purple-200 transition-all outline-none uppercase tracking-widest italic"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-400 tracking-[0.2em] ml-1 mb-2 italic">Access Key</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors" size={20} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl pl-14 pr-6 py-5 text-sm font-black focus:bg-white focus:ring-4 focus:ring-purple-50 focus:border-purple-200 transition-all outline-none italic"
                  required
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full mt-10 bg-gray-900 text-white py-5 rounded-[1.8rem] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-black hover:shadow-2xl hover:shadow-purple-200 active:scale-95 transition-all group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-white/10 to-purple-600/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              {loading ? (
                <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Establish Connection
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 text-center">
            <div className="flex items-center justify-center gap-2 text-gray-300 text-[10px] font-black tracking-widest italic">
              <UserCheck size={12} />
              Boutique Management System v2.4
            </div>
          </div>

        </div>

        {/* 🏷️ FOOTER LINKS */}
        <div className="mt-10 flex justify-between px-4">
          <button
            onClick={() => navigate('/')}
            className="text-[10px] font-black text-gray-400 hover:text-purple-600 tracking-widest transition-colors uppercase italic"
          >
            ← Return to Storefront
          </button>
          <span className="text-[10px] font-black text-gray-300 tracking-widest">© 2026 LUXE</span>
        </div>
      </div>
    </div>
  );
}
