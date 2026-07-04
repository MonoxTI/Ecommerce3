import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, RefreshCw, Headphones } from 'lucide-react';
import { getProducts } from '../services/productService';
import ProductCard from '../components/product/ProductCard';

const Home = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => getProducts({ limit: 8 }),
  });

  return (
    <main className="pt-16">

      {/* ── Hero Section ───────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
        {/* Background grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(#c9a84c 1px, transparent 1px), linear-gradient(90deg, #c9a84c 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#c9a84c]/5 rounded-full blur-3xl" />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          {/* Tag line */}
          <p className="text-[#c9a84c] text-xs tracking-[0.5em] uppercase font-medium mb-6">
            Street Meets Luxury
          </p>

          {/* Main heading */}
          <h1
            className="text-white leading-none mb-6"
            style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 'clamp(4rem, 15vw, 12rem)',
              letterSpacing: '0.05em',
            }}
          >
            MON<span className="text-[#c9a84c]">OX</span>
          </h1>

          <p className="text-[#888888] text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-10">
            Curated pieces for those who refuse to blend in. Where underground culture meets premium craftsmanship.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-[#c9a84c] hover:bg-[#a8893d] text-black font-semibold px-8 py-4 rounded-lg transition-colors duration-200 tracking-wider uppercase text-sm"
            >
              Shop Now <ArrowRight size={16} />
            </Link>
            <Link
              to="/products?category=luxury"
              className="inline-flex items-center gap-2 border border-[#333333] hover:border-[#c9a84c] text-white hover:text-[#c9a84c] font-semibold px-8 py-4 rounded-lg transition-colors duration-200 tracking-wider uppercase text-sm"
            >
              Explore Luxury
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-[#444444] text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-[#c9a84c] to-transparent" />
        </div>
      </section>

      {/* ── Categories Strip ────────────────────────────── */}
      <section className="bg-[#111111] border-y border-[#1a1a1a] py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-6 overflow-x-auto scrollbar-hide">
            {[
              { label: 'New Arrivals', emoji: '⚡' },
              { label: 'Streetwear', emoji: '🔥' },
              { label: 'Luxury', emoji: '✦' },
              { label: 'Hoodies', emoji: '🖤' },
              { label: 'Sneakers', emoji: '👟' },
              { label: 'Accessories', emoji: '💎' },
              { label: 'Sale', emoji: '🏷️' },
            ].map(cat => (
              <Link
                key={cat.label}
                to={`/products?category=${cat.label.toLowerCase()}`}
                className="flex-shrink-0 flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#c9a84c]/10 border border-[#222222] hover:border-[#c9a84c]/50 text-[#888888] hover:text-[#c9a84c] px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap"
              >
                <span>{cat.emoji}</span>
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ───────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[#c9a84c] text-xs tracking-[0.4em] uppercase mb-2">Featured</p>
            <h2
              className="text-white text-4xl md:text-5xl"
              style={{ fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.05em' }}
            >
              New Drops
            </h2>
          </div>
          <Link
            to="/products"
            className="hidden md:flex items-center gap-2 text-[#888888] hover:text-[#c9a84c] text-sm font-medium transition-colors tracking-wider uppercase"
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {isLoading ? (
          // Loading skeleton
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
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
        ) : data?.products?.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {data.products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          // Empty state — shown before any products are added
          <div className="text-center py-20 border border-dashed border-[#222222] rounded-2xl">
            <p className="text-5xl mb-4">🛍️</p>
            <p className="text-white font-medium mb-2">No products yet</p>
            <p className="text-[#888888] text-sm">Add products via the admin panel to see them here.</p>
          </div>
        )}

        <div className="text-center mt-10 md:hidden">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 border border-[#333333] hover:border-[#c9a84c] text-white hover:text-[#c9a84c] px-6 py-3 rounded-lg text-sm font-medium transition-colors tracking-wider uppercase"
          >
            View All Products <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ── Brand Statement Banner ───────────────────────── */}
      <section className="bg-[#111111] border-y border-[#1a1a1a] py-16 overflow-hidden">
        <div className="relative">
          {/* Scrolling text */}
          <div
            className="flex gap-12 whitespace-nowrap animate-[scroll_20s_linear_infinite]"
            style={{ animation: 'scroll 20s linear infinite' }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <span
                key={i}
                className="text-5xl md:text-7xl font-bold text-[#1a1a1a] tracking-widest uppercase flex-shrink-0"
                style={{ fontFamily: 'Bebas Neue, sans-serif' }}
              >
                MONOX ✦ STREET ✦ LUXURY ✦ BOLD ✦&nbsp;
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Badges ────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Truck, title: 'Free Shipping', desc: 'On orders over R800' },
            { icon: Shield, title: 'Secure Payment', desc: 'Paystack & Ozow protected' },
            { icon: RefreshCw, title: 'Easy Returns', desc: '30-day return policy' },
            { icon: Headphones, title: '24/7 Support', desc: 'Always here for you' },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex flex-col items-center text-center p-6 bg-[#111111] border border-[#1a1a1a] hover:border-[#c9a84c]/30 rounded-xl transition-colors duration-200"
            >
              <div className="w-12 h-12 bg-[#c9a84c]/10 rounded-full flex items-center justify-center mb-4">
                <Icon size={22} className="text-[#c9a84c]" />
              </div>
              <h4 className="text-white font-semibold text-sm mb-1">{title}</h4>
              <p className="text-[#888888] text-xs">{desc}</p>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
};

export default Home;