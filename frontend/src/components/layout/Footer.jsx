import { Link } from 'react-router-dom';
import {
  HiOutlineLightningBolt,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineShieldCheck,
} from 'react-icons/hi';

const Footer = () => (
  <footer className="bg-gray-900 text-gray-300 mt-auto footer-hidden-1240">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
              <span className="text-lg font-black text-black">b</span>
            </div>
            <span className="text-xl font-black text-white">blinkit</span>
          </div>
          <p className="text-sm leading-relaxed text-gray-400">
            Grocery delivery in 10 minutes. Fresh, fast and affordable.
          </p>
          <div className="flex items-center gap-2 mt-4 text-yellow-400">
            <HiOutlineLightningBolt className="text-xl" />
            <span className="text-sm font-semibold">10-Minute Delivery</span>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="text-white font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-yellow-400 transition-colors">Home</Link></li>
            <li><Link to="/categories" className="hover:text-yellow-400 transition-colors">Categories</Link></li>
            <li><Link to="/products" className="hover:text-yellow-400 transition-colors">All Products</Link></li>
            <li><Link to="/cart" className="hover:text-yellow-400 transition-colors">Cart</Link></li>
            <li><Link to="/orders" className="hover:text-yellow-400 transition-colors">My Orders</Link></li>
          </ul>
        </div>

        {/* Policies */}
        <div>
          <h4 className="text-white font-bold mb-4">Policies</h4>
          <ul className="space-y-2 text-sm">
            <li><span className="hover:text-yellow-400 transition-colors cursor-pointer">Privacy Policy</span></li>
            <li><span className="hover:text-yellow-400 transition-colors cursor-pointer">Terms of Service</span></li>
            <li><span className="hover:text-yellow-400 transition-colors cursor-pointer">Return Policy</span></li>
            <li><span className="hover:text-yellow-400 transition-colors cursor-pointer">Cancellation Policy</span></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-bold mb-4">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <HiOutlinePhone className="text-yellow-400 text-lg" />
              <span>+91 9142X XXXXX</span>
            </li>
            <li className="flex items-center gap-2">
              <HiOutlineMail className="text-yellow-400 text-lg" />
              <span>support@blinkit.demo</span>
            </li>
            <li className="flex items-start gap-2">
              <HiOutlineShieldCheck className="text-yellow-400 text-lg shrink-0 mt-0.5" />
              <span>100% Safe & Secure Payments</span>
            </li>
          </ul>
        </div>
      </div>

      <hr className="border-gray-700 mt-10 mb-6" />
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
        <p>© 2026 Blinkit Clone. Built for portfolio demonstration.</p>
        <p>Made with ❤️ — Not affiliated with Blinkit or Zomato.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
