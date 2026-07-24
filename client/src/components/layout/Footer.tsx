import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Footer = () => (
  <footer className="	bg-[#3a3d40] border-t border-[#d5d8d9]/20 mt-20">

    {/* Top banner */}
    <div className="border-b border-[#d5d8d9]/20 py-4 overflow-hidden">
      <div className="flex gap-0 whitespace-nowrap" style={{ animation: 'scroll 30s linear infinite' }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={i} className="text-[#1a1a1a] text-2xl font-black tracking-[0.3em] uppercase flex-shrink-0 select-none"
            style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
            KIR ✦ STREET ✦ RAW ✦ 2026 ✦&nbsp;
          </span>
        ))}
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* Main grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-0 border-b border-[#d5d8d9]/20">

        {/* Brand — left column */}
        <div className="md:col-span-4 border-r border-[#d5d8d9]/20 py-12 pr-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#c0c0c0] flex items-center justify-center">
              <span className="text-black text-sm font-black" style={{ fontFamily: 'Space Mono, monospace' }}>K</span>
            </div>
            <span className="text-3xl font-black text-white tracking-[0.4em]"
              style={{ fontFamily: 'Bebas Neue, sans-serif' }}>KIR</span>
          </div>
          <p className="text-[#9a9d9f] text-sm leading-relaxed mb-8 max-w-xs">
            Raw energy. Street culture. No compromises. Built for those who move different.
          </p>

          {/* Social links */}
          <div className="space-y-2">
            {[
              { label: 'Instagram', handle: '@kir.official' },
              { label: 'Twitter', handle: '@kir_street' },
              { label: 'TikTok', handle: '@kir' },
            ].map(({ label, handle }) => (
              <a key={label} href="#"
                className="flex items-center justify-between group border border-[#d5d8d9]/20 hover:border-[#c0c0c0] px-4 py-2.5 transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-1 bg-[#c0c0c0]" />
                  <span className="text-[#9a9d9f] group-hover:text-white text-xs transition-colors"
                    style={{ fontFamily: 'Space Mono, monospace' }}>{label}</span>
                </div>
                <span className="text-[#6a6d70] group-hover:text-[#c0c0c0] text-xs transition-colors"
                  style={{ fontFamily: 'Space Mono, monospace' }}>{handle}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Links — middle */}
        <div className="md:col-span-4 border-r border-[#d5d8d9]/20 py-12 px-8">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-[#c0c0c0] text-xs font-bold tracking-[0.3em] uppercase mb-5 flex items-center gap-2"
                style={{ fontFamily: 'Space Mono, monospace' }}>
                <span className="text-[#6a6d70]">//</span> Shop
              </p>
              {['New Drops', 'Streetwear', 'Luxury', 'Accessories', 'Sale'].map(item => (
                <Link key={item} to="#"
                  className="flex items-center gap-2 text-[#9a9d9f] hover:text-white text-sm py-2 transition-colors group">
                  <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#c0c0c0]" />
                  {item}
                </Link>
              ))}
            </div>
            <div>
              <p className="text-[#c0c0c0] text-xs font-bold tracking-[0.3em] uppercase mb-5 flex items-center gap-2"
                style={{ fontFamily: 'Space Mono, monospace' }}>
                <span className="text-[#6a6d70]">//</span> Help
              </p>
              {['Size Guide', 'Shipping', 'Returns', 'Track Order', 'FAQ'].map(item => (
                <Link key={item} to="#"
                  className="flex items-center gap-2 text-[#9a9d9f] hover:text-white text-sm py-2 transition-colors group">
                  <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#c0c0c0]" />
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter — right */}
        <div className="md:col-span-4 py-12 pl-8">
          <p className="text-[#c0c0c0] text-xs font-bold tracking-[0.3em] uppercase mb-2 flex items-center gap-2"
            style={{ fontFamily: 'Space Mono, monospace' }}>
            <span className="text-[#6a6d70]">//</span> Stay Raw
          </p>
          <p className="text-white text-2xl font-black mb-2"
            style={{ fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.05em' }}>
            First to the drop.
          </p>
          <p className="text-[#9a9d9f] text-sm mb-6">
            Early access. No spam. Ever.
          </p>

          <div className="space-y-3">
            <input type="email" placeholder="your@email.com"
              className="w-full bg-[#4f5256] border border-[#d5d8d9]/20 focus:border-[#c0c0c0] text-white text-sm px-4 py-3 outline-none transition-colors placeholder-[#6a6d70]" />
            <button className="w-full bg-[#c0c0c0] hover:bg-white text-black text-xs font-black py-3 transition-colors tracking-[0.2em] uppercase flex items-center justify-center gap-2"
              style={{ fontFamily: 'Space Mono, monospace' }}>
              Subscribe <ArrowRight size={12} />
            </button>
          </div>

          {/* Trust signals */}
          <div className="mt-8 space-y-2">
            {[
              'Free shipping over R800',
              '30-day returns',
              'Secure payments via Paystack & Ozow',
            ].map(item => (
              <div key={item} className="flex items-center gap-2">
                <div className="w-1 h-1 bg-[#c0c0c0] flex-shrink-0" />
                <span className="text-[#9a9d9f] text-xs">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="py-5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[#2a2a2a] text-xs" style={{ fontFamily: 'Space Mono, monospace' }}>
          © 2026 KIR. All rights reserved. Built different.
        </p>
        <div className="flex gap-0">
          {['Privacy', 'Terms', 'Cookies'].map((item, i) => (
            <Link key={item} to="#"
              className={`text-[#2a2a2a] hover:text-[#9a9d9f] text-xs transition-colors tracking-wider uppercase px-4 py-1 ${i > 0 ? 'border-l border-[#d5d8d9]/20' : ''}`}
              style={{ fontFamily: 'Space Mono, monospace' }}>
              {item}
            </Link>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;