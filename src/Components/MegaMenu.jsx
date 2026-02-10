import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

export default function MegaMenu() {
  const [openMenu, setOpenMenu] = useState(null);
  const navRef = useRef(null);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  // 🔥 CLICK OUTSIDE TO CLOSE
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const categories = {
    mens: {
      icon: "👔",
      items: [
        { name: "Analog Watches", badge: "Popular" },
        { name: "Digital Watches", badge: null },
        { name: "Luxury Watches", badge: "Premium" },
        { name: "Sport Watches", badge: null },
        { name: "Chronograph", badge: null },
        { name: "Smart Watches", badge: "New" }
      ]
    },
    women: {
      icon: "👗",
      items: [
        { name: "Classic Watches", badge: null },
        { name: "Fashion Watches", badge: "Trending" },
        { name: "Luxury Collection", badge: "Premium" },
        { name: "Smart Watches", badge: "New" }
      ]
    },
    kids: {
      icon: "🎒",
      items: [
        { name: "Boys Watches", badge: null },
        { name: "Girls Watches", badge: null },
        { name: "Digital Watches", badge: "Fun" }
      ]
    },
    leather: {
      icon: "🎨",
      items: [
        { name: "Brown Strap", badge: null },
        { name: "Black Strap", badge: null },
        { name: "Premium Leather", badge: "Luxury" },
        { name: "Classic Leather", badge: null },
        { name: "Vintage Leather", badge: "Special" },
        { name: "Executive Style", badge: null },
        { name: "Minimal Leather", badge: "Trending" }
      ]
    },
    smart: {
      icon: "⌚",
      items: [
        { name: "Fitness Watches", badge: "Hot" },
        { name: "Android Compatible", badge: null },
        { name: "iOS Compatible", badge: null },
        { name: "Apple Watch Series 9", badge: "New" },
        { name: "Samsung Galaxy Watch 6", badge: null },
        { name: "Noise ColorFit Pro", badge: null },
        { name: "boAt Xtend", badge: null },
        { name: "Fire-Boltt Ninja", badge: null },
        { name: "Amazfit GTR", badge: null }
      ]
    },
    collection: {
      icon: "✨",
      items: [
        { name: "New Arrivals", badge: "Fresh" },
        { name: "Best Sellers", badge: "Popular" },
        { name: "Limited Edition", badge: "Exclusive" }
      ]
    }
  };

  return (
    <nav
      ref={navRef}
      className="border-t border-gray-100 bg-white shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-center gap-1 py-3">
          {Object.entries(categories).map(([key, data]) => (
            <div key={key} className="relative group">
              <button
                onClick={() => toggleMenu(key)}
                style={{ color: openMenu === key ? "#7c3aed" : "#000000", opacity: 1 }}
                className={`flex items-center gap-2 px-5 py-2.5 text-sm uppercase tracking-wide rounded-lg transition-all duration-200
                  ${openMenu === key
                    ? "bg-purple-50"
                    : "font-black hover:bg-gray-100"
                  }
                `}
              >
                <span className="text-lg">{data.icon}</span>
                <span>{key}</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${openMenu === key ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* DROPDOWN MENU */}
              {openMenu === key && (
                <div className="absolute left-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 min-w-[280px] animate-fadeIn">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-3">
                    <h3 className="text-white font-bold text-sm uppercase tracking-wide flex items-center gap-2">
                      <span className="text-xl">{data.icon}</span>
                      {key} Watches
                    </h3>
                  </div>

                  {/* Items */}
                  <ul className="p-2 max-h-[400px] overflow-y-auto">
                    {data.items.map((item, index) => (
                      <li key={index}>
                        <Link
                          to="/watches"
                          onClick={() => setOpenMenu(null)}
                          className="flex items-center justify-between px-4 py-2.5 rounded-lg hover:bg-purple-50 hover:text-purple-700 transition-all group/item"
                        >
                          <span className="text-sm font-black text-black group-hover/item:text-purple-800">
                            {item.name}
                          </span>
                          {item.badge && (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-black rounded-md uppercase">
                              {item.badge}
                            </span>
                          )}
                          <svg
                            className="w-4 h-4 text-gray-400 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </li>
                    ))}
                  </ul>

                  {/* Footer */}
                  <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
                    <Link
                      to="/watches"
                      onClick={() => setOpenMenu(null)}
                      className="text-sm font-bold text-purple-600 hover:text-purple-700 flex items-center gap-2 transition-all"
                    >
                      View All {key} Watches
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
