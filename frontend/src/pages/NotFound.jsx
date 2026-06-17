import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-4">
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      <p className="text-9xl font-black text-yellow-400 mb-4">404</p>
      <h1 className="text-3xl font-black text-gray-900 mb-3">Page Not Found</h1>
      <p className="text-gray-500 max-w-sm mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex gap-3 justify-center">
        <Link to="/" className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-3 rounded-xl transition-colors">
          Go Home
        </Link>
        <Link to="/products" className="bg-white border-2 border-gray-200 text-gray-800 font-bold px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors">
          Browse Products
        </Link>
      </div>
    </motion.div>
  </div>
);

export default NotFound;
