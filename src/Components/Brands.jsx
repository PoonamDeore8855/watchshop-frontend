import { useNavigate } from "react-router-dom";

export default function Brands() {
    const navigate = useNavigate();

    const brands = [
        {
            name: "Rolex",
            desc: "The pinnacle of Swiss luxury watchmaking. Rolex represents unparalleled precision, prestige, and timeless design excellence.",
            established: "1905",
            specialty: "Luxury Swiss Timepieces",
            bgColor: "bg-gradient-to-br from-amber-50 to-yellow-50"
        },
        {
            name: "Omega",
            desc: "Pioneers of space exploration timing. Omega watches combine innovative technology with Swiss precision engineering.",
            established: "1848",
            specialty: "Professional Swiss Watches",
            bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50"
        },
        {
            name: "Cartier",
            desc: "Where jewelry meets horology. Cartier crafts elegant timepieces that embody French luxury and sophistication.",
            established: "1847",
            specialty: "Luxury Jewelry Watches",
            bgColor: "bg-gradient-to-br from-red-50 to-pink-50"
        },
        {
            name: "Tissot",
            desc: "Swiss watchmaking heritage since 1853. Tissot offers exceptional quality and innovation at accessible prices.",
            established: "1853",
            specialty: "Swiss Made Watches",
            bgColor: "bg-gradient-to-br from-slate-50 to-gray-50"
        },
        {
            name: "Fossil",
            desc: "American vintage-inspired design. Fossil creates contemporary lifestyle watches with classic American spirit.",
            established: "1984",
            specialty: "Lifestyle Watches",
            bgColor: "bg-gradient-to-br from-orange-50 to-amber-50"
        },
        {
            name: "Seiko",
            desc: "Japanese innovation and precision. Seiko leads the industry with groundbreaking technology and reliability.",
            established: "1881",
            specialty: "Japanese Precision",
            bgColor: "bg-gradient-to-br from-indigo-50 to-purple-50"
        },
        {
            name: "Aurelius Time",
            desc: "Italian craftsmanship redefined. Premium timepieces that blend traditional elegance with modern performance.",
            established: "2015",
            specialty: "Italian Luxury",
            bgColor: "bg-gradient-to-br from-emerald-50 to-teal-50"
        },
        {
            name: "Zenithra",
            desc: "German engineering excellence. High-performance watches built for durability and sophisticated aesthetics.",
            established: "2018",
            specialty: "Performance Watches",
            bgColor: "bg-gradient-to-br from-violet-50 to-purple-50"
        },
        {
            name: "Velora",
            desc: "Swiss luxury for everyday life. Sophisticated timepieces that balance premium design with practical comfort.",
            established: "2016",
            specialty: "Contemporary Swiss",
            bgColor: "bg-gradient-to-br from-rose-50 to-pink-50"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">

            {/* ================= PROFESSIONAL HEADER ================= */}
            <section className="relative bg-gradient-to-br from-purple-700 via-purple-600 to-purple-700 pt-32 pb-16 px-8 overflow-hidden">
                {/* Animated Background */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-full text-sm font-semibold mb-6 border border-white/30">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            Premium Watch Brands
                        </div>

                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                            World-Class Watch Brands
                        </h1>
                        <p className="text-xl text-purple-100 max-w-3xl mx-auto">
                            Discover our curated collection of prestigious watchmakers from around the globe. Each brand represents decades of craftsmanship, innovation, and excellence.
                        </p>
                    </div>

                    {/* Stats Bar */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
                        <div className="text-center p-4 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
                            <div className="text-3xl font-bold text-white">9+</div>
                            <div className="text-sm text-purple-100 font-medium">Premium Brands</div>
                        </div>
                        <div className="text-center p-4 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
                            <div className="text-3xl font-bold text-white">1,200+</div>
                            <div className="text-sm text-purple-100 font-medium">Watch Models</div>
                        </div>
                        <div className="text-center p-4 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
                            <div className="text-3xl font-bold text-white">100%</div>
                            <div className="text-sm text-purple-100 font-medium">Authentic</div>
                        </div>
                        <div className="text-center p-4 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
                            <div className="text-3xl font-bold text-white">50K+</div>
                            <div className="text-sm text-purple-100 font-medium">Happy Clients</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= BRANDS GRID - PROFESSIONAL CARDS ================= */}
            <section className="px-8 md:px-16 py-16">
                <div className="max-w-7xl mx-auto">

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {brands.map((brand, index) => (
                            <div
                                key={index}
                                className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-purple-200"
                            >
                                {/* Brand Header with Color */}
                                <div className={`${brand.bgColor} p-8 relative`}>
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-16 h-16 bg-white rounded-xl shadow-md flex items-center justify-center">
                                            <span className="text-2xl font-black text-gray-800">
                                                {brand.name.substring(0, 1)}
                                            </span>
                                        </div>
                                        <span className="px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700">
                                            Est. {brand.established}
                                        </span>
                                    </div>

                                    <h3 className="text-3xl font-bold text-gray-900 mb-2">
                                        {brand.name}
                                    </h3>
                                    <p className="text-sm font-medium text-gray-600">
                                        {brand.specialty}
                                    </p>
                                </div>

                                {/* Brand Content */}
                                <div className="p-6">
                                    <p className="text-gray-600 text-sm leading-relaxed mb-6">
                                        {brand.desc}
                                    </p>

                                    {/* Features */}
                                    <div className="space-y-2 mb-6">
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Authentic Guarantee
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            International Warranty
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Certified Pre-owned Available
                                        </div>
                                    </div>

                                    {/* Button */}
                                    <button
                                        onClick={() => navigate("/watches")}
                                        className="w-full py-3 px-4 bg-gray-900 hover:bg-purple-600 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg"
                                    >
                                        Explore Collection
                                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= WHY CHOOSE US ================= */}
            <section className="px-8 md:px-16 py-16 bg-white border-t border-gray-200">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Why Shop With Us
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            We partner with the world's most prestigious brands to bring you authentic luxury timepieces
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl">
                            <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">100% Authentic</h3>
                            <p className="text-gray-600 text-sm">
                                Every watch is guaranteed genuine with official certificates and documentation
                            </p>
                        </div>

                        <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl">
                            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Global Warranty</h3>
                            <p className="text-gray-600 text-sm">
                                International warranty coverage accepted at authorized service centers worldwide
                            </p>
                        </div>

                        <div className="text-center p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
                            <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Secure Payment</h3>
                            <p className="text-gray-600 text-sm">
                                Bank-level encryption and secure payment gateway for your peace of mind
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= CTA SECTION ================= */}
            <section className="px-8 py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-4">
                        Need Expert Guidance?
                    </h2>
                    <p className="text-gray-300 text-lg mb-8">
                        Our watch specialists are here to help you find the perfect timepiece for your collection
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button
                            onClick={() => navigate("/contact")}
                            className="px-8 py-4 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-all shadow-lg"
                        >
                            Contact Specialist
                        </button>
                        <button
                            onClick={() => navigate("/watches")}
                            className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-gray-900 transition-all"
                        >
                            Browse All Watches
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
