import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLayoutEffect, useEffect, useState } from "react";
import gsap from "gsap";
import MegaMenu from "./MegaMenu";
import AddToCartIcon from "./AddToCartIcon";

export default function Main() {
  const [scrolled, setScrolled] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // 🔐 SAFE logged-in user
  let user = null;
  try {
    const storedUser = localStorage.getItem("user");
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (e) {
    user = null;
  }

  // 🛡️ Admin check
  const isAdmin = localStorage.getItem("admin") === "true";
  useEffect(() => {
    const loadCart = () => {
      try {
        const storedCart = localStorage.getItem("cart");
        const cart = storedCart ? JSON.parse(storedCart) : [];
        setCartItems(cart);
      } catch (e) {
        setCartItems([]);
      }
    };

    loadCart();

    window.addEventListener("storage", loadCart);
    window.addEventListener("cartUpdated", loadCart);

    return () => {
      window.removeEventListener("storage", loadCart);
      window.removeEventListener("cartUpdated", loadCart);
    };
  }, []);

  // 🎬 GSAP animation
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".nav-logo > *", {
        y: 10,
        duration: 0.4,
        ease: "power2.out",
      });

      /* Disable animations to ensure instant visibility
      gsap.from(".nav-menu > *", {
        y: 10,
        stagger: 0.1,
        duration: 0.4,
        ease: "power2.out",
      });
      */
    });

    return () => ctx.revert();
  }, []);

  // 🌫 Scroll blur effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ⌨️ ESC key to close search modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && searchOpen) {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [searchOpen]);

  // 🔓 LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("admin");
    navigate("/login");
  };

  const location = useLocation();

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 py-2
        ${scrolled
          ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100"
          : "bg-white border-b border-gray-100"
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex items-center h-22">

          {/* ========== LOGO ========== */}
          <Link to="/" className="nav-logo flex items-center gap-3 group flex-shrink-0">
            {/* Logo Icon */}
            <div className="relative w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" strokeWidth="2" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l3.5 2" />
              </svg>
            </div>

            {/* Logo Text */}
            <div className="flex flex-col leading-tight">
              <span className="text-2xl font-[900] text-black tracking-tighter">
                WatchShop
              </span>
              <span className="text-[11px] font-bold text-purple-600 uppercase tracking-widest mt-1">
                Premium Timepieces
              </span>
            </div>
          </Link>

          {/* ========== CENTER NAVIGATION ========== */}
          <nav className="hidden md:flex items-center gap-2 nav-menu flex-1 justify-center px-8">
            {[
              { path: "/", label: "Home" },
              { path: "/watches", label: "Watches" },
              { path: "/brands", label: "Brands" },
              { path: "/sale", label: "Sale", badge: "HOT" },
              { path: "/contact", label: "Contact" }
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                style={{ color: location.pathname === item.path ? "#7c3aed" : "#000000", opacity: 1 }}
                className={`relative px-4 py-2 text-base font-black rounded-lg transition-all duration-200
                  ${location.pathname === item.path
                    ? "bg-purple-50 shadow-sm"
                    : "hover:bg-gray-100"
                  }
                `}
              >
                {item.label}
                {item.badge && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-red-500 text-white text-[9px] font-black rounded-md">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* ========== RIGHT ACTIONS ========== */}
          <div className="flex items-center gap-3 flex-shrink-0">

            {/* Search Icon */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden md:flex items-center justify-center w-10 h-10 text-black hover:bg-gray-50 border border-transparent hover:border-gray-100 rounded-full transition-all"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* User Menu */}
            {!user ? (
              <Link
                to="/login"
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold text-sm hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Login
              </Link>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-5 py-2.5 text-black hover:bg-gray-50 rounded-full font-black text-[10px] uppercase tracking-widest transition-all italic border border-transparent hover:border-gray-100"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-5 py-2.5 text-red-600 hover:bg-red-50 rounded-full font-black text-[10px] uppercase tracking-widest transition-all italic border border-transparent hover:border-red-100"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center gap-2 px-6 py-2.5 bg-white border border-purple-200 text-purple-700 rounded-full font-black text-[9px] uppercase tracking-[0.25em] hover:bg-purple-50 transition-all shadow-xl shadow-purple-100 active:scale-95 italic group"
                  >
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-pulse group-hover:scale-125 transition-transform" />
                    Admin Panel
                  </Link>
                )}
              </div>
            )}

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative flex items-center justify-center w-10 h-10 text-black hover:text-red-600 hover:bg-red-50/50 border border-transparent hover:border-red-100 rounded-full transition-all"
              aria-label="Wishlist"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Link>

            {/* Cart Icon */}
            <AddToCartIcon cartItems={cartItems} />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 text-white hover:bg-white/10 rounded-lg transition-all"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* ========== MOBILE MENU ========== */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-2">
            {[
              { path: "/", label: "Home" },
              { path: "/watches", label: "Watches" },
              { path: "/brands", label: "Brands" },
              { path: "/sale", label: "Sale" },
              { path: "/contact", label: "Contact" }
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg font-semibold transition-all
                  ${location.pathname === item.path
                    ? "bg-white/20 text-white"
                    : "text-white hover:bg-white/10"
                  }
                `}
              >
                {item.label}
              </Link>
            ))}

            <div className="border-t border-gray-100 pt-2 mt-2">
              {!user ? (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold text-center"
                >
                  Login
                </Link>
              ) : (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 text-white hover:bg-white/10 rounded-lg font-black"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-semibold"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* MEGA MENU only on HOME */}
      {location.pathname === "/" && <MegaMenu />}

      {/* ========== SEARCH MODAL ========== */}
      {searchOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-start justify-center pt-20 px-4">
          {/* Modal */}
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[600px] flex flex-col animate-slideDown">
            {/* Search Header */}
            <div className="flex items-center gap-4 p-6 border-b border-gray-200">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search for watches, brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="flex-1 text-lg outline-none placeholder-gray-400 font-medium"
              />
              <button
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery("");
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Search Results */}
            <div className="flex-1 overflow-y-auto p-6">
              {searchQuery.trim() === "" ? (
                // Quick Links
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Quick Links</h3>
                  <div className="space-y-2">
                    {[
                      { label: "All Watches", path: "/watches", icon: "⌚" },
                      { label: "Premium Brands", path: "/brands", icon: "👑" },
                      { label: "Sale Items", path: "/sale", icon: "🔥" },
                      { label: "Contact Us", path: "/contact", icon: "📞" }
                    ].map((link) => (
                      <button
                        key={link.path}
                        onClick={() => {
                          navigate(link.path);
                          setSearchOpen(false);
                          setSearchQuery("");
                        }}
                        className="w-full flex items-center gap-3 p-3 hover:bg-purple-50 rounded-xl transition-all text-left"
                      >
                        <span className="text-2xl">{link.icon}</span>
                        <span className="font-semibold text-gray-900">{link.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                // Search Results
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
                    Search Results for "{searchQuery}"
                  </h3>

                  <div className="space-y-3">
                    {[
                      { name: "Rolex Submariner", price: 45000, category: "Luxury" },
                      { name: "Omega Speedmaster", price: 38000, category: "Professional" },
                      { name: "Cartier Tank", price: 32000, category: "Elegant" },
                      { name: "Tissot PRX", price: 15000, category: "Classic" }
                    ]
                      .filter((item) =>
                        item.name.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((item, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            navigate("/watches");
                            setSearchOpen(false);
                            setSearchQuery("");
                          }}
                          className="w-full flex items-center justify-between p-4 hover:bg-purple-50 rounded-xl transition-all text-left border border-gray-100"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="9" strokeWidth="2" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l3.5 2" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900">{item.name}</h4>
                              <p className="text-sm text-gray-500">{item.category}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-purple-600">₹{item.price.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">View Details</p>
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
