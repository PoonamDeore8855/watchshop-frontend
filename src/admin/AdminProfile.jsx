import React from "react";
import { User, Mail, Shield, Calendar, Clock, MapPin, Phone } from "lucide-react";

export default function AdminProfile() {
    const adminEmail = localStorage.getItem("adminEmail") || "admin@watchshop.com";
    const joinDate = "October 24, 2024"; // Simulated
    const lastActive = new Date().toLocaleString();

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* 🎩 PROFILE HEADER */}
            <div className="relative h-48 bg-gradient-to-r from-[#1e1b4b] to-[#4338ca] rounded-[3rem] overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                <div className="absolute -bottom-12 left-12">
                    <div className="w-32 h-32 bg-white p-2 rounded-[2.5rem] shadow-xl">
                        <div className="w-full h-full bg-purple-100 rounded-[2rem] flex items-center justify-center text-purple-700 text-4xl font-black">
                            {adminEmail.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-16 px-12 pb-12 bg-white rounded-[3rem] shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">System Admin</h1>
                        <p className="text-purple-600 font-bold tracking-[0.2em] uppercase text-xs mt-1">Luxe Boutique Master Access</p>
                    </div>
                    <button className="px-6 py-3 bg-gray-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95">
                        Update Credentials
                    </button>
                </div>

                <div className="grid md:grid-cols-2 gap-8">

                    {/* ACCOUNT DETAILS */}
                    <div className="space-y-6">
                        <h3 className="text-[10px] font-black text-gray-400 tracking-[0.3em] uppercase italic px-2">Account Overview</h3>

                        <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 flex items-center gap-5 group hover:bg-white hover:shadow-md transition-all">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-purple-600 shadow-sm group-hover:scale-110 transition-transform">
                                <Mail size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Email Protocol</p>
                                <p className="text-sm font-black text-gray-900">{adminEmail}</p>
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 flex items-center gap-5 group hover:bg-white hover:shadow-md transition-all">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-green-600 shadow-sm group-hover:scale-110 transition-transform">
                                <Shield size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Access Level</p>
                                <p className="text-sm font-black text-gray-900 uppercase">Super Administrator</p>
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 flex items-center gap-5 group hover:bg-white hover:shadow-md transition-all">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                                <Calendar size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Commencement</p>
                                <p className="text-sm font-black text-gray-900">{joinDate}</p>
                            </div>
                        </div>
                    </div>

                    {/* ADDITIONAL INFO */}
                    <div className="space-y-6">
                        <h3 className="text-[10px] font-black text-gray-400 tracking-[0.3em] uppercase italic px-2">System Status</h3>

                        <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 flex items-center gap-5 group hover:bg-white hover:shadow-md transition-all">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-orange-600 shadow-sm group-hover:scale-110 transition-transform">
                                <Clock size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Last Secure Login</p>
                                <p className="text-sm font-black text-gray-900">{lastActive}</p>
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 flex items-center gap-5 group hover:bg-white hover:shadow-md transition-all">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Headquarters</p>
                                <p className="text-sm font-black text-gray-900">Zurich, Switzerland</p>
                            </div>
                        </div>

                        <div className="p-6 bg-[#f0f9ff] rounded-[2rem] border border-blue-100 flex items-center gap-5">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                            <p className="text-[10px] font-black text-blue-700 uppercase tracking-[0.2em] italic">System Encrypted & Encapsulated</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
