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

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#080808]">
        {/* Raw grid texture */}
        <div className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(192,192,192,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(192,192,192,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Diagonal slash accent */}
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-5"
          style={{
            background: 'linear-gradient(135deg, transparent 40%, #c0c0c0 40%, #c0c0c0 42%, transparent 42%)',
          }}
        />

        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 border border-[#1e1e1e] px-4 py-2 mb-8">
            <div className="w-1.5 h-1.5 bg-[#c0c0c0]" />
            <span className="text-[#777777] text-xs tracking-[0.4em] uppercase"
              style={{ fontFamily: 'Space Mono, monospace' }}>
              New Collection 2026
            </span>
          </div>

          {/* Main heading */}
          <h1 className="text-white leading-none mb-4"
            style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 'clamp(5rem, 18vw, 15rem)',
              letterSpacing: '0.02em',
              textShadow: '0 0 80px rgba(192,192,192,0.1)',
            }}>
            KIR
          </h1>

          {/* Raw tagline */}
          <p className="text-[#555555] text-sm md:text-base tracking-[0.5em] uppercase mb-4"
            style={{ fontFamily: 'Space Mono, monospace' }}>
            ——— Street & Raw ———
          </p>

          <p className="text-[#777777] text-lg max-w-lg mx-auto leading-relaxed mb-10">
            No filters. No fakes. Just raw energy and premium gear for those built different.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products"
              className="inline-flex items-center gap-3 bg-[#c0c0c0] hover:bg-white text-black font-black px-8 py-4 transition-colors tracking-[0.2em] uppercase text-sm"
              style={{ fontFamily: 'Space Mono, monospace' }}>
              Shop Now <ArrowRight size={16} />
            </Link>
            <Link to="/products?category=luxury"
              className="inline-flex items-center gap-3 border border-[#1e1e1e] hover:border-[#c0c0c0] text-[#777777] hover:text-white font-medium px-8 py-4 transition-colors tracking-[0.2em] uppercase text-sm"
              style={{ fontFamily: 'Space Mono, monospace' }}>
              Explore
            </Link>
          </div>
        </div>

        {/* Bottom scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[#333333] text-xs tracking-[0.4em] uppercase"
            style={{ fontFamily: 'Space Mono, monospace' }}>Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-[#c0c0c0] to-transparent" />
        </div>
      </section>

      {/* ── Categories Strip ─────────────────────────────── */}
      <section className="bg-[#0f0f0f] border-y border-[#1e1e1e] py-5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-4 overflow-x-auto pb-1">
            {[
              { label: 'New Drops', tag: '// NEW' },
              { label: 'Streetwear', tag: '// STREET' },
              { label: 'Luxury', tag: '// LUX' },
              { label: 'Hoodies', tag: '// HOOD' },
              { label: 'Sneakers', tag: '// KICKS' },
              { label: 'Accessories', tag: '// ACC' },
              { label: 'Sale', tag: '// SALE' },
            ].map(cat => (
              <Link key={cat.label}
                to={`/products?category=${cat.label.toLowerCase()}`}
                className="flex-shrink-0 flex items-center gap-2 border border-[#1e1e1e] hover:border-[#c0c0c0] text-[#555555] hover:text-[#c0c0c0] px-4 py-2 text-xs transition-all duration-200 whitespace-nowrap"
                style={{ fontFamily: 'Space Mono, monospace' }}>
                <span className="text-[#333333]">{cat.tag}</span>
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[#555555] text-xs tracking-[0.4em] uppercase mb-2"
              style={{ fontFamily: 'Space Mono, monospace' }}>// Featured</p>
            <h2 className="text-white text-4xl md:text-6xl"
              style={{ fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.05em' }}>
              New Drops
            </h2>
          </div>
          <Link to="/products"
            className="hidden md:flex items-center gap-2 text-[#555555] hover:text-[#c0c0c0] text-xs transition-colors tracking-[0.2em] uppercase"
            style={{ fontFamily: 'Space Mono, monospace' }}>
            View All <ArrowRight size={12} />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-[#0f0f0f] border border-[#161616] overflow-hidden animate-pulse">
                <div className="aspect-[3/4] bg-[#161616]" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-[#161616] w-1/3" />
                  <div className="h-4 bg-[#161616] w-2/3" />
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
          <div className="text-center py-20 border border-dashed border-[#1e1e1e]">
            <p className="text-4xl mb-4">▣</p>
            <p className="text-white font-medium mb-2">No products yet</p>
            <p className="text-[#555555] text-sm">Add products via the admin panel.</p>
          </div>
        )}

        <div className="text-center mt-10 md:hidden">
          <Link to="/products"
            className="inline-flex items-center gap-2 border border-[#1e1e1e] hover:border-[#c0c0c0] text-[#777777] hover:text-white px-6 py-3 text-xs transition-colors tracking-[0.2em] uppercase"
            style={{ fontFamily: 'Space Mono, monospace' }}>
            View All <ArrowRight size={12} />
          </Link>
        </div>
      </section>

      {/* ── Marquee Banner ────────────────────────────────── */}
      <section className="bg-[#0f0f0f] border-y border-[#1e1e1e] py-5 overflow-hidden">
        <div className="flex gap-0 whitespace-nowrap"
          style={{ animation: 'scroll 25s linear infinite' }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i}
              className="text-[#1e1e1e] text-5xl md:text-7xl font-black tracking-widest uppercase flex-shrink-0 select-none"
              style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
              KIR ✦ STREET ✦ RAW ✦ 2026 ✦&nbsp;
            </span>
          ))}
        </div>
      </section>

      {/* ── Trust Badges ──────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Truck, title: 'Free Shipping', desc: 'Orders over R800' },
            { icon: Shield, title: 'Secure Payment', desc: 'Paystack & Ozow' },
            { icon: RefreshCw, title: 'Easy Returns', desc: '30 day policy' },
            { icon: Headphones, title: '24/7 Support', desc: 'Always here' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title}
              className="flex flex-col items-center text-center p-6 border border-[#161616] hover:border-[#c0c0c0]/30 transition-colors duration-200">
              <div className="w-10 h-10 border border-[#1e1e1e] flex items-center justify-center mb-4">
                <Icon size={18} className="text-[#c0c0c0]" />
              </div>
              <h4 className="text-white font-semibold text-sm mb-1"
                style={{ fontFamily: 'Space Mono, monospace' }}>{title}</h4>
              <p className="text-[#555555] text-xs">{desc}</p>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
};

export default Home;