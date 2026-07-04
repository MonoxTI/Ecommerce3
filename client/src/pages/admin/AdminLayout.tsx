import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingBag, Users,
  Tag, BarChart3, Menu, X, LogOut, ChevronRight
} from 'lucide-react';
import { useUserStore } from '../../store/userStore';

const navItems = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Products', path: '/admin/products', icon: Package },
  { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
  { label: 'Customers', path: '/admin/customers', icon: Users },
  { label: 'Inventory', path: '/admin/inventory', icon: BarChart3 },
  { label: 'Coupons', path: '/admin/coupons', icon: Tag },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useUserStore();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="flex h-screen bg-[#0a0a0a] overflow-hidden">

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-60' : 'w-16'} bg-[#111111] border-r border-[#1a1a1a] flex flex-col transition-all duration-300 flex-shrink-0`}>
        {/* Logo */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-[#1a1a1a]">
          {sidebarOpen && (
            <span className="text-xl font-bold text-white tracking-widest"
              style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
              MON<span className="text-[#c9a84c]">OX</span>
            </span>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-[#888888] hover:text-white transition-colors p-1">
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map(({ label, path, icon: Icon }) => {
            const active = location.pathname === path;
            return (
              <Link key={path} to={path}
                className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg mb-1 transition-all duration-200
                  ${active ? 'bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20' : 'text-[#888888] hover:text-white hover:bg-[#1a1a1a]'}`}>
                <Icon size={18} className="flex-shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium">{label}</span>}
                {sidebarOpen && active && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="border-t border-[#1a1a1a] p-4">
          {sidebarOpen && (
            <div className="mb-3">
              <p className="text-white text-sm font-medium truncate">{user?.name}</p>
              <p className="text-[#c9a84c] text-xs">Admin</p>
            </div>
          )}
          <button onClick={handleLogout}
            className="flex items-center gap-2 text-[#888888] hover:text-[#e53e3e] transition-colors text-sm w-full">
            <LogOut size={16} />
            {sidebarOpen && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;