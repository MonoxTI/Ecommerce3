import { useQuery } from '@tanstack/react-query';
import { ShoppingBag, Users, Package, TrendingUp, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { getAllOrders } from '../../services/orderService';
import { getProducts } from '../../services/productService';

const StatCard = ({ title, value, icon: Icon, color, sub }: any) => (
  <div className="bg-[#111111] border border-[#1a1a1a] rounded-xl p-6 hover:border-[#c9a84c]/30 transition-colors">
    <div className="flex items-center justify-between mb-4">
      <p className="text-[#888888] text-sm font-medium tracking-wider uppercase">{title}</p>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
        <Icon size={18} />
      </div>
    </div>
    <p className="text-white text-3xl font-bold">{value}</p>
    {sub && <p className="text-[#888888] text-xs mt-1">{sub}</p>}
  </div>
);

const AdminDashboard = () => {
  const { data: ordersData } = useQuery({ queryKey: ['admin-orders'], queryFn: () => getAllOrders() });
  const { data: productsData } = useQuery({ queryKey: ['admin-products'], queryFn: () => getProducts({ limit: 100 }) });

  const orders = ordersData || [];
  const products = productsData?.products || [];

  const revenue = orders
    .filter((o: any) => ['confirmed', 'processing', 'shipped', 'delivered'].includes(o.status))
    .reduce((sum: number, o: any) => sum + Number(o.total), 0);

  const statusCount = (status: string) => orders.filter((o: any) => o.status === status).length;
  const lowStock = products.filter((p: any) => p.stock < 10);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-white text-3xl font-bold" style={{ fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.05em' }}>
          Dashboard
        </h1>
        <p className="text-[#888888] text-sm mt-1">Welcome back, here's what's happening with MONOX today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Revenue" value={`R${revenue.toFixed(2)}`} icon={TrendingUp} color="bg-[#c9a84c]/10 text-[#c9a84c]" sub="Confirmed orders" />
        <StatCard title="Total Orders" value={orders.length} icon={ShoppingBag} color="bg-blue-500/10 text-blue-400" sub={`${statusCount('pending')} pending`} />
        <StatCard title="Products" value={products.length} icon={Package} color="bg-purple-500/10 text-purple-400" sub={`${lowStock.length} low stock`} />
        <StatCard title="Customers" value="—" icon={Users} color="bg-green-500/10 text-green-400" sub="Registered users" />
      </div>

      {/* Order Status Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Pending', status: 'pending', icon: Clock, color: 'text-yellow-400' },
          { label: 'Confirmed', status: 'confirmed', icon: CheckCircle, color: 'text-blue-400' },
          { label: 'Shipped', status: 'shipped', icon: Truck, color: 'text-purple-400' },
          { label: 'Cancelled', status: 'cancelled', icon: XCircle, color: 'text-red-400' },
        ].map(({ label, status, icon: Icon, color }) => (
          <div key={status} className="bg-[#111111] border border-[#1a1a1a] rounded-xl p-4 flex items-center gap-3">
            <Icon size={20} className={color} />
            <div>
              <p className="text-white font-bold text-xl">{statusCount(status)}</p>
              <p className="text-[#888888] text-xs">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-[#111111] border border-[#1a1a1a] rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">Recent Orders</h2>
          {orders.length === 0 ? (
            <p className="text-[#888888] text-sm text-center py-8">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map((order: any) => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-[#1a1a1a] last:border-0">
                  <div>
                    <p className="text-white text-sm font-medium">#{order.id.slice(0, 8)}</p>
                    <p className="text-[#888888] text-xs">{order.items?.length} items</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#c9a84c] text-sm font-semibold">R{Number(order.total).toFixed(2)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      order.status === 'delivered' ? 'bg-green-500/10 text-green-400' :
                      order.status === 'shipped' ? 'bg-purple-500/10 text-purple-400' :
                      order.status === 'cancelled' ? 'bg-red-500/10 text-red-400' :
                      'bg-yellow-500/10 text-yellow-400'
                    }`}>{order.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Alert */}
        <div className="bg-[#111111] border border-[#1a1a1a] rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">Low Stock Alert</h2>
          {lowStock.length === 0 ? (
            <p className="text-[#888888] text-sm text-center py-8">All products well stocked ✅</p>
          ) : (
            <div className="space-y-3">
              {lowStock.slice(0, 5).map((p: any) => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-[#1a1a1a] last:border-0">
                  <div>
                    <p className="text-white text-sm font-medium">{p.name}</p>
                    <p className="text-[#888888] text-xs">{p.category}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg ${p.stock === 0 ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                    {p.stock === 0 ? 'Out of stock' : `${p.stock} left`}
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