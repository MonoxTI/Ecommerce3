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
    <main className="pt-16 min-h-screen bg-[#080808]">
      {/* Background grid */}
      <div className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(192,192,192,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(192,192,192,0.015) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">

        {/* Header */}
        <div className="flex items-end justify-between mb-8 border-b border-[#1e1e1e] pb-6">
          <div>
            <p className="text-[#444444] text-xs tracking-[0.4em] uppercase mb-2"
              style={{ fontFamily: 'Space Mono, monospace' }}>// Collection</p>
            <h1 className="text-white leading-none"
              style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(3rem, 8vw, 6rem)', letterSpacing: '0.05em' }}>
              All Products
            </h1>
            <p className="text-[#444444] text-xs mt-1" style={{ fontFamily: 'Space Mono, monospace' }}>
              {data?.total || 0} items found
            </p>
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 border px-4 py-2.5 text-xs transition-colors ${showFilters || hasFilters ? 'border-[#c0c0c0] text-[#c0c0c0]' : 'border-[#1e1e1e] text-[#555555] hover:border-[#c0c0c0] hover:text-[#c0c0c0]'}`}
            style={{ fontFamily: 'Space Mono, monospace' }}>
            <SlidersHorizontal size={14} />
            Filters {hasFilters && <span className="bg-[#c0c0c0] text-black text-xs w-4 h-4 flex items-center justify-center font-black">!</span>}
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444444]" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search products..."
            className="w-full bg-[#0f0f0f] border border-[#1e1e1e] focus:border-[#c0c0c0] text-white pl-11 pr-4 py-3 outline-none transition-colors text-sm placeholder-[#333333]" />
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-[#0f0f0f] border border-[#1e1e1e] p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="text-[#555555] text-xs tracking-[0.2em] uppercase block mb-3"
                  style={{ fontFamily: 'Space Mono, monospace' }}>Category</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button key={cat}
                      onClick={() => { setSelectedCategory(cat === 'All' ? '' : cat); setPage(1); }}
                      className={`px-3 py-1.5 text-xs font-medium transition-colors border ${(cat === 'All' && !selectedCategory) || selectedCategory === cat ? 'bg-[#c0c0c0] text-black border-[#c0c0c0]' : 'bg-transparent text-[#555555] border-[#1e1e1e] hover:border-[#c0c0c0] hover:text-white'}`}
                      style={{ fontFamily: 'Space Mono, monospace' }}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[#555555] text-xs tracking-[0.2em] uppercase block mb-3"
                  style={{ fontFamily: 'Space Mono, monospace' }}>Size</label>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map(size => (
                    <button key={size}
                      onClick={() => { setSelectedSize(selectedSize === size ? '' : size); setPage(1); }}
                      className={`w-10 h-10 text-xs font-bold transition-colors border ${selectedSize === size ? 'bg-[#c0c0c0] text-black border-[#c0c0c0]' : 'bg-transparent text-[#555555] border-[#1e1e1e] hover:border-[#c0c0c0] hover:text-white'}`}
                      style={{ fontFamily: 'Space Mono, monospace' }}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[#555555] text-xs tracking-[0.2em] uppercase block mb-3"
                  style={{ fontFamily: 'Space Mono, monospace' }}>Price (R)</label>
                <div className="flex gap-2 items-center">
                  <input value={minPrice} onChange={e => { setMinPrice(e.target.value); setPage(1); }} placeholder="Min"
                    className="w-full bg-[#080808] border border-[#1e1e1e] text-white px-3 py-2 text-sm outline-none focus:border-[#c0c0c0] placeholder-[#333333]" />
                  <span className="text-[#333333]">—</span>
                  <input value={maxPrice} onChange={e => { setMaxPrice(e.target.value); setPage(1); }} placeholder="Max"
                    className="w-full bg-[#080808] border border-[#1e1e1e] text-white px-3 py-2 text-sm outline-none focus:border-[#c0c0c0] placeholder-[#333333]" />
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
              className={`flex-shrink-0 px-4 py-2 text-xs font-medium transition-all border ${(cat === 'All' && !selectedCategory) || selectedCategory === cat ? 'bg-[#c0c0c0] text-black border-[#c0c0c0]' : 'bg-transparent text-[#555555] border-[#1e1e1e] hover:border-[#c0c0c0] hover:text-white'}`}
              style={{ fontFamily: 'Space Mono, monospace' }}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-[#0f0f0f] border border-[#161616] animate-pulse">
                <div className="aspect-[3/4] bg-[#161616]" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-[#161616] w-1/3" />
                  <div className="h-4 bg-[#161616] w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-[#1e1e1e]">
            <p className="text-[#333333] text-6xl mb-4" style={{ fontFamily: 'Space Mono, monospace' }}>[ ]</p>
            <p className="text-white font-medium mb-2">No products found</p>
            <p className="text-[#555555] text-sm mb-4">Try different filters</p>
            {hasFilters && (
              <button onClick={clearFilters}
                className="text-[#c0c0c0] hover:text-white text-xs tracking-wider uppercase transition-colors"
                style={{ fontFamily: 'Space Mono, monospace' }}>
                Clear filters
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
              className="px-4 py-2 border border-[#1e1e1e] text-[#555555] hover:text-white hover:border-[#c0c0c0] text-xs disabled:opacity-30 transition-colors"
              style={{ fontFamily: 'Space Mono, monospace' }}>
              ← Prev
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button key={i} onClick={() => setPage(i + 1)}
                className={`w-10 h-10 text-xs font-bold transition-colors border ${page === i + 1 ? 'bg-[#c0c0c0] text-black border-[#c0c0c0]' : 'border-[#1e1e1e] text-[#555555] hover:border-[#c0c0c0] hover:text-white'}`}
                style={{ fontFamily: 'Space Mono, monospace' }}>
                {i + 1}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="px-4 py-2 border border-[#1e1e1e] text-[#555555] hover:text-white hover:border-[#c0c0c0] text-xs disabled:opacity-30 transition-colors"
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