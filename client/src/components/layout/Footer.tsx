import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-[#111111] border-t border-[#1a1a1a] mt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="md:col-span-1">
          <span
            className="text-3xl font-bold text-white tracking-[0.3em]"
            style={{ fontFamily: 'Bebas Neue, sans-serif' }}
          >
            MON<span className="text-[#c9a84c]">OX</span>
          </span>
          <p className="mt-4 text-[#888888] text-sm leading-relaxed">
            Where street culture meets luxury fashion. Curated pieces for those who refuse to blend in.
          </p>
          <div className="flex gap-4 mt-6">
            {['Instagram', 'Twitter', 'TikTok'].map(platform => (
              <a key={platform} href="#"
                className="text-[#888888] hover:text-[#c9a84c] transition-colors text-xs font-medium tracking-wider uppercase">
                {platform}
              </a>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div>
          <h4 className="text-white text-sm font-semibold tracking-widest uppercase mb-4">Shop</h4>
          {['New Arrivals', 'Streetwear', 'Luxury', 'Accessories', 'Sale'].map(item => (
            <Link key={item} to="#" className="block text-[#888888] hover:text-white text-sm py-1 transition-colors">{item}</Link>
          ))}
        </div>

        {/* Help */}
        <div>
          <h4 className="text-white text-sm font-semibold tracking-widest uppercase mb-4">Help</h4>
          {['Size Guide', 'Shipping Info', 'Returns', 'Track Order', 'FAQ'].map(item => (
            <Link key={item} to="#" className="block text-[#888888] hover:text-white text-sm py-1 transition-colors">{item}</Link>
          ))}
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-white text-sm font-semibold tracking-widest uppercase mb-4">Stay in the Loop</h4>
          <p className="text-[#888888] text-sm mb-4">Get early access to drops and exclusive offers.</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-[#1a1a1a] border border-[#222222] text-white text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-[#c9a84c] transition-colors placeholder-[#444444]"
            />
            <button className="bg-[#c9a84c] hover:bg-[#a8893d] text-black text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
              Join
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-[#1a1a1a] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[#444444] text-xs">© 2026 MONOX. All rights reserved.</p>
        <div className="flex gap-6">
          {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
            <Link key={item} to="#" className="text-[#444444] hover:text-[#888888] text-xs transition-colors">{item}</Link>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;