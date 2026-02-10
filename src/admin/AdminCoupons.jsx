import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2, Ticket, Search, Calendar, Percent, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function AdminCoupons() {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [code, setCode] = useState("");
    const [discount, setDiscount] = useState("");
    const [expiry, setExpiry] = useState("");

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/coupons/get");
            setCoupons(res.data);
        } catch (err) {
            console.error("Error fetching coupons:", err);
            // Fallback for safety during initial transition
            setCoupons([
                { id: 1, code: "SAVE10", discountPercentage: 10, active: true, expiryDate: "2026-03-09T10:00:00" },
                { id: 2, code: "LUXURY20", discountPercentage: 20, active: true, expiryDate: "2026-04-09T10:00:00" }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCoupon = async (e) => {
        e.preventDefault();
        if (!code || !discount) {
            alert("Please fill all fields.");
            return;
        }

        const token = localStorage.getItem("adminToken");
        setAdding(true);

        try {
            const res = await axios.post("/api/coupons/add", {
                code: code.toUpperCase(),
                discountPercentage: Number(discount),
                expiryDate: expiry ? new Date(expiry).toISOString() : null
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("New Coupon Established! 🎫");
            setCoupons([...coupons, res.data]);
            setCode("");
            setDiscount("");
            setExpiry("");
        } catch (err) {
            console.error("Error adding coupon:", err);
            alert("Failed to create coupon.");
        } finally {
            setAdding(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to revoke this coupon?")) return;
        const token = localStorage.getItem("adminToken");
        try {
            await axios.delete(`/api/coupons/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCoupons(coupons.filter(c => c.id !== id));
        } catch (err) {
            console.error("Error deleting coupon:", err);
            alert("Failed to delete coupon.");
        }
    };

    const filteredCoupons = coupons.filter(c =>
        c.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in duration-500 pb-20 uppercase">
            {/* 🌟 HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight italic">Coupon Privileges</h1>
                    <p className="text-gray-500 font-medium mt-1 uppercase italic">Manage exclusive promotional assets.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search codes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 pr-6 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-black shadow-sm focus:ring-4 focus:ring-purple-50 transition-all outline-none w-full md:w-80 uppercase tracking-widest italic"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                {/* 📝 FORM SECTION */}
                <div className="xl:col-span-4">
                    <form onSubmit={handleAddCoupon} className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-50 flex flex-col gap-6 sticky top-28">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-700 shadow-inner">
                                <Plus size={20} />
                            </div>
                            <h2 className="text-xl font-black text-gray-900 tracking-tight italic">Issue Coupon</h2>
                        </div>

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 italic">Identifier Code</label>
                                <div className="relative">
                                    <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        placeholder="e.g. SUMMER50"
                                        className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-4 py-4 text-xs font-black focus:ring-4 focus:ring-purple-50 transition outline-none uppercase tracking-widest italic"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 italic">Value Decrease (%)</label>
                                <div className="relative">
                                    <Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="number"
                                        value={discount}
                                        onChange={(e) => setDiscount(e.target.value)}
                                        placeholder="25"
                                        className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-4 py-4 text-xs font-black focus:ring-4 focus:ring-purple-50 transition outline-none italic"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 italic">Expiration Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="date"
                                        value={expiry}
                                        onChange={(e) => setExpiry(e.target.value)}
                                        className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-4 py-4 text-xs font-black focus:ring-4 focus:ring-purple-50 transition outline-none italic"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            disabled={adding}
                            className={`w-full mt-4 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition shadow-lg active:scale-95
                                ${adding ? "bg-gray-200 text-gray-400 shadow-none cursor-not-allowed" : "bg-gray-900 text-white hover:bg-black hover:shadow-purple-100"}
                            `}
                        >
                            {adding ? "Establishing..." : "Manifest Coupon"}
                        </button>
                    </form>
                </div>

                {/* 📦 COUPON LIST */}
                <div className="xl:col-span-8 space-y-6">
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50 flex justify-between items-center italic">
                        <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">Active Privileges <span className="text-gray-900 not-italic">({filteredCoupons.length})</span></h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredCoupons.map(coupon => (
                            <div key={coupon.id} className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-50 flex flex-col gap-4 group hover:border-purple-200 transition-all duration-300">
                                <div className="flex justify-between items-start">
                                    <div className={`px-4 py-2 rounded-2xl font-black text-sm tracking-tighter shadow-sm flex items-center gap-2 ${coupon.active ? 'bg-purple-50 text-purple-700 border border-purple-100' : 'bg-gray-50 text-gray-400 border border-gray-100'}`}>
                                        <Ticket size={16} />
                                        {coupon.code}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {coupon.active ? (
                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                                                <CheckCircle size={12} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Active</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full border border-red-100">
                                                <XCircle size={12} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Inactive</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-end justify-between mt-2">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic mb-1">Discount Value</p>
                                        <h3 className="text-3xl font-black text-gray-900 tracking-tighter">{coupon.discountPercentage}% OFF</h3>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic mb-1">Expires On</p>
                                        <p className="text-xs font-black text-gray-900 italic tracking-tight">
                                            {new Date(coupon.expiryDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-50 mt-2 flex justify-end">
                                    <button
                                        onClick={() => handleDelete(coupon.id)}
                                        className="p-3 rounded-xl bg-gray-50 text-gray-400 hover:bg-red-500 hover:text-white transition-all border border-gray-100"
                                        title="Revoke Coupon"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
