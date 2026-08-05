import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, RefreshCw, Headphones, ChevronRight } from 'lucide-react';
import { getProducts } from '../services/productService';
import { getCategories } from '../services/categoryService';
import ProductCard from '../components/product/ProductCard';

const Home = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => getProducts({ limit: 8 }),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  return (
    <main>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative h-[90vh] min-h-[600px] flex items-end bg-[#0a0a0a] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#4f5256]/40 to-[#0a0a0a]">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] opacity-[0.04]"
            style={{ background: 'radial-gradient(circle, #cc1352 0%, transparent 70%)' }} />
          <div className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: `linear-gradient(#cc1352 1px, transparent 1px), linear-gradient(90deg, #cc1352 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-[#cc1352]" />
              <span className="text-[#cc1352] text-xs tracking-[0.4em] uppercase"
                style={{ fontFamily: 'Space Mono, monospace' }}>New Collection 2026</span>
            </div>

            <h1 className="text-white leading-[0.9] mb-6"
              style={{
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: 'clamp(5rem, 14vw, 11rem)',
                letterSpacing: '0.02em',
              }}>
              KIR
            </h1>

            <p className="text-[#d5d8d9] text-base md:text-lg leading-relaxed mb-10 max-w-md">
              Premium streetwear for those who move different. No compromises. Built to last.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/products"
                className="inline-flex items-center gap-3 bg-[#cc1352] hover:bg-[#e8175e] text-white font-black px-8 py-4 transition-all duration-200 text-sm tracking-[0.15em] uppercase group"
                style={{ fontFamily: 'Space Mono, monospace' }}>
                Shop Now
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/products?sort=new"
                className="inline-flex items-center gap-3 border border-[#333333] hover:border-[#cc1352] text-[#d5d8d9] hover:text-white px-8 py-4 transition-all duration-200 text-sm tracking-[0.15em] uppercase"
                style={{ fontFamily: 'Space Mono, monospace' }}>
                New Drops
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="border-y border-[#cc1352]/20 bg-[#4f5256] py-4 overflow-hidden mb-16">
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

      {/* ── CATEGORY QUICK LINKS ─────────────────────────── */}
      <section className="border-y border-[#cc1352]/20 bg-[#4f5256] py-4 overflow-hidden mb-16">
        <div className="flex overflow-x-auto scrollbar-hide">
          {categories.map((cat: any) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              className="flex-shrink-0 flex items-center gap-2.5 px-5 py-4 text-[#d5d8d9] hover:text-white border-r border-[#d5d8d9]/20 hover:bg-[#3a3d40] transition-all duration-200 group"
            >
              {/* Category thumbnail image */}
              {cat.image && (
                <div className="w-7 h-7 overflow-hidden flex-shrink-0 border border-[#d5d8d9]/20">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <span className="text-xs font-medium tracking-[0.1em] uppercase whitespace-nowrap"
                style={{ fontFamily: 'Space Mono, monospace' }}>
                {cat.name}
              </span>
              <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#cc1352]" />
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[#cc1352] text-xs tracking-[0.3em] uppercase mb-2"
              style={{ fontFamily: 'Space Mono, monospace' }}>// Featured</p>
            <h2 className="text-white text-3xl md:text-4xl font-black"
              style={{ fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.05em' }}>
              New Drops
            </h2>
          </div>
          
          <Link to="/products"
            className="hidden md:flex items-center gap-2 text-[#d5d8d9] hover:text-[#cc1352] text-xs transition-colors group"
            style={{ fontFamily: 'Space Mono, monospace' }}>
            View All
            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-[#3a3d40]" />
                <div className="pt-3 space-y-2">
                  <div className="h-3 bg-[#3a3d40] w-1/3" />
                  <div className="h-4 bg-[#3a3d40] w-2/3" />
                  <div className="h-3 bg-[#3a3d40] w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : data?.products?.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {data.products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border border-dashed border-[#d5d8d9]/20">
            <p className="text-[#9a9d9f] text-sm mb-4" style={{ fontFamily: 'Space Mono, monospace' }}>
              // No products yet
            </p>
            <p className="text-[#6a6d70] text-xs">Add products via the admin panel to see them here.</p>
          </div>
        )}

        <div className="text-center mt-8 md:hidden">
          <Link to="/products"
            className="inline-flex items-center gap-2 border border-[#d5d8d9]/25 hover:border-[#cc1352] text-[#d5d8d9] hover:text-[#cc1352] px-6 py-3 text-xs transition-colors tracking-wider uppercase"
            style={{ fontFamily: 'Space Mono, monospace' }}>
            View All Products <ArrowRight size={12} />
          </Link>
        </div>
      </section>
      <section className="border-y border-[#cc1352]/20 bg-[#4f5256] py-4 overflow-hidden mb-16">
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

      {/* ── MARQUEE ──────────────────────────────────────── }
      <section className="border-y border-[#cc1352]/20 bg-[#4f5256] py-4 overflow-hidden mb-16">
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

*/}
      {/* ── TRUST BADGES ─────────────────────────────────── */}
      <section className="max-w-auto mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-[#d5d8d9]/20 border border-[#d5d8d9]/20 bg-[#4f5256]">
          {[
            { icon: Truck, title: 'Free Shipping', desc: 'On orders over R800' },
            { icon: Shield, title: 'Secure Payment', desc: 'Paystack & Ozow' },
            { icon: RefreshCw, title: '30-Day Returns', desc: 'Easy return policy' },
            { icon: Headphones, title: 'Support', desc: 'support@kir.co.za' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center text-center p-6 hover:bg-[#3a3d40] transition-colors group">
              <div className="w-10 h-10 border border-[#d5d8d9]/20 group-hover:border-[#cc1352]/40 flex items-center justify-center mb-3 transition-colors">
                <Icon size={18} className="text-[#cc1352]" />
              </div>
              <p className="text-white text-xs font-bold mb-1"
                style={{ fontFamily: 'Space Mono, monospace' }}>{title}</p>
              <p className="text-[#9a9d9f] text-xs">{desc}</p>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
};

export default Home;