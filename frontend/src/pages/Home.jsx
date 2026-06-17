import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineLightningBolt,
  HiOutlineShieldCheck,
  HiOutlineClock,
  HiArrowRight,
} from 'react-icons/hi';
import { getProducts, getCategories } from '../services/productService';
import ProductCard from '../components/product/ProductCard';
import { SkeletonCard, SkeletonCategory } from '../components/common/Skeletons';
import { getCategoryEmoji } from '../constants';

const PROMO_BANNERS = [
  { gradient: 'from-yellow-400 to-orange-400', title: 'Fresh Vegetables', sub: 'Farm to door in 10 min', emoji: '🥦' },
  { gradient: 'from-blue-400 to-purple-500', title: 'Dairy & Eggs', sub: 'Cold-chain delivered', emoji: '🥛' },
  { gradient: 'from-pink-400 to-red-400', title: 'Snacks & Drinks', sub: 'Party-ready in minutes', emoji: '🍟' },
];

const FeatureCard = ({ icon: Icon, title, desc }) => (
  <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-sm">
    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-3">
      <Icon className="text-2xl text-yellow-500" />
    </div>
    <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
    <p className="text-sm text-gray-500">{desc}</p>
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingProds, setLoadingProds] = useState(true);

  useEffect(() => {
    getCategories()
      .then(({ data }) => setCategories(data.categories || []))
      .finally(() => setLoadingCats(false));

    getProducts()
      .then(({ data }) => setFeaturedProducts((data.products || []).slice(0, 8)))
      .finally(() => setLoadingProds(false));
  }, []);

  // Floating food items for hero visual
  const FOOD_ITEMS = [
    { emoji: '🥛', label: 'Dairy', delay: 0 },
    { emoji: '🥦', label: 'Veggies', delay: 0.1 },
    { emoji: '🍎', label: 'Fruits', delay: 0.2 },
    { emoji: '🍞', label: 'Bakery', delay: 0.3 },
    { emoji: '🥚', label: 'Eggs', delay: 0.4 },
    { emoji: '🍟', label: 'Snacks', delay: 0.5 },
    { emoji: '🧃', label: 'Drinks', delay: 0.15 },
    { emoji: '🧀', label: 'Cheese', delay: 0.25 },
    { emoji: '🍗', label: 'Chicken', delay: 0.35 },
  ];

  return (
    <div className="pb-12">
      {/* Hero — full viewport two-column layout */}
      <section className="relative bg-gradient-to-br from-yellow-400 via-yellow-300 to-amber-200 overflow-hidden min-h-[88vh] flex items-center">
        {/* Decorative background blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-yellow-500 opacity-30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-amber-400 opacity-40 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-200 opacity-20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 w-full">
          <div className="grid lg:grid-cols-2 gap-10 items-center">

            {/* Left — text content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 bg-black text-yellow-400 text-sm font-bold px-5 py-2 rounded-full mb-6 shadow-lg"
              >
                <HiOutlineLightningBolt className="text-base" />
                Delivery in 10 minutes — Guaranteed
              </motion.div>

              {/* Headline */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 leading-[1.05] mb-6">
                Groceries<br />
                <span className="text-white" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.15)' }}>
                  delivered
                </span>
                <br />
                <span className="text-gray-900">blazing fast.</span>
              </h1>

              {/* Sub */}
              <p className="text-gray-800 text-xl leading-relaxed mb-8 max-w-lg">
                Fresh vegetables, dairy, snacks and more — straight from local stores to your doorstep before you know it.
              </p>

              {/* Stats row */}
              <div className="flex flex-wrap gap-6 mb-10">
                {[
                  { val: '10 min', label: 'Avg. delivery' },
                  { val: '5000+', label: 'Products' },
                  { val: '24 / 7', label: 'Always open' },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-2xl font-black text-gray-900">{s.val}</p>
                    <p className="text-sm text-gray-700">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white font-bold px-8 py-4 rounded-2xl hover:bg-gray-800 transition-all text-lg shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
                >
                  Shop Now <HiArrowRight />
                </Link>
                <Link
                  to="/categories"
                  className="inline-flex items-center justify-center gap-2 bg-white/70 backdrop-blur text-gray-900 font-bold px-8 py-4 rounded-2xl hover:bg-white transition-all text-lg border border-white/80 hover:-translate-y-0.5"
                >
                  Browse Categories
                </Link>
              </div>
            </motion.div>

            {/* Right — floating food cards grid */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="hidden lg:grid grid-cols-3 gap-4"
            >
              {FOOD_ITEMS.map((item) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: item.delay + 0.3, duration: 0.5 }}
                  whileHover={{ scale: 1.08, rotate: -2 }}
                  className="bg-white/60 backdrop-blur-sm rounded-3xl p-5 flex flex-col items-center gap-2 shadow-md border border-white/60 cursor-default select-none"
                >
                  <span className="text-4xl">{item.emoji}</span>
                  <span className="text-xs font-bold text-gray-700">{item.label}</span>
                  <span className="text-[10px] text-green-600 bg-green-100 px-2 py-0.5 rounded-full font-semibold">
                    In stock
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Mobile food emoji scroll */}
          <div className="lg:hidden flex gap-3 mt-10 overflow-x-auto pb-2 scrollbar-hide">
            {FOOD_ITEMS.map((item) => (
              <div
                key={item.label}
                className="bg-white/60 rounded-2xl px-4 py-3 flex flex-col items-center gap-1 shrink-0 shadow-sm border border-white/60"
              >
                <span className="text-3xl">{item.emoji}</span>
                <span className="text-xs font-semibold text-gray-700">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery promise strip */}
      <div className="bg-gray-900 text-white py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-8 text-sm">
          <span className="flex items-center gap-2 font-medium"><HiOutlineLightningBolt className="text-yellow-400 text-base" /> 10-Minute Delivery</span>
          <span className="flex items-center gap-2 font-medium"><HiOutlineShieldCheck className="text-yellow-400 text-base" /> Fresh & Quality Guaranteed</span>
          <span className="flex items-center gap-2 font-medium"><HiOutlineClock className="text-yellow-400 text-base" /> Open 24 × 7, 365 Days</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-10 space-y-12">
        {/* Categories */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-black text-gray-900">Shop by Category</h2>
            <Link to="/categories" className="text-sm font-semibold text-yellow-600 flex items-center gap-1 hover:underline">
              See all <HiArrowRight />
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {loadingCats
              ? Array(8).fill(0).map((_, i) => <SkeletonCategory key={i} />)
              : categories.slice(0, 8).map((cat) => (
                <motion.button
                  key={cat}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(`/products?category=${encodeURIComponent(cat)}`)}
                  className="bg-white rounded-2xl p-3 shadow-sm hover:shadow-md transition-all text-center flex flex-col items-center gap-2"
                >
                  <span className="text-3xl">{getCategoryEmoji(cat)}</span>
                  <span className="text-xs font-semibold text-gray-700 leading-tight">{cat}</span>
                </motion.button>
              ))
            }
          </div>
        </section>

        {/* Promo banners */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PROMO_BANNERS.map((b, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className={`bg-gradient-to-br ${b.gradient} rounded-2xl p-6 text-white cursor-pointer`}
              onClick={() => navigate('/products')}
            >
              <p className="text-4xl mb-2">{b.emoji}</p>
              <h3 className="text-lg font-bold">{b.title}</h3>
              <p className="text-sm opacity-80">{b.sub}</p>
            </motion.div>
          ))}
        </section>

        {/* Featured Products */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-black text-gray-900">Featured Products</h2>
            <Link to="/products" className="text-sm font-semibold text-yellow-600 flex items-center gap-1 hover:underline">
              View all <HiArrowRight />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {loadingProds
              ? Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)
              : featuredProducts.map((p) => <ProductCard key={p._id} product={p} />)
            }
            {!loadingProds && featuredProducts.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-400">
                <p className="text-4xl mb-3">🛒</p>
                <p className="font-semibold">No products available yet. Add some from the admin panel!</p>
              </div>
            )}
          </div>
        </section>

        {/* Feature cards */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FeatureCard icon={HiOutlineLightningBolt} title="10-Min Delivery" desc="Your groceries arrive before your hunger kicks in." />
          <FeatureCard icon={HiOutlineShieldCheck} title="Quality Assured" desc="All products are fresh and quality-checked." />
          <FeatureCard icon={HiOutlineClock} title="Open 24 × 7" desc="Order any time, day or night. We're always here." />
        </section>
      </div>
    </div>
  );
};

export default Home;
