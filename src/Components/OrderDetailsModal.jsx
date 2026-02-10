import { useEffect, useState } from "react";
import axios from "axios";
import { X, ShoppingBag, Clock, CheckCircle, AlertCircle } from "lucide-react";

export default function OrderDetailsModal({ orderId, isOpen, onClose }) {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && orderId) {
            fetchOrderDetails();
        }
    }, [isOpen, orderId]);

    const fetchOrderDetails = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`/api/orders/${orderId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrder(res.data);
        } catch (err) {
            console.error("Error fetching order details:", err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div
                className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* HEADER */}
                <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">Order Details</h2>
                        <p className="text-xs font-bold text-gray-400 mt-1 flex items-center gap-2">
                            IDENTIFIER <span className="text-purple-600">#{orderId}</span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-2xl transition-all active:scale-90"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* CONTENT */}
                <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="mt-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Retrieving data...</p>
                        </div>
                    ) : order?.items?.length > 0 ? (
                        <div className="space-y-4">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100 group hover:border-purple-200 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-1 italic">Masterpiece</p>
                                            <h3 className="text-lg font-black text-gray-900 leading-tight">{item.productName}</h3>
                                            <div className="mt-3 flex items-center gap-4">
                                                <p className="text-xs font-bold text-gray-500">
                                                    Quantity: <span className="text-gray-900">{item.quantity}</span>
                                                </p>
                                                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                                <p className="text-xs font-bold text-gray-500">
                                                    Unit Price: <span className="text-gray-900">₹{item.price?.toLocaleString()}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-black text-gray-900 tracking-tighter">₹{(item.price * item.quantity).toLocaleString()}</p>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Subtotal</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                            <ShoppingBag size={40} className="mx-auto text-gray-300 mb-4" />
                            <p className="text-lg font-black text-gray-400 uppercase tracking-tighter">No items found for this order.</p>
                            <p className="text-xs font-bold text-gray-300 mt-2 uppercase tracking-widest">Synchronicity Error or Empty Dataset</p>
                        </div>
                    )}
                </div>

                {/* FOOTER */}
                {order && (
                    <div className="p-8 bg-gray-50 border-t border-gray-100">
                        <div className="space-y-4">
                            {/* CUSTOMER INFO - MEESHO STYLE */}
                            <div className="pb-4 border-b border-dashed border-gray-200">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Customer Information</p>
                                <div className="flex flex-wrap gap-x-8 gap-y-2">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase">Name</p>
                                        <p className="text-sm font-black text-gray-900">{order.userName || 'Valued Customer'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase">Contact</p>
                                        <p className="text-sm font-black text-gray-900">{order.email}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2">
                                {order.discountAmount > 0 && (
                                    <div className="flex justify-between items-center text-xs mb-3">
                                        <span className="font-black text-emerald-600 uppercase tracking-widest italic">Privilege Saving ({order.promoCode})</span>
                                        <span className="font-black text-emerald-600">- ₹{order.discountAmount?.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-[10px] font-black text-purple-600 uppercase tracking-[0.3em]">Total Investment</p>
                                        <p className="text-3xl font-black text-gray-900 tracking-tighter mt-1">₹{order.totalAmount?.toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="px-4 py-2 rounded-xl text-[10px] font-black uppercase border border-gray-200 bg-white text-gray-600">
                                            Order Status: {order.status || 'PROCESSING'}
                                        </div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Ordered on {new Date(order.orderDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
