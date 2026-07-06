import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X as XIcon, User, Search } from 'lucide-react';
import { useUserStore } from '../../store/userStore';
import { useCartStore } from '../../store/cartStore';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useUserStore();
  const { itemCount } = useCartStore();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  const navLinks = [
    { label: 'New Drops', path: '/products?sort=new' },
    { label: 'Streetwear', path: '/products?category=streetwear' },
    { label: 'Luxury', path: '/products?category=luxury' },
    { label: 'Sale', path: '/products?sale=true' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#080808]/98 backdrop-blur-md border-b border-[#1e1e1e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#c0c0c0] flex items-center justify-center">
              <span className="text-black text-xs font-black tracking-tighter"
                style={{ fontFamily: 'Space Mono, monospace' }}>K</span>
            </div>
            <span className="text-xl font-black text-white tracking-[0.4em]"
              style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
              KIR
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.label} to={link.path}
                className="text-[#777777] hover:text-[#c0c0c0] text-xs font-medium tracking-[0.2em] uppercase transition-colors duration-200"
                style={{ fontFamily: 'Space Mono, monospace' }}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-5">
            <button className="text-[#777777] hover:text-white transition-colors">
              <Search size={18} />
            </button>

            {user ? (
              <div className="relative group">
                <button className="text-[#777777] hover:text-white transition-colors">
                  <User size={18} />
                </button>
                <div className="absolute right-0 top-8 w-52 bg-[#0f0f0f] border border-[#1e1e1e] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-2xl">
                  <div className="px-4 py-3 border-b border-[#1e1e1e]">
                    <p className="text-white text-sm font-medium">{user.name}</p>
                    <p className="text-[#777777] text-xs" style={{ fontFamily: 'Space Mono, monospace' }}>{user.email}</p>
                  </div>
                  <Link to="/orders" className="block px-4 py-2.5 text-xs text-[#777777] hover:text-white hover:bg-[#161616] transition-colors tracking-wider uppercase"
                    style={{ fontFamily: 'Space Mono, monospace' }}>
                    My Orders
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="block px-4 py-2.5 text-xs text-[#c0c0c0] hover:bg-[#161616] transition-colors tracking-wider uppercase"
                      style={{ fontFamily: 'Space Mono, monospace' }}>
                      Admin Panel
                    </Link>
                  )}
                  <button onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-xs text-[#777777] hover:text-[#e53e3e] hover:bg-[#161616] transition-colors tracking-wider uppercase"
                    style={{ fontFamily: 'Space Mono, monospace' }}>
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login"
                className="text-[#777777] hover:text-white transition-colors text-xs font-medium tracking-[0.2em] uppercase"
                style={{ fontFamily: 'Space Mono, monospace' }}>
                Login
              </Link>
            )}

            <Link to="/cart" className="relative text-[#777777] hover:text-white transition-colors">
              <ShoppingBag size={18} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#c0c0c0] text-black text-[10px] font-black w-4 h-4 flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            <button className="md:hidden text-[#777777] hover:text-white transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <XIcon size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-[#1e1e1e] py-4 bg-[#080808]">
            {navLinks.map((link) => (
              <Link key={link.label} to={link.path} onClick={() => setMenuOpen(false)}
                className="block py-3 text-[#777777] hover:text-[#c0c0c0] text-xs font-medium tracking-[0.2em] uppercase transition-colors"
                style={{ fontFamily: 'Space Mono, monospace' }}>
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;