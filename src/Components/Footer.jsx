export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 w-full">

      {/* TOP SECTION */}
      <div className="w-full px-16 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        
        {/* BRAND */}
        <div>
          <h3 className="text-white text-xl font-bold mb-3">
            TIMELESS PIECES
          </h3>
          <p className="text-sm leading-relaxed">
            Discover premium watches crafted for elegance, precision,
            and timeless style.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h4 className="text-white font-semibold mb-3">
            Quick Links
          </h4>
          <ul className="space-y-2 text-sm">
            <li>Home</li>
            <li>Brands</li>
            <li>Watches</li>
            <li>Sale</li>
            <li>Contact</li>
          </ul>
        </div>

        {/* CUSTOMER SERVICE */}
        <div>
          <h4 className="text-white font-semibold mb-3">
            Customer Service
          </h4>
          <ul className="space-y-2 text-sm">
            <li>FAQ</li>
            <li>Return Policy</li>
            <li>Shipping</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h4 className="text-white font-semibold mb-3">
            Contact Us
          </h4>
          <p className="text-sm">📍 Pune, India</p>
          <p className="text-sm mt-1">📞 +91 98765 43210</p>
          <p className="text-sm mt-1">✉️ support@timelesspieces.com</p>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-gray-700 text-center py-4 text-xs">
        © {new Date().getFullYear()} Timeless Pieces. All rights reserved.
      </div>
    </footer>
  );
}
