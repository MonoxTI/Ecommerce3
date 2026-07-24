import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X as XIcon } from 'lucide-react';
import { getProducts } from '../services/productService';
import ProductCard from '../components/product/ProductCard';

const CATEGORIES = ['All', 'streetwear', 'luxury', 'hoodies', 'sneakers', 'accessories'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const Products = () => {
  const [searchParams] = useSearchParams();
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
  const hasFilters = search || selectedCategory || selectedSize || minPrice || maxPrice;

  const clearFilters = () => {
    setSearch(''); setSelectedCategory(''); setSelectedSize('');
    setMinPrice(''); setMaxPrice(''); setPage(1);
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a]">

      {/* Page header */}
      <div className="border-b border-[#d5d8d9]/20 bg-[#4f5256]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[#cc1352] text-xs tracking-[0.4em] uppercase mb-1"
                style={{ fontFamily: 'Space Mono, monospace' }}>// Collection</p>
              <h1 className="text-white leading-none font-black"
                style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(3rem, 8vw, 5rem)', letterSpacing: '0.05em' }}>
                All Products
              </h1>
              <p className="text-[#9a9d9f] text-xs mt-1" style={{ fontFamily: 'Space Mono, monospace' }}>
                {data?.total || 0} items found
              </p>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 border px-4 py-2.5 text-xs transition-all ${
                showFilters || hasFilters
                  ? 'border-[#cc1352] text-[#cc1352] bg-[#cc1352]/5'
                  : 'border-[#d5d8d9]/20 text-[#9a9d9f] hover:border-[#cc1352] hover:text-[#cc1352]'
              }`}
              style={{ fontFamily: 'Space Mono, monospace' }}>
              <SlidersHorizontal size={14} />
              Filters
              {hasFilters && (
                <span className="bg-[#cc1352] text-white text-[10px] w-4 h-4 flex items-center justify-center font-black">
                  !
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Search */}
        <div className="relative mb-5">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a9d9f]" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search products..."
            className="w-full bg-[#4f5256] border border-[#d5d8d9]/20 focus:border-[#cc1352] text-white pl-11 pr-4 py-3 outline-none transition-colors text-sm placeholder-[#6a6d70]"
          />
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-[#4f5256] border border-[#cc1352]/20 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="text-[#cc1352] text-xs tracking-[0.2em] uppercase block mb-3"
                  style={{ fontFamily: 'Space Mono, monospace' }}>Category</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button key={cat}
                      onClick={() => { setSelectedCategory(cat === 'All' ? '' : cat); setPage(1); }}
                      className={`px-3 py-1.5 text-xs font-medium transition-all border ${
                        (cat === 'All' && !selectedCategory) || selectedCategory === cat
                          ? 'bg-[#cc1352] text-white border-[#cc1352]'
                          : 'bg-transparent text-[#9a9d9f] border-[#d5d8d9]/20 hover:border-[#cc1352] hover:text-white'
                      }`}
                      style={{ fontFamily: 'Space Mono, monospace' }}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[#cc1352] text-xs tracking-[0.2em] uppercase block mb-3"
                  style={{ fontFamily: 'Space Mono, monospace' }}>Size</label>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map(size => (
                    <button key={size}
                      onClick={() => { setSelectedSize(selectedSize === size ? '' : size); setPage(1); }}
                      className={`w-10 h-10 text-xs font-bold transition-all border ${
                        selectedSize === size
                          ? 'bg-[#cc1352] text-white border-[#cc1352]'
                          : 'bg-transparent text-[#9a9d9f] border-[#d5d8d9]/20 hover:border-[#cc1352] hover:text-white'
                      }`}
                      style={{ fontFamily: 'Space Mono, monospace' }}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[#cc1352] text-xs tracking-[0.2em] uppercase block mb-3"
                  style={{ fontFamily: 'Space Mono, monospace' }}>Price (R)</label>
                <div className="flex gap-2 items-center">
                  <input value={minPrice} onChange={e => { setMinPrice(e.target.value); setPage(1); }}
                    placeholder="Min"
                    className="w-full 	bg-[#3a3d40] border border-[#d5d8d9]/20 focus:border-[#cc1352] text-white px-3 py-2 text-sm outline-none placeholder-[#6a6d70] transition-colors" />
                  <span className="text-[#6a6d70]">—</span>
                  <input value={maxPrice} onChange={e => { setMaxPrice(e.target.value); setPage(1); }}
                    placeholder="Max"
                    className="w-full 	bg-[#3a3d40] border border-[#d5d8d9]/20 focus:border-[#cc1352] text-white px-3 py-2 text-sm outline-none placeholder-[#6a6d70] transition-colors" />
                </div>
              </div>

              <div className="flex items-end">
                {hasFilters && (
                  <button onClick={clearFilters}
                    className="flex items-center gap-2 text-[#e53e3e] hover:text-red-300 text-xs transition-colors"
                    style={{ fontFamily: 'Space Mono, monospace' }}>
                    <XIcon size={12} /> Clear all
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
          {CATEGORIES.map(cat => (
            <button key={cat}
              onClick={() => { setSelectedCategory(cat === 'All' ? '' : cat); setPage(1); }}
              className={`flex-shrink-0 px-4 py-2 text-xs font-medium transition-all border ${
                (cat === 'All' && !selectedCategory) || selectedCategory === cat
                  ? 'bg-[#cc1352] text-white border-[#cc1352]'
                  : 'bg-transparent text-[#9a9d9f] border-[#d5d8d9]/20 hover:border-[#cc1352] hover:text-[#cc1352]'
              }`}
              style={{ fontFamily: 'Space Mono, monospace' }}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-[#4f5256]" />
                <div className="pt-3 space-y-2">
                  <div className="h-3 bg-[#4f5256] w-1/3" />
                  <div className="h-4 bg-[#4f5256] w-2/3" />
                  <div className="h-3 bg-[#4f5256] w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-[#d5d8d9]/20">
            <p className="text-[#222222] text-6xl mb-4" style={{ fontFamily: 'Space Mono, monospace' }}>[ ]</p>
            <p className="text-white font-medium mb-2">No products found</p>
            <p className="text-[#9a9d9f] text-sm mb-6">Try different filters or clear your search</p>
            {hasFilters && (
              <button onClick={clearFilters}
                className="text-[#cc1352] hover:text-[#e8175e] text-xs tracking-wider uppercase transition-colors underline underline-offset-4"
                style={{ fontFamily: 'Space Mono, monospace' }}>
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-4 py-2.5 border border-[#d5d8d9]/20 text-[#9a9d9f] hover:text-white hover:border-[#cc1352] text-xs disabled:opacity-30 transition-colors"
              style={{ fontFamily: 'Space Mono, monospace' }}>
              ← Prev
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button key={i} onClick={() => setPage(i + 1)}
                className={`w-10 h-10 text-xs font-bold transition-all border ${
                  page === i + 1
                    ? 'bg-[#cc1352] text-white border-[#cc1352]'
                    : 'border-[#d5d8d9]/20 text-[#9a9d9f] hover:border-[#cc1352] hover:text-[#cc1352]'
                }`}
                style={{ fontFamily: 'Space Mono, monospace' }}>
                {i + 1}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="px-4 py-2.5 border border-[#d5d8d9]/20 text-[#9a9d9f] hover:text-white hover:border-[#cc1352] text-xs disabled:opacity-30 transition-colors"
              style={{ fontFamily: 'Space Mono, monospace' }}>
              Next →
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default Products;