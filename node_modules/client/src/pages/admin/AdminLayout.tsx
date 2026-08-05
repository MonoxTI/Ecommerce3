import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import { LayoutDashboard, Package, ShoppingBag, Users, Tag, BarChart3, Menu, X as XIcon, LogOut, ChevronRight, Bell, Settings, Layers } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, desc: 'Overview & stats' },
  { label: 'Products', path: '/admin/products', icon: Package, desc: 'Manage catalogue' },
  { label: 'Categories', path: '/admin/categories', icon: Layers, desc: 'Manage categories' }, // ← ADD
  { label: 'Orders', path: '/admin/orders', icon: ShoppingBag, desc: 'Track & fulfil' },
  { label: 'Customers', path: '/admin/customers', icon: Users, desc: 'User accounts' },
  { label: 'Inventory', path: '/admin/inventory', icon: BarChart3, desc: 'Stock levels' },
  { label: 'Coupons', path: '/admin/coupons', icon: Tag, desc: 'Discounts & codes' },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useUserStore();

  const handleLogout = () => { logout(); navigate('/login'); };

  const currentPage = navItems.find(n => n.path === location.pathname);

  return (
    <div className="flex h-screen 	bg-[#3a3d40] overflow-hidden">

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-60' : 'w-16'} 	bg-[#3a3d40] border-r border-[#d5d8d9]/20 flex flex-col transition-all duration-300 flex-shrink-0 relative`}>

        {/* Logo */}
        <div className={`flex items-center h-16 border-b border-[#d5d8d9]/20 ${sidebarOpen ? 'px-5 gap-3' : 'justify-center'}`}>
          <div className="w-8 h-8 bg-[#c0c0c0] flex items-center justify-center flex-shrink-0">
            <span className="text-black text-xs font-black" style={{ fontFamily: 'Space Mono, monospace' }}>K</span>
          </div>
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-white text-lg font-black tracking-[0.3em] leading-none"
                style={{ fontFamily: 'Bebas Neue, sans-serif' }}>KIR</p>
              <p className="text-[#6a6d70] text-xs" style={{ fontFamily: 'Space Mono, monospace' }}>admin panel</p>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`text-[#9a9d9f] hover:text-white transition-colors flex-shrink-0 ${!sidebarOpen ? 'hidden' : ''}`}>
            <XIcon size={16} />
          </button>
        </div>

        {/* Toggle when closed */}
        {!sidebarOpen && (
          <button onClick={() => setSidebarOpen(true)}
            className="absolute -right-3 top-20 w-6 h-6 bg-[#3a3d40] border border-[#d5d8d9]/15 flex items-center justify-center text-[#9a9d9f] hover:text-white transition-colors z-10">
            <ChevronRight size={12} />
          </button>
        )}

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
          {sidebarOpen && (
            <p className="text-[#2a2a2a] text-xs tracking-[0.3em] uppercase px-5 mb-3"
              style={{ fontFamily: 'Space Mono, monospace' }}>Navigation</p>
          )}
          <div className="space-y-0.5 px-2">
            {navItems.map(({ label, path, icon: Icon, desc }) => {
              const active = location.pathname === path;
              return (
                <Link key={path} to={path}
                  className={`flex items-center gap-3 px-3 py-3 transition-all duration-150 group relative ${
                    active
                      ? 'bg-[#c0c0c0]/8 text-white border-l-2 border-[#c0c0c0]'
                      : 'text-[#9a9d9f] hover:text-white hover:bg-[#4f5256] border-l-2 border-transparent'
                  }`}>
                  <div className={`flex-shrink-0 ${active ? 'text-[#c0c0c0]' : 'text-current'}`}>
                    <Icon size={17} />
                  </div>
                  {sidebarOpen && (
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold tracking-wider uppercase leading-none"
                        style={{ fontFamily: 'Space Mono, monospace' }}>{label}</p>
                      <p className="text-[#6a6d70] text-xs mt-0.5 truncate">{desc}</p>
                    </div>
                  )}
                  {sidebarOpen && active && (
                    <div className="w-1.5 h-1.5 bg-[#c0c0c0] flex-shrink-0" />
                  )}

                  {/* Tooltip when collapsed */}
                  {!sidebarOpen && (
                    <div className="absolute left-full ml-3 px-3 py-2 bg-[#4f5256] border border-[#d5d8d9]/20 text-white text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50"
                      style={{ fontFamily: 'Space Mono, monospace' }}>
                      {label}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom */}
        <div className="border-t border-[#d5d8d9]/20 p-3 space-y-1">
          {sidebarOpen && (
            <div className="flex items-center gap-3 p-3 bg-[#4f5256] border border-[#d5d8d9]/20 mb-3">
              <div className="w-8 h-8 bg-[#3a3d40] border border-[#d5d8d9]/15 flex items-center justify-center flex-shrink-0">
                <span className="text-[#c0c0c0] text-xs font-black">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-medium truncate">{user?.name}</p>
                <p className="text-[#c0c0c0] text-xs" style={{ fontFamily: 'Space Mono, monospace' }}>// admin</p>
              </div>
            </div>
          )}
          <button onClick={handleLogout}
            className={`flex items-center gap-3 w-full px-3 py-2.5 text-[#9a9d9f] hover:text-[#e53e3e] hover:bg-[#e53e3e]/5 transition-colors group ${!sidebarOpen ? 'justify-center' : ''}`}>
            <LogOut size={15} />
            {sidebarOpen && (
              <span className="text-xs tracking-wider uppercase" style={{ fontFamily: 'Space Mono, monospace' }}>
                Logout
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <header className="h-16 border-b border-[#d5d8d9]/20 	bg-[#3a3d40] flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            {!sidebarOpen && (
              <button onClick={() => setSidebarOpen(true)}
                className="text-[#9a9d9f] hover:text-white transition-colors mr-2">
                <Menu size={18} />
              </button>
            )}
            <div>
              <p className="text-white text-sm font-bold" style={{ fontFamily: 'Space Mono, monospace' }}>
                {currentPage?.label || 'Dashboard'}
              </p>
              <p className="text-[#6a6d70] text-xs" style={{ fontFamily: 'Space Mono, monospace' }}>
                // {currentPage?.desc || 'Overview & stats'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Breadcrumb */}
            <div className="hidden md:flex items-center gap-2 text-xs"
              style={{ fontFamily: 'Space Mono, monospace' }}>
              <Link to="/" className="text-[#6a6d70] hover:text-[#9a9d9f] transition-colors">kir.store</Link>
              <span className="text-[#222222]">/</span>
              <span className="text-[#9a9d9f]">admin</span>
              {currentPage && (
                <>
                  <span className="text-[#222222]">/</span>
                  <span className="text-[#c0c0c0]">{currentPage.label.toLowerCase()}</span>
                </>
              )}
            </div>

            <div className="w-px h-6 bg-[#3a3d40]" />

            <button className="w-8 h-8 border border-[#d5d8d9]/20 hover:border-[#c0c0c0] flex items-center justify-center text-[#9a9d9f] hover:text-white transition-colors">
              <Bell size={14} />
            </button>
            <button className="w-8 h-8 border border-[#d5d8d9]/20 hover:border-[#c0c0c0] flex items-center justify-center text-[#9a9d9f] hover:text-white transition-colors">
              <Settings size={14} />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto 	bg-[#3a3d40]">
          <div className="p-6 max-w-screen-2xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;