import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HiOutlineSearch } from 'react-icons/hi';
import { searchProducts } from '../services/productService';
import ProductCard from '../components/product/ProductCard';
import { SkeletonCard } from '../components/common/Skeletons';

const useDebounce = (value, delay = 400) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
};

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const debouncedQuery = useDebounce(query);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setProducts([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    setSearchParams({ q: debouncedQuery });
    searchProducts(debouncedQuery)
      .then(({ data }) => {
        setProducts(data.products || []);
        setSearched(true);
      })
      .finally(() => setLoading(false));
  }, [debouncedQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Search input */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="flex items-center bg-white border-2 border-yellow-400 rounded-2xl px-5 py-3.5 gap-3 shadow-sm">
          <HiOutlineSearch className="text-yellow-500 text-xl shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for eggs, milk, bread..."
            className="flex-1 outline-none text-gray-900 bg-transparent text-base placeholder-gray-400"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-700 text-xl">×</button>
          )}
        </div>
      </div>

      {/* Results */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {!loading && searched && products.length === 0 && (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-xl font-bold text-gray-800 mb-2">No results for "{query}"</p>
          <p className="text-gray-500">Try different keywords or check the spelling</p>
        </div>
      )}

      {!loading && products.length > 0 && (
        <>
          <p className="text-sm text-gray-500 mb-4">
            <span className="font-semibold text-gray-900">{products.length}</span> results for "{query}"
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </>
      )}

      {!query && !searched && (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">🛒</p>
          <p className="text-xl font-bold text-gray-700 mb-2">What are you looking for?</p>
          <p className="text-gray-500">Start typing to search thousands of products</p>
        </div>
      )}
    </div>
  );
};

export default Search;
