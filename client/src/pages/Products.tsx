import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X as XIcon, RefreshCw } from 'lucide-react';
import { getProducts } from '../services/productService';
import { getCategories } from '../services/categoryService';
import ProductCard from '../components/product/ProductCard';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

// ── Small helper components for cleaner JSX ───────────────────────────────
const Chip = ({ label, onRemove }: { label: string, onRemove: () => void }) => (
  <div className="flex items-center gap-2 bg-[#cc1352]/10 border border-[#cc1352]/30 px-3 py-1.5 group max-w-[200px]">
    <span className="text-[#d5d8d9] text-[10px] uppercase tracking-wider truncate" style={{ fontFamily: 'Space Mono, monospace' }} title={label}>
      {label}
    </span>
    <button onClick={onRemove} className="text-[#cc1352] hover:text-white transition-colors flex-shrink-0">
      <XIcon size={10} />
    </button>
  </div>
);

const FilterButton = ({ children, active, onClick }: { children: React.ReactNode, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-[10px] font-bold tracking-wider uppercase transition-all border ${
      active
        ? 'bg-[#cc1352] text-white border-[#cc1352] shadow-[0_0_10px_rgba(204,19,82,0.2)]'
        : 'bg-[#0a0a0a] text-[#9a9d9f] border-[#333333] hover:border-[#cc1352] hover:text-white'
    }`}
    style={{ fontFamily: 'Space Mono, monospace' }}
  >
    {children}
  </button>
);

const Products = () => {
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedSize, setSelectedSize] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(1);

  // ── Dynamic categories from DB ────────────────────────
  const { data: categoryList = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

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
      
      {/* ── MARQUEE ──────────────────────────────────────── */}
      <section className="border-y border-[#cc1352]/20 bg-[#4f5256] py-4 overflow-hidden mb-0">
        <div className="flex whitespace-nowrap" style={{ animation: 'scroll 30s linear infinite' }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i}
              className="text-[#3a3d40] text-4xl md:text-6xl font-black tracking-widest uppercase flex-shrink-0 select-none"
              style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
              KIR ✦ STREET ✦ RAW ✦ 2026 ✦&nbsp;
            </span>
          ))}
        </div>
      </section>

      {/* ── PAGE HEADER ──────────────────────────────────── */}
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
              <p className="text-[#9a9d9f] text-xs mt-1"
                style={{ fontFamily: 'Space Mono, monospace' }}>
                {data?.total || 0} items found
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── STICKY TOOLBAR & FILTERS ─────────────────────── */}
      <div className="sticky top-0 z-30 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#cc1352]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          
          {/* Search & Filter Toggle */}
          <div className="flex items-center gap-3 md:gap-6">
            {/* Search Input */}
            <div className="relative flex-1 group">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6a6d70] group-focus-within:text-[#cc1352] transition-colors" />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="SEARCH ARCHIVE..."
                className="w-full bg-[#111111] border border-[#333333] focus:border-[#cc1352] focus:ring-1 focus:ring-[#cc1352]/20 text-white pl-12 pr-10 py-3.5 outline-none transition-all text-xs tracking-[0.15em] uppercase placeholder-[#4a4d50]"
                style={{ fontFamily: 'Space Mono, monospace' }}
              />
              {search && (
                <button onClick={() => { setSearch(''); setPage(1); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6a6d70] hover:text-[#cc1352] transition-colors">
                  <XIcon size={14} />
                </button>
              )}
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2.5 border px-5 py-3.5 text-xs transition-all uppercase tracking-wider relative ${
                showFilters || hasFilters
                  ? 'border-[#cc1352] text-[#cc1352] bg-[#cc1352]/10'
                  : 'border-[#333333] text-[#d5d8d9] hover:border-[#cc1352] hover:text-[#cc1352] bg-[#111111]'
              }`}
              style={{ fontFamily: 'Space Mono, monospace' }}
            >
              <SlidersHorizontal size={14} />
              <span className="hidden sm:inline">Filters</span>
              {hasFilters && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#cc1352] text-white text-[9px] w-4 h-4 flex items-center justify-center font-black rounded-full border border-[#0a0a0a]">
                  !
                </span>
              )}
            </button>
          </div>

          {/* Active Filters Chips */}
          {hasFilters && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-[#333333]">
              <span className="text-[#6a6d70] text-[10px] uppercase tracking-widest mr-2 hidden sm:inline" style={{ fontFamily: 'Space Mono, monospace' }}>Active:</span>
              
              {selectedCategory && (
                <Chip label={(categoryList as any[]).find((c: any) => c.slug === selectedCategory)?.name || selectedCategory} onRemove={() => { setSelectedCategory(''); setPage(1); }} />
              )}
              {selectedSize && (
                <Chip label={`Size: ${selectedSize}`} onRemove={() => { setSelectedSize(''); setPage(1); }} />
              )}
              {(minPrice || maxPrice) && (
                <Chip label={`R${minPrice || '0'} - R${maxPrice || '∞'}`} onRemove={() => { setMinPrice(''); setMaxPrice(''); setPage(1); }} />
              )}
              {search && (
                <Chip label={`"${search}"`} onRemove={() => { setSearch(''); setPage(1); }} />
              )}

              <button onClick={clearFilters} className="text-[#cc1352] hover:text-white text-[10px] uppercase tracking-widest ml-auto transition-colors flex items-center gap-1.5" style={{ fontFamily: 'Space Mono, monospace' }}>
                <XIcon size={10} /> Clear All
              </button>
            </div>
          )}
        </div>

        {/* Expandable Filters Panel (Smooth CSS Grid Animation) */}
        <div className={`grid transition-all duration-300 ease-in-out ${showFilters ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
          <div className="overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-[#333333] bg-[#111111]">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                
                {/* Categories */}
                <div className="md:col-span-5">
                  <label className="text-[#cc1352] text-[10px] tracking-[0.3em] uppercase block mb-4 font-bold" style={{ fontFamily: 'Space Mono, monospace' }}>
                    // Category
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <FilterButton active={!selectedCategory} onClick={() => { setSelectedCategory(''); setPage(1); }}>All</FilterButton>
                    {(categoryList as any[]).map((cat: any) => (
                      <FilterButton key={cat.id} active={selectedCategory === cat.slug} onClick={() => { setSelectedCategory(cat.slug); setPage(1); }}>
                        {cat.name}
                      </FilterButton>
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div className="md:col-span-4">
                  <label className="text-[#cc1352] text-[10px] tracking-[0.3em] uppercase block mb-4 font-bold" style={{ fontFamily: 'Space Mono, monospace' }}>
                    // Size
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {SIZES.map(size => (
                      <button key={size}
                        onClick={() => { setSelectedSize(selectedSize === size ? '' : size); setPage(1); }}
                        className={`aspect-square flex items-center justify-center text-xs font-bold transition-all border ${
                          selectedSize === size
                            ? 'bg-[#cc1352] text-white border-[#cc1352] shadow-[0_0_15px_rgba(204,19,82,0.3)]'
                            : 'bg-[#0a0a0a] text-[#9a9d9f] border-[#333333] hover:border-[#cc1352] hover:text-white'
                        }`}
                        style={{ fontFamily: 'Space Mono, monospace' }}>
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div className="md:col-span-3">
                  <label className="text-[#cc1352] text-[10px] tracking-[0.3em] uppercase block mb-4 font-bold" style={{ fontFamily: 'Space Mono, monospace' }}>
                    // Price (ZAR)
                  </label>
                  <div className="flex gap-2 items-center">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6a6d70] text-xs pointer-events-none">R</span>
                      <input value={minPrice} onChange={e => { setMinPrice(e.target.value); setPage(1); }}
                        placeholder="Min"
                        className="w-full bg-[#0a0a0a] border border-[#333333] focus:border-[#cc1352] text-white pl-7 pr-2 py-2.5 text-xs outline-none placeholder-[#4a4d50] transition-colors" 
                        style={{ fontFamily: 'Space Mono, monospace' }}
                      />
                    </div>
                    <span className="text-[#333333]">—</span>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6a6d70] text-xs pointer-events-none">R</span>
                      <input value={maxPrice} onChange={e => { setMaxPrice(e.target.value); setPage(1); }}
                        placeholder="Max"
                        className="w-full bg-[#0a0a0a] border border-[#333333] focus:border-[#cc1352] text-white pl-7 pr-2 py-2.5 text-xs outline-none placeholder-[#4a4d50] transition-colors" 
                        style={{ fontFamily: 'Space Mono, monospace' }}
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT AREA ────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-[#111111]" />
                <div className="pt-3 space-y-2">
                  <div className="h-3 bg-[#111111] w-1/3" />
                  <div className="h-4 bg-[#111111] w-2/3" />
                  <div className="h-3 bg-[#111111] w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-[#333333] bg-[#111111]">
            <div className="inline-flex items-center justify-center w-16 h-16 border border-[#333333] mb-6">
              <Search size={24} className="text-[#6a6d70]" />
            </div>
            <p className="text-white text-lg font-bold mb-2" style={{ fontFamily: 'Space Mono, monospace' }}>No matches found</p>
            <p className="text-[#6a6d70] text-sm mb-8 max-w-xs mx-auto">We couldn't find any gear matching your criteria. Try adjusting your filters.</p>
            {hasFilters && (
              <button onClick={clearFilters}
                className="inline-flex items-center gap-2 bg-[#cc1352] hover:bg-[#e8175e] text-white px-6 py-3 text-xs tracking-wider uppercase transition-colors"
                style={{ fontFamily: 'Space Mono, monospace' }}>
                <RefreshCw size={12} /> Reset Filters
              </button>
            )}
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
          <div className="flex justify-center items-center gap-2 mt-16">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-4 py-2.5 border border-[#333333] bg-[#111111] text-[#9a9d9f] hover:text-white hover:border-[#cc1352] text-xs disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              style={{ fontFamily: 'Space Mono, monospace' }}>
              ← Prev
            </button>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)}
                  className={`w-10 h-10 text-xs font-bold transition-all border ${
                    page === i + 1
                      ? 'bg-[#cc1352] text-white border-[#cc1352] shadow-[0_0_10px_rgba(204,19,82,0.3)]'
                      : 'border-[#333333] bg-[#111111] text-[#9a9d9f] hover:border-[#cc1352] hover:text-[#cc1352]'
                  }`}
                  style={{ fontFamily: 'Space Mono, monospace' }}>
                  {i + 1}
                </button>
              ))}
            </div>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="px-4 py-2.5 border border-[#333333] bg-[#111111] text-[#9a9d9f] hover:text-white hover:border-[#cc1352] text-xs disabled:opacity-30 disabled:cursor-not-allowed transition-all"
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