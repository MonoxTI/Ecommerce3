import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X as XIcon } from 'lucide-react';
import { getProducts } from '../services/productService';
import ProductCard from '../components/product/ProductCard';

const CATEGORIES = ['All', 'streetwear', 'luxury', 'hoodies', 'sneakers', 'accessories'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedSize, setSelectedSize] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['products', search, selectedCategory, selectedSize, minPrice, maxPrice, page],
    queryFn: () => getProducts({
      search: search || undefined,
      category: selectedCategory || undefined,
      size: selectedSize || undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      page,
      limit: 12,
    }),
  });

  const products = data?.products || [];
  const totalPages = data?.totalPages || 1;

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedSize('');
    setMinPrice('');
    setMaxPrice('');
    setPage(1);
  };

  const hasFilters = search || selectedCategory || selectedSize || minPrice || maxPrice;

  return (
    <main className="pt-16 min-h-screen bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[#c9a84c] text-xs tracking-[0.4em] uppercase mb-2">Collection</p>
            <h1 className="text-white text-4xl md:text-5xl"
              style={{ fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.05em' }}>
              All Products
            </h1>
            <p className="text-[#888888] text-sm mt-1">{data?.total || 0} products</p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 border border-[#222222] hover:border-[#c9a84c] text-[#888888] hover:text-[#c9a84c] px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <SlidersHorizontal size={16} />
            Filters {hasFilters && <span className="bg-[#c9a84c] text-black text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">!</span>}
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888888]" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search products..."
            className="w-full bg-[#111111] border border-[#1a1a1a] focus:border-[#c9a84c] text-white pl-11 pr-4 py-3 rounded-xl outline-none transition-colors text-sm placeholder-[#444444]"
          />
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-[#111111] border border-[#1a1a1a] rounded-xl p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

              {/* Category */}
              <div>
                <label className="text-[#888888] text-xs tracking-widest uppercase block mb-3">Category</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => { setSelectedCategory(cat === 'All' ? '' : cat); setPage(1); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        (cat === 'All' && !selectedCategory) || selectedCategory === cat
                          ? 'bg-[#c9a84c] text-black'
                          : 'bg-[#1a1a1a] text-[#888888] hover:text-white border border-[#222222]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div>
                <label className="text-[#888888] text-xs tracking-widest uppercase block mb-3">Size</label>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map(size => (
                    <button
                      key={size}
                      onClick={() => { setSelectedSize(selectedSize === size ? '' : size); setPage(1); }}
                      className={`w-10 h-10 rounded-lg text-xs font-medium transition-colors ${
                        selectedSize === size
                          ? 'bg-[#c9a84c] text-black'
                          : 'bg-[#1a1a1a] text-[#888888] hover:text-white border border-[#222222]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="text-[#888888] text-xs tracking-widest uppercase block mb-3">Price Range (R)</label>
                <div className="flex gap-2 items-center">
                  <input
                    value={minPrice}
                    onChange={e => { setMinPrice(e.target.value); setPage(1); }}
                    placeholder="Min"
                    className="w-full bg-[#1a1a1a] border border-[#222222] text-white px-3 py-2 rounded-lg text-sm outline-none focus:border-[#c9a84c] placeholder-[#444444]"
                  />
                  <span className="text-[#888888]">—</span>
                  <input
                    value={maxPrice}
                    onChange={e => { setMaxPrice(e.target.value); setPage(1); }}
                    placeholder="Max"
                    className="w-full bg-[#1a1a1a] border border-[#222222] text-white px-3 py-2 rounded-lg text-sm outline-none focus:border-[#c9a84c] placeholder-[#444444]"
                  />
                </div>
              </div>

              {/* Clear */}
              <div className="flex items-end">
                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 text-[#e53e3e] hover:text-red-300 text-sm transition-colors"
                  >
                    <XIcon size={14} /> Clear filters
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Category Pills */}
        <div className="flex gap-3 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat === 'All' ? '' : cat); setPage(1); }}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all ${
                (cat === 'All' && !selectedCategory) || selectedCategory === cat
                  ? 'bg-[#c9a84c] text-black'
                  : 'bg-[#111111] text-[#888888] hover:text-white border border-[#1a1a1a]'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-[#111111] rounded-xl overflow-hidden animate-pulse">
                <div className="aspect-[3/4] bg-[#1a1a1a]" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-[#1a1a1a] rounded w-1/3" />
                  <div className="h-4 bg-[#1a1a1a] rounded w-2/3" />
                  <div className="h-4 bg-[#1a1a1a] rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[#222222] rounded-2xl">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-white font-medium mb-2">No products found</p>
            <p className="text-[#888888] text-sm mb-4">Try adjusting your filters</p>
            <button onClick={clearFilters} className="text-[#c9a84c] hover:underline text-sm">Clear all filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-[#111111] border border-[#1a1a1a] text-[#888888] hover:text-white rounded-lg text-sm disabled:opacity-30 transition-colors"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                  page === i + 1 ? 'bg-[#c9a84c] text-black' : 'bg-[#111111] border border-[#1a1a1a] text-[#888888] hover:text-white'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-[#111111] border border-[#1a1a1a] text-[#888888] hover:text-white rounded-lg text-sm disabled:opacity-30 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default Products;