import React, { useEffect, useState } from "react";
import axios from "axios";
import { CreditCard, ArrowLeft, Mail, Package, Hash, Calendar, ShieldCheck } from "lucide-react";

export default function AdminTransactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("adminToken");
            const res = await axios.get("/api/transactions/admin/all", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTransactions(res.data);
        } catch (err) {
            console.error("Error loading transactions:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in duration-500 pb-20 uppercase">
            {/* 🌟 HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Payment History</h1>
                    <p className="text-gray-500 font-medium mt-1">Audit and monitor all platform transactions and payment cycles.</p>
                </div>
                <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-gray-400 tracking-widest leading-none">Global Volume</span>
                        <span className="text-lg font-black text-gray-900 leading-none mt-1">{transactions.length}</span>
                    </div>
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                        <CreditCard size={20} />
                    </div>
                </div>
            </div>

            {transactions.length === 0 ? (
                <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-gray-100 text-center uppercase">
                    <CreditCard size={64} className="mx-auto text-gray-200 mb-6" />
                    <p className="text-xl font-black text-gray-300 tracking-tight uppercase">Ledger is empty</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-[2.5rem] bg-white border border-gray-100 shadow-2xl shadow-gray-100/50">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/80 border-b border-gray-100">
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">User Details</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Order Details</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Amount</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic text-center">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic text-center">Method</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic text-right">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {transactions.map((t) => (
                                <tr key={t.id} className="hover:bg-indigo-50/30 transition-colors group">
                                    <td className="px-8 py-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-black">
                                                {t.user?.username?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-900 leading-tight">{t.user?.username}</p>
                                                <p className="text-[10px] font-bold text-gray-400 lowercase">{t.user?.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 border border-gray-100 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                                                <Hash size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-900">Order #{t.orderId}</p>
                                                <p className="text-[10px] font-bold text-gray-400 mt-1 italic lowercase">Payment ID: {t.razorpayPaymentId}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <p className="text-lg font-black text-gray-900 italic">₹{t.amount?.toLocaleString()}</p>
                                    </td>
                                    <td className="px-8 py-8 text-center">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest flex items-center justify-center gap-1.5 mx-auto w-fit
                      ${t.paymentStatus === 'SUCCESS' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            <ShieldCheck size={12} />
                                            {t.paymentStatus}
                                        </span>
                                    </td>
                                    <td className="px-8 py-8 text-center text-xs font-black text-gray-400 italic">
                                        {t.paymentMethod}
                                    </td>
                                    <td className="px-8 py-8 text-right">
                                        <div className="flex flex-col items-end">
                                            <span className="text-xs font-black text-gray-900 tracking-tight">{new Date(t.transactionDate).toLocaleDateString()}</span>
                                            <span className="text-[10px] font-bold text-gray-400 italic mt-1">{new Date(t.transactionDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
