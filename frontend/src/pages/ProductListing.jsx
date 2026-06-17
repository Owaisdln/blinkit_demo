import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { HiOutlineAdjustments } from 'react-icons/hi';
import { getProducts, getCategories } from '../services/productService';
import ProductCard from '../components/product/ProductCard';
import { SkeletonCard } from '../components/common/Skeletons';

const ProductListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || '';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(categoryParam);

  useEffect(() => {
    getCategories().then(({ data }) => setCategories(data.categories || []));
  }, []);

  useEffect(() => {
    setLoading(true);
    getProducts(activeCategory || undefined)
      .then(({ data }) => setProducts(data.products || []))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    if (cat) setSearchParams({ category: cat });
    else setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">
            {activeCategory || 'All Products'}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {!loading && `${products.length} items`}
          </p>
        </div>
        <HiOutlineAdjustments className="text-2xl text-gray-400" />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar filters */}
        <aside className="w-full md:w-52 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm p-4 sticky top-20 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible whitespace-nowrap md:whitespace-normal scrollbar-hide gap-2 md:gap-1">
            <p className="hidden md:block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Categories
            </p>
            <button
              onClick={() => handleCategoryChange('')}
              className={`text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors shrink-0
                ${!activeCategory ? 'bg-yellow-400 text-black font-bold' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              All Products
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors shrink-0
                  ${activeCategory === cat ? 'bg-yellow-400 text-black font-bold' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array(12).fill(0).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-xl font-bold text-gray-700 mb-2">No products found</p>
              <p className="text-gray-500 mb-4">
                {activeCategory
                  ? `No products in "${activeCategory}" category yet.`
                  : 'No products available yet.'}
              </p>
              <button
                onClick={() => handleCategoryChange('')}
                className="px-6 py-2 bg-yellow-400 rounded-xl font-bold text-sm"
              >
                View All
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListing;
