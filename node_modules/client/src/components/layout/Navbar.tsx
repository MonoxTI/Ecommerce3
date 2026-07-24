import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X as XIcon, User, Search } from 'lucide-react';
import { useUserStore } from '../../store/userStore';
import { useCartStore } from '../../store/cartStore';

const navLinks = [
  {
    label: 'New Drops',
    path: '/products?sort=new',
    mega: [
      { label: 'Latest Arrivals', path: '/products?sort=new' },
      { label: 'Best Sellers', path: '/products?sort=popular' },
      { label: 'Limited Drops', path: '/products?tag=limited' },
    ],
  },
  {
    label: 'Apparel',
    path: '/products?category=apparel',
    mega: [
      { label: 'T-Shirts', path: '/products?category=tshirts' },
      { label: 'Hoodies', path: '/products?category=hoodies' },
      { label: 'Jackets', path: '/products?category=jackets' },
      { label: 'Pants', path: '/products?category=pants' },
      { label: 'Tracksuits', path: '/products?category=tracksuits' },
    ],
  },
  {
    label: 'Accessories',
    path: '/products?category=accessories',
    mega: [
      { label: 'Bags', path: '/products?category=bags' },
      { label: 'Hats', path: '/products?category=hats' },
      { label: 'Jewellery', path: '/products?category=jewellery' },
    ],
  },
  { label: 'Sale', path: '/products?sale=true', mega: [] },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useUserStore();
  const { itemCount } = useCartStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setActiveMenu(null);
  }, [location]);

  const handleLogout = () => { logout(); navigate('/'); };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* ── Announcement bar ─────────────────────────────── */}
      <div className="bg-[#cc1352] text-white text-center py-2.5 text-xs font-medium tracking-[0.2em]"
        style={{ fontFamily: 'Space Mono, monospace' }}>
        FREE SHIPPING ON ORDERS OVER R800 &nbsp;·&nbsp; SECURE CHECKOUT &nbsp;·&nbsp; FREE RETURNS
      </div>

      {/* ── Main Nav ─────────────────────────────────────── */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 border-b border-[#d5d8d9]/20 ${
        scrolled ? 'bg-[#4f5256]/98 backdrop-blur-md shadow-2xl' : 'bg-[#4f5256]'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
              <div className="w-8 h-8 bg-[#cc1352] flex items-center justify-center group-hover:bg-[#e8175e] transition-colors">
                <span className="text-white text-xs font-black"
                  style={{ fontFamily: 'Space Mono, monospace' }}>K</span>
              </div>
              <span className="text-lg font-black text-white tracking-[0.35em]"
                style={{ fontFamily: 'Bebas Neue, sans-serif' }}>KIR</span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map(link => (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => link.mega.length > 0 && setActiveMenu(link.label)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <Link
                    to={link.path}
                    className={`text-xs font-medium tracking-[0.15em] uppercase transition-colors duration-200 py-5 block relative ${
                      activeMenu === link.label
                        ? 'text-[#cc1352]'
                        : 'text-[#d5d8d9] hover:text-white'
                    }`}
                    style={{ fontFamily: 'Space Mono, monospace' }}
                  >
                    {link.label}
                    {activeMenu === link.label && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#cc1352]" />
                    )}
                  </Link>

                  {/* Mega dropdown */}
                  {link.mega.length > 0 && activeMenu === link.label && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-52 bg-[#3a3d40] border border-[#d5d8d9]/20 border-t-2 border-t-[#cc1352] shadow-2xl py-2 z-50">
                      {link.mega.map(item => (
                        <Link
                          key={item.label}
                          to={item.path}
                          className="flex items-center gap-2 px-4 py-2.5 text-xs text-[#d5d8d9] hover:text-white hover:bg-[#4f5256] transition-colors group"
                          style={{ fontFamily: 'Space Mono, monospace' }}
                        >
                          <span className="w-1 h-1 bg-[#cc1352] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-4">

              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className={`transition-colors p-1 ${searchOpen ? 'text-[#cc1352]' : 'text-[#d5d8d9] hover:text-white'}`}
              >
                <Search size={18} />
              </button>

              {/* User dropdown */}
              {user ? (
                <div className="relative group hidden lg:block">
                  <button className="text-[#d5d8d9] hover:text-white transition-colors p-1">
                    <User size={18} />
                  </button>
                  <div className="absolute right-0 top-full w-56 bg-[#3a3d40] border border-[#d5d8d9]/20 border-t-2 border-t-[#cc1352] shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="px-4 py-4 border-b border-[#d5d8d9]/20">
                      <p className="text-white text-sm font-bold">{user.name}</p>
                      <p className="text-[#9a9d9f] text-xs mt-0.5 truncate">{user.email}</p>
                    </div>
                    <Link to="/orders"
                      className="flex items-center gap-2 px-4 py-3 text-xs text-[#d5d8d9] hover:text-white hover:bg-[#4f5256] transition-colors"
                      style={{ fontFamily: 'Space Mono, monospace' }}>
                      My Orders
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/admin"
                        className="flex items-center gap-2 px-4 py-3 text-xs text-[#cc1352] hover:bg-[#4f5256] transition-colors border-t border-[#d5d8d9]/20"
                        style={{ fontFamily: 'Space Mono, monospace' }}>
                        Admin Panel
                      </Link>
                    )}
                    <button onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-xs text-[#d5d8d9] hover:text-[#e53e3e] hover:bg-[#4f5256] transition-colors border-t border-[#d5d8d9]/20"
                      style={{ fontFamily: 'Space Mono, monospace' }}>
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link to="/login"
                  className="hidden lg:block text-[#d5d8d9] hover:text-white transition-colors text-xs tracking-[0.15em] uppercase"
                  style={{ fontFamily: 'Space Mono, monospace' }}>
                  Login
                </Link>
              )}

              {/* Cart */}
              <Link to="/cart" className="relative text-[#d5d8d9] hover:text-white transition-colors p-1">
                <ShoppingBag size={18} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#cc1352] text-white text-[9px] font-black w-4 h-4 flex items-center justify-center leading-none">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </Link>

              {/* Mobile toggle */}
              <button
                className="lg:hidden text-[#d5d8d9] hover:text-white transition-colors p-1"
                onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <XIcon size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Search Dropdown ───────────────────────────── */}
        {searchOpen && (
          <div className="border-t border-[#d5d8d9]/20 bg-[#3a3d40]">
            <div className="max-w-2xl mx-auto px-4 py-4">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="flex-1 relative">
                  <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a9d9f]" />
                  <input
                    autoFocus
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search products, categories..."
                    className="w-full bg-[#4f5256] border border-[#d5d8d9]/20 focus:border-[#cc1352] text-white pl-10 pr-4 py-3 text-sm outline-none transition-colors placeholder-[#9a9d9f]"
                  />
                </div>
                <button type="submit"
                  className="bg-[#cc1352] hover:bg-[#e8175e] text-white font-black px-6 py-3 text-xs transition-colors tracking-[0.15em] uppercase"
                  style={{ fontFamily: 'Space Mono, monospace' }}>
                  Search
                </button>
                <button type="button"
                  onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                  className="text-[#9a9d9f] hover:text-white transition-colors px-2">
                  <XIcon size={18} />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ── Mobile Menu ───────────────────────────────── */}
        {menuOpen && (
          <div className="lg:hidden border-t border-[#d5d8d9]/20 bg-[#3a3d40]">
            <div className="px-4 py-4">
              <div className="space-y-0 mb-4">
                {navLinks.map(link => (
                  <div key={link.label}>
                    <Link
                      to={link.path}
                      className="flex items-center justify-between py-3.5 text-white text-sm font-bold border-b border-[#d5d8d9]/15 hover:text-[#cc1352] transition-colors"
                      style={{ fontFamily: 'Space Mono, monospace' }}>
                      {link.label}
                      {link.mega.length > 0 && (
                        <span className="text-[#9a9d9f] text-xs">→</span>
                      )}
                    </Link>
                    {link.mega.length > 0 && (
                      <div className="pl-4 py-1 border-b border-[#d5d8d9]/15">
                        {link.mega.map(item => (
                          <Link
                            key={item.label}
                            to={item.path}
                            className="block py-2 text-[#d5d8d9] hover:text-[#cc1352] text-xs transition-colors"
                            style={{ fontFamily: 'Space Mono, monospace' }}>
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-[#d5d8d9]/20">
                {user ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-3 mb-4 p-3 bg-[#4f5256] border border-[#d5d8d9]/20">
                      <div className="w-8 h-8 bg-[#cc1352] flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-black">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-white text-sm font-bold">{user.name}</p>
                        <p className="text-[#9a9d9f] text-xs">{user.email}</p>
                      </div>
                    </div>
                    <Link to="/orders"
                      className="block py-2.5 text-[#d5d8d9] hover:text-white text-xs transition-colors"
                      style={{ fontFamily: 'Space Mono, monospace' }}>
                      My Orders
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/admin"
                        className="block py-2.5 text-[#cc1352] text-xs"
                        style={{ fontFamily: 'Space Mono, monospace' }}>
                        Admin Panel
                      </Link>
                    )}
                    <button onClick={handleLogout}
                      className="block py-2.5 text-[#e53e3e] text-xs w-full text-left"
                      style={{ fontFamily: 'Space Mono, monospace' }}>
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <Link to="/login"
                      className="flex-1 border border-[#d5d8d9]/25 hover:border-[#cc1352] text-white text-center py-3 text-xs tracking-[0.15em] uppercase transition-colors"
                      style={{ fontFamily: 'Space Mono, monospace' }}>
                      Login
                    </Link>
                    <Link to="/register"
                      className="flex-1 bg-[#cc1352] hover:bg-[#e8175e] text-white text-center py-3 text-xs font-black tracking-[0.15em] uppercase transition-colors"
                      style={{ fontFamily: 'Space Mono, monospace' }}>
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;