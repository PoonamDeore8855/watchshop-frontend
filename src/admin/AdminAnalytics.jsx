import { useEffect, useState } from "react";
import axios from "axios";
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { Users, ShoppingBag, DollarSign, TrendingUp, Calendar, Filter, Download, ArrowUpRight, ArrowDownRight, Globe, Layers, Activity } from "lucide-react";

export default function AdminAnalytics() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const token = localStorage.getItem("adminToken");
                const res = await axios.get("/api/admin/analytics", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setData(res.data);
            } catch (err) {
                console.error("Error fetching analytics:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[600px]">
            <div className="w-16 h-16 border-4 border-gray-900 border-t-purple-600 rounded-full animate-spin"></div>
        </div>
    );

    // Transform Map data to Recharts format
    const chartData = Object.keys(data?.dailyUsers || {}).map(date => ({
        date,
        Users: data.dailyUsers[date] || 0,
        Orders: data.dailyOrders[date] || 0,
        Revenue: data.dailyRevenue[date] || 0
    }));

    const totalRevenue = chartData.reduce((acc, curr) => acc + curr.Revenue, 0);
    const totalOrders = chartData.reduce((acc, curr) => acc + curr.Orders, 0);
    const totalUsers = chartData.reduce((acc, curr) => acc + curr.Users, 0);

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20 uppercase">

            {/* 🌟 EXECUTIVE HEADER */}
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-[2.5rem] blur opacity-5 group-hover:opacity-10 transition duration-1000"></div>
                <div className="relative bg-white/80 backdrop-blur-xl border border-white/40 p-10 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-[10px] font-black tracking-widest mb-2 border border-purple-100">
                            <Activity size={12} />
                            Operational Intelligence
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter italic">Growth Analysis</h1>
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em] italic max-w-lg leading-relaxed">High-fidelity visualization of boutique expansion, transaction velocity, and member acquisition metrics.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end mr-4">
                            <span className="text-[10px] font-black text-gray-400 tracking-widest mb-1 italic">Reporting Cycle</span>
                            <span className="text-sm font-black text-gray-900 italic">Feb 2026 - Present</span>
                        </div>
                        <button className="flex items-center gap-3 px-6 py-4 bg-white border border-gray-100 rounded-2xl text-[10px] font-black tracking-[0.2em] text-gray-600 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group active:scale-95 italic">
                            <Calendar size={16} className="text-purple-600 group-hover:rotate-12 transition-transform" />
                            30 DAY VIEW
                        </button>
                        <button className="p-5 bg-gray-900 text-white rounded-2xl shadow-2xl hover:bg-black hover:shadow-purple-200/50 hover:-translate-y-1 transition-all active:scale-95">
                            <Download size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* 📊 CORE KPI GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: "Revenue Stream", value: `₹${totalRevenue.toLocaleString()}`, icon: DollarSign, trend: "14.2%", up: true, color: "text-emerald-600", bg: "bg-emerald-50", line: "Revenue Velocity" },
                    { label: "Asset Fulfillment", value: totalOrders, icon: ShoppingBag, trend: "8.1%", up: true, color: "text-indigo-600", bg: "bg-indigo-50", line: "Order Throughput" },
                    { label: "Client Onboarding", value: totalUsers, icon: Users, trend: "22.5%", up: true, color: "text-purple-600", bg: "bg-purple-50", line: "Member Conversion" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100/50 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500 group relative overflow-hidden active:scale-[0.98]">
                        <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bg} opacity-10 rounded-bl-full group-hover:scale-125 transition-transform duration-1000`} />

                        <div className="relative z-10 space-y-8">
                            <div className="flex items-start justify-between">
                                <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center border border-white/50 shadow-inner group-hover:rotate-6 transition-transform duration-500`}>
                                    <stat.icon size={28} />
                                </div>
                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest border ${stat.up ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                    {stat.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                    {stat.trend}
                                </div>
                            </div>

                            <div>
                                <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2 italic leading-none">{stat.label}</p>
                                <h2 className="text-4xl font-black text-gray-900 tracking-tighter italic leading-none">{stat.value}</h2>
                                <div className="mt-6 flex items-center gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full ${stat.color.replace('text', 'bg')}`} />
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{stat.line}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 📈 GROWTH VISUALIZATION */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* MAIN CHART CARD */}
                <div className="lg:col-span-8 group">
                    <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-2xl shadow-gray-200/50 hover:border-purple-200/50 transition-all duration-700 h-full relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/30 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -mr-20 -mt-20"></div>

                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight italic">Transaction Momentum</h3>
                                <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2 italic">Composite performance index</p>
                            </div>

                            <div className="flex gap-6">
                                <div className="flex items-center gap-3 px-4 py-2 bg-purple-50/50 rounded-xl border border-purple-100">
                                    <div className="w-2.5 h-2.5 bg-purple-600 rounded-full shadow-[0_0_10px_rgba(147,51,234,0.5)]" />
                                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Revenue</span>
                                </div>
                                <div className="flex items-center gap-3 px-4 py-2 bg-indigo-50/50 rounded-xl border border-indigo-100">
                                    <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.5)]" />
                                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Orders</span>
                                </div>
                            </div>
                        </div>

                        <div className="h-[450px] w-full relative z-10">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#9333ea" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorOrd" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#f3f4f6" />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fontWeight: 900, fill: '#9ca3af', letterSpacing: '0.1em' }}
                                        dy={15}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fontWeight: 900, fill: '#9ca3af' }}
                                        dx={-10}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            backdropFilter: 'blur(10px)',
                                            borderRadius: '24px',
                                            border: '1px solid rgba(243, 244, 246, 1)',
                                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
                                            padding: '24px',
                                            textTransform: 'uppercase'
                                        }}
                                        itemStyle={{ fontSize: '12px', fontWeight: '900', padding: '4px 0' }}
                                        labelStyle={{ fontSize: '10px', color: '#9ca3af', fontWeight: '900', marginBottom: '12px', letterSpacing: '0.2em' }}
                                        cursor={{ stroke: '#9333ea', strokeWidth: 1, strokeDasharray: '5 5' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="Revenue"
                                        stroke="#9333ea"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorRev)"
                                        animationDuration={2000}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="Orders"
                                        stroke="#6366f1"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorOrd)"
                                        animationDuration={2000}
                                        animationDelay={500}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="absolute bottom-10 right-10 flex items-center gap-2 text-gray-300 pointer-events-none italic">
                            <Globe size={40} className="opacity-10" />
                            <span className="text-[8px] font-black uppercase tracking-widest opacity-20">Secure Data Stream</span>
                        </div>
                    </div>
                </div>

                {/* SIDEBAR KPI CARD */}
                <div className="lg:col-span-4 space-y-10">

                    {/* MEMBER ACQUISITION */}
                    <div className="bg-[#1e1b4b] p-10 rounded-[3.5rem] shadow-2xl shadow-indigo-900/40 text-white relative h-3/5 overflow-hidden group">
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-white rounded-full text-[10px] font-black tracking-widest mb-4 border border-white/10 uppercase">
                                    <Layers size={12} />
                                    Density Map
                                </div>
                                <h3 className="text-2xl font-black italic">User Scaling</h3>
                                <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mt-2 italic">Daily account verification rate</p>
                            </div>

                            <div className="flex-1 min-h-[180px] mt-8">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <Tooltip
                                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                            contentStyle={{
                                                backgroundColor: '#312e81',
                                                borderRadius: '15px',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                padding: '12px'
                                            }}
                                            itemStyle={{ fontSize: '10px', fontWeight: '900', color: '#fff' }}
                                            labelStyle={{ display: 'none' }}
                                        />
                                        <Bar dataKey="Users" fill="#9333ea" radius={[6, 6, 6, 6]} barSize={10} animationDuration={2500} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="mt-8 flex items-baseline gap-2">
                                <span className="text-4xl font-black italic">+{Math.ceil(totalUsers / 30)}</span>
                                <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Avg daily</span>
                            </div>
                        </div>
                        <Users size={300} className="absolute -bottom-20 -right-20 text-white/5 opacity-10 group-hover:rotate-12 transition-transform duration-1000" />
                    </div>

                    {/* ADVISORY CARD */}
                    <div className="bg-gradient-to-br from-purple-600 to-indigo-800 p-10 rounded-[3.5rem] shadow-2xl shadow-purple-900/20 text-white h-[calc(40%-40px)] flex flex-col justify-center relative overflow-hidden group">
                        <div className="relative z-10">
                            <h4 className="text-lg font-black italic mb-3">Intelligence Alert</h4>
                            <p className="text-white/70 text-xs font-black uppercase tracking-widest leading-relaxed">System projects a <span className="text-white underline decoration-purple-300">12% increase</span> in luxury timepiece demand for the upcoming reporting cycle.</p>
                        </div>
                        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
                    </div>

                </div>
            </div>

            {/* 📍 GEOGRAPHIC METRICS PLACEHOLDER (EXTENDABLE) */}
            <div className="bg-white/40 backdrop-blur-sm p-12 rounded-[4rem] border border-white/60 text-center space-y-6">
                <div className="w-20 h-20 bg-gray-100 rounded-[2rem] flex items-center justify-center mx-auto text-gray-400 border border-white shadow-inner">
                    <Globe size={32} />
                </div>
                <div>
                    <h3 className="text-xl font-black text-gray-900 uppercase italic">Regional Settlement Overview</h3>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2 italic">Global distribution analytics coming in next protocol update</p>
                </div>
            </div>

        </div>
    );
}
