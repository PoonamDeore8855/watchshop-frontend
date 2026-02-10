import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import gsap from "gsap";
import watchVideo from "../assets/watch.mp4";

export default function Hero() {
  const location = useLocation();

  useEffect(() => {
    gsap.fromTo(
      ".hero-text > *",
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
      }
    );

    gsap.fromTo(
      ".hero-image",
      { x: 80, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
      }
    );
  }, [location.pathname]);

  return (
    <section className="relative bg-stone-50 text-white min-h-[70vh] flex items-center px-[90px] overflow-hidden">

      <div className="relative z-10 flex items-center justify-between w-full">

        {/* LEFT CONTENT */}
        <div className="hero-text max-w-lg">
          <h1 className="text-2xl tracking-[0.3em] font-light text-gray-900 mb-3">
            BEST WATCHES
          </h1>

          <h2 className="text-5xl font-normal tracking-wide mb-4 leading-tight text-black">
            Premium Collection
          </h2>

          <p className="text-gray-700 text-sm mb-6 leading-relaxed">
            Swiss precision watches with timeless design and premium craftsmanship.
          </p>

          <div className="flex items-center gap-6">
            <Link to="/login">
              <button className="border border-green-600 text-green-500 px-10 py-3 text-sm tracking-widest font-medium
                                 hover:bg-green-600 hover:text-black transition-all duration-300">
                SHOP NOW
              </button>
            </Link>

            <div>
              <div className="flex items-center gap-1 text-yellow-400 text-sm">
                ★ ★ ★ ★ ★
              </div>
              <p className="text-xs text-gray-400 mt-1">
                4.9 rating · 1,250+ reviews
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT IMAGE WITH BLACK MASK */}
        <div className="relative bg-amber-50 overflow-hidden rounded-2xl shadow-xl w-fit">

          {/* VIDEO */}
          <video
            src={watchVideo}
            autoPlay
            loop
            muted
            playsInline
            className="hero-image w-[580px] h-[330px] object-cover rounded-2xl transition-transform duration-700 hover:scale-105"
          />

          {/* BLACK OVERLAY */}
          <div className="absolute inset-0 bg-black/25 rounded-2xl"></div>

        </div>

      </div>
    </section>
  );
}
