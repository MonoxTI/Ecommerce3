import { useQuery } from '@tanstack/react-query';
import { ShoppingBag, Users, Package, TrendingUp, Clock, CheckCircle, Truck, XCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAllOrders } from '../../services/orderService';
import { getProducts } from '../../services/productService';

const StatCard = ({ title, value, icon: Icon, sub, accent = false }: any) => (
  <div className={`border p-5 transition-colors hover:border-[#c0c0c0]/40 ${accent ? 'border-[#c0c0c0]/30 bg-[#c0c0c0]/5' : 'border-[#d5d8d9]/20 bg-[#4f5256]'}`}>
    <div className="flex items-center justify-between mb-3">
      <p className="text-[#9a9d9f] text-xs tracking-[0.2em] uppercase" style={{ fontFamily: 'Space Mono, monospace' }}>{title}</p>
      <Icon size={16} className={accent ? 'text-[#c0c0c0]' : 'text-[#6a6d70]'} />
    </div>
    <p className={`text-3xl font-black ${accent ? 'text-[#c0c0c0]' : 'text-white'}`}
      style={{ fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.05em' }}>{value}</p>
    {sub && <p className="text-[#9a9d9f] text-xs mt-1" style={{ fontFamily: 'Space Mono, monospace' }}>{sub}</p>}
  </div>
);

const statusColors: Record<string, string> = {
  pending: 'text-yellow-400',
  confirmed: 'text-blue-400',
  processing: 'text-purple-400',
  shipped: 'text-indigo-400',
  delivered: 'text-green-400',
  cancelled: 'text-red-400',
};

const AdminDashboard = () => {
  const { data: ordersData } = useQuery({ queryKey: ['admin-orders'], queryFn: () => getAllOrders() });
  const { data: productsData } = useQuery({ queryKey: ['admin-products-dash'], queryFn: () => getProducts({ limit: 100 }) });

  const orders = ordersData || [];
  const products = productsData?.products || [];

  const revenue = orders
    .filter((o: any) => ['confirmed', 'processing', 'shipped', 'delivered'].includes(o.status))
    .reduce((sum: number, o: any) => sum + Number(o.total), 0);

  const statusCount = (s: string) => orders.filter((o: any) => o.status === s).length;
  const lowStock = products.filter((p: any) => p.stock < 10);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[#9a9d9f] text-xs tracking-[0.3em] uppercase mb-1" style={{ fontFamily: 'Space Mono, monospace' }}>// Overview</p>
          <h1 className="text-white text-5xl font-black" style={{ fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.05em' }}>
            Dashboard
          </h1>
        </div>
        <div className="text-right">
          <p className="text-[#6a6d70] text-xs" style={{ fontFamily: 'Space Mono, monospace' }}>
            {new Date().toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard title="Revenue" value={`R${revenue.toFixed(0)}`} icon={TrendingUp} sub="confirmed orders" accent />
        <StatCard title="Orders" value={orders.length} icon={ShoppingBag} sub={`${statusCount('pending')} pending`} />
        <StatCard title="Products" value={products.length} icon={Package} sub={`${lowStock.length} low stock`} />
        <StatCard title="Customers" value="—" icon={Users} sub="registered" />
      </div>

      {/* Order Status */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Pending', status: 'pending', icon: Clock },
          { label: 'Confirmed', status: 'confirmed', icon: CheckCircle },
          { label: 'Shipped', status: 'shipped', icon: Truck },
          { label: 'Cancelled', status: 'cancelled', icon: XCircle },
        ].map(({ label, status, icon: Icon }) => (
          <div key={status} className="bg-[#4f5256] border border-[#d5d8d9]/20 p-4 flex items-center gap-3 hover:border-[#c0c0c0]/20 transition-colors">
            <Icon size={16} className={statusColors[status]} />
            <div>
              <p className="text-white font-black text-2xl" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{statusCount(status)}</p>
              <p className="text-[#9a9d9f] text-xs" style={{ fontFamily: 'Space Mono, monospace' }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Orders */}
        <div className="bg-[#4f5256] border border-[#d5d8d9]/20">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#d5d8d9]/20">
            <p className="text-white text-xs font-bold tracking-[0.2em] uppercase" style={{ fontFamily: 'Space Mono, monospace' }}>
              // Recent Orders
            </p>
            <Link to="/admin/orders" className="text-[#c0c0c0] hover:text-white text-xs flex items-center gap-1 transition-colors"
              style={{ fontFamily: 'Space Mono, monospace' }}>
              View all <ArrowRight size={10} />
            </Link>
          </div>
          {orders.length === 0 ? (
            <p className="text-[#6a6d70] text-xs text-center py-10" style={{ fontFamily: 'Space Mono, monospace' }}>No orders yet</p>
          ) : (
            <div>
              {orders.slice(0, 6).map((order: any) => (
                <div key={order.id} className="flex items-center justify-between px-5 py-3 border-b border-[#161616] last:border-0 hover:bg-[#3a3d40] transition-colors">
                  <div>
                    <p className="text-white text-xs font-mono">#{order.id.slice(0, 8)}</p>
                    <p className="text-[#9a9d9f] text-xs">{order.items?.length} items</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#c0c0c0] text-sm font-black" style={{ fontFamily: 'Space Mono, monospace' }}>
                      R{Number(order.total).toFixed(2)}
                    </p>
                    <p className={`text-xs ${statusColors[order.status]}`} style={{ fontFamily: 'Space Mono, monospace' }}>
                      {order.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock */}
        <div className="bg-[#4f5256] border border-[#d5d8d9]/20">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#d5d8d9]/20">
            <p className="text-white text-xs font-bold tracking-[0.2em] uppercase" style={{ fontFamily: 'Space Mono, monospace' }}>
              // Low Stock Alert
            </p>
            <Link to="/admin/inventory" className="text-[#c0c0c0] hover:text-white text-xs flex items-center gap-1 transition-colors"
              style={{ fontFamily: 'Space Mono, monospace' }}>
              View all <ArrowRight size={10} />
            </Link>
          </div>
          {lowStock.length === 0 ? (
            <p className="text-[#6a6d70] text-xs text-center py-10" style={{ fontFamily: 'Space Mono, monospace' }}>
              ✓ All products stocked
            </p>
          ) : (
            <div>
              {lowStock.slice(0, 6).map((p: any) => (
                <div key={p.id} className="flex items-center justify-between px-5 py-3 border-b border-[#161616] last:border-0 hover:bg-[#3a3d40] transition-colors">
                  <div>
                    <p className="text-white text-xs font-medium">{p.name}</p>
                    <p className="text-[#9a9d9f] text-xs">{p.category}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 border ${p.stock === 0 ? 'border-red-500/30 text-red-400 bg-red-500/5' : 'border-yellow-500/30 text-yellow-400 bg-yellow-500/5'}`}
                    style={{ fontFamily: 'Space Mono, monospace' }}>
                    {p.stock === 0 ? 'OUT' : `${p.stock} left`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;