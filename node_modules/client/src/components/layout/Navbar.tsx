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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { label: 'New Arrivals', path: '/products?sort=new' },
    { label: 'Streetwear', path: '/products?category=streetwear' },
    { label: 'Luxury', path: '/products?category=luxury' },
    { label: 'Sale', path: '/products?sale=true' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span
              className="text-2xl font-bold tracking-[0.3em] text-white"
              style={{ fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.3em' }}
            >
              MON<span className="text-[#c9a84c]">OX</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className="text-[#888888] hover:text-[#c9a84c] text-sm font-medium tracking-widest uppercase transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            <button className="text-[#888888] hover:text-white transition-colors">
              <Search size={20} />
            </button>

            {user ? (
              <div className="relative group">
                <button className="text-[#888888] hover:text-white transition-colors">
                  <User size={20} />
                </button>
                <div className="absolute right-0 top-8 w-48 bg-[#1a1a1a] border border-[#222222] rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-xl">
                  <div className="px-4 py-3 border-b border-[#222222]">
                    <p className="text-white text-sm font-medium">{user.name}</p>
                    <p className="text-[#888888] text-xs">{user.email}</p>
                  </div>
                  <Link to="/orders" className="block px-4 py-2 text-sm text-[#888888] hover:text-white hover:bg-[#222222] transition-colors">
                    My Orders
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="block px-4 py-2 text-sm text-[#c9a84c] hover:bg-[#222222] transition-colors">
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-[#888888] hover:text-[#e53e3e] hover:bg-[#222222] transition-colors rounded-b-lg"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-[#888888] hover:text-white transition-colors text-sm font-medium tracking-wider uppercase"
              >
                Login
              </Link>
            )}

            <Link to="/cart" className="relative text-[#888888] hover:text-white transition-colors">
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#c9a84c] text-black text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            <button
              className="md:hidden text-[#888888] hover:text-white transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <XIcon size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-[#1a1a1a] py-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className="block py-3 text-[#888888] hover:text-[#c9a84c] text-sm font-medium tracking-widest uppercase transition-colors"
              >
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