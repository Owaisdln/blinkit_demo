import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCategories } from '../services/productService';
import { getCategoryEmoji } from '../constants';
import { SkeletonCategory } from '../components/common/Skeletons';

const Categories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const { data } = await getCategories();
        const cats = data.categories || [];
        setCategories(cats);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const BG_COLORS = [
    'bg-yellow-50 hover:bg-yellow-100',
    'bg-blue-50 hover:bg-blue-100',
    'bg-green-50 hover:bg-green-100',
    'bg-pink-50 hover:bg-pink-100',
    'bg-purple-50 hover:bg-purple-100',
    'bg-orange-50 hover:bg-orange-100',
    'bg-teal-50 hover:bg-teal-100',
    'bg-red-50 hover:bg-red-100',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900 mb-1">All Categories</h1>
        <p className="text-sm text-gray-500">Browse by category to find exactly what you need</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array(10).fill(0).map((_, i) => <SkeletonCategory key={i} />)}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">📦</p>
          <p className="text-xl font-bold text-gray-700 mb-2">No categories yet</p>
          <p className="text-gray-500">Add products from the admin panel to see categories here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((cat, i) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(`/products?category=${encodeURIComponent(cat)}`)}
              className={`${BG_COLORS[i % BG_COLORS.length]} rounded-2xl p-6 text-center transition-all duration-200 shadow-sm hover:shadow-md flex flex-col items-center gap-3`}
            >
              <span className="text-5xl">{getCategoryEmoji(cat)}</span>
              <div>
                <p className="font-bold text-gray-900">{cat}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Shop Now
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
