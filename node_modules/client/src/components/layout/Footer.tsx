import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-[#0f0f0f] border-t border-[#1e1e1e] mt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-[#c0c0c0] flex items-center justify-center">
              <span className="text-black text-xs font-black"
                style={{ fontFamily: 'Space Mono, monospace' }}>K</span>
            </div>
            <span className="text-2xl font-black text-white tracking-[0.4em]"
              style={{ fontFamily: 'Bebas Neue, sans-serif' }}>KIR</span>
          </div>
          <p className="text-[#777777] text-sm leading-relaxed">
            Raw energy. Street culture. No compromises. KIR is built for those who move different.
          </p>
          <div className="flex gap-5 mt-6">
            {['Instagram', 'Twitter', 'TikTok'].map(platform => (
              <a key={platform} href="#"
                className="text-[#555555] hover:text-[#c0c0c0] transition-colors text-xs tracking-wider uppercase"
                style={{ fontFamily: 'Space Mono, monospace' }}>
                {platform}
              </a>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div>
          <h4 className="text-[#c0c0c0] text-xs font-bold tracking-[0.3em] uppercase mb-5"
            style={{ fontFamily: 'Space Mono, monospace' }}>Shop</h4>
          {['New Drops', 'Streetwear', 'Luxury', 'Accessories', 'Sale'].map(item => (
            <Link key={item} to="#"
              className="block text-[#777777] hover:text-white text-sm py-1.5 transition-colors">
              {item}
            </Link>
          ))}
        </div>

        {/* Help */}
        <div>
          <h4 className="text-[#c0c0c0] text-xs font-bold tracking-[0.3em] uppercase mb-5"
            style={{ fontFamily: 'Space Mono, monospace' }}>Help</h4>
          {['Size Guide', 'Shipping Info', 'Returns', 'Track Order', 'FAQ'].map(item => (
            <Link key={item} to="#"
              className="block text-[#777777] hover:text-white text-sm py-1.5 transition-colors">
              {item}
            </Link>
          ))}
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-[#c0c0c0] text-xs font-bold tracking-[0.3em] uppercase mb-5"
            style={{ fontFamily: 'Space Mono, monospace' }}>Stay Raw</h4>
          <p className="text-[#777777] text-sm mb-4">Early access to drops. No spam. Ever.</p>
          <div className="flex gap-0">
            <input type="email" placeholder="your@email.com"
              className="flex-1 bg-[#161616] border border-[#1e1e1e] text-white text-sm px-3 py-2.5 outline-none focus:border-[#c0c0c0] transition-colors placeholder-[#333333]" />
            <button className="bg-[#c0c0c0] hover:bg-white text-black text-xs font-black px-4 py-2.5 transition-colors tracking-wider uppercase"
              style={{ fontFamily: 'Space Mono, monospace' }}>
              Join
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-[#1e1e1e] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[#333333] text-xs" style={{ fontFamily: 'Space Mono, monospace' }}>
          © 2026 KIR. All rights reserved.
        </p>
        <div className="flex gap-6">
          {['Privacy', 'Terms', 'Cookies'].map(item => (
            <Link key={item} to="#"
              className="text-[#333333] hover:text-[#777777] text-xs transition-colors tracking-wider uppercase"
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