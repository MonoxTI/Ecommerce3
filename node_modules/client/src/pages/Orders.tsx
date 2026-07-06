import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Package, ChevronRight, ShoppingBag } from 'lucide-react';
import { getMyOrders } from '../services/orderService';
import { useUserStore } from '../store/userStore';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  confirmed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  processing: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  shipped: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  delivered: 'bg-green-500/10 text-green-400 border-green-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const Orders = () => {
  const { user } = useUserStore();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: getMyOrders,
    enabled: !!user,
  });

  if (!user) return (
    <main className="pt-16 min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-center">
        <p className="text-white text-xl mb-4">Sign in to view your orders</p>
        <Link to="/login" className="text-[#c9a84c] hover:underline">Sign in</Link>
      </div>
    </main>
  );

  return (
    <main className="pt-16 min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-white text-4xl" style={{ fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.05em' }}>
            My Orders
          </h1>
          <p className="text-[#888888] text-sm">{orders.length} orders placed</p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-[#111111] rounded-xl h-32 animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-[#222222] rounded-2xl">
            <ShoppingBag size={60} className="text-[#333333] mx-auto mb-4" />
            <p className="text-white text-xl font-medium mb-2">No orders yet</p>
            <p className="text-[#888888] text-sm mb-6">Start shopping to see your orders here</p>
            <Link to="/products"
              className="inline-flex items-center gap-2 bg-[#c9a84c] hover:bg-[#a8893d] text-black font-semibold px-6 py-3 rounded-lg text-sm transition-colors">
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="block bg-[#111111] border border-[#1a1a1a] hover:border-[#c9a84c]/30 rounded-xl p-5 transition-all duration-200 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#1a1a1a] rounded-lg flex items-center justify-center">
                      <Package size={18} className="text-[#c9a84c]" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">#{order.id.slice(0, 8).toUpperCase()}</p>
                      <p className="text-[#888888] text-xs">{new Date(order.createdAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-3 py-1 rounded-full border font-medium ${statusColors[order.status]}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <ChevronRight size={16} className="text-[#444444] group-hover:text-[#c9a84c] transition-colors" />
                  </div>
                </div>

                {/* Items preview */}
                <div className="flex gap-2 mb-4">
                  {order.items?.slice(0, 4).map((item: any, i: number) => (
                    <div key={i} className="w-12 h-12 bg-[#1a1a1a] rounded-lg overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={16} className="text-[#333333]" />
                        </div>
                      )}
                    </div>
                  ))}
                  {order.items?.length > 4 && (
                    <div className="w-12 h-12 bg-[#1a1a1a] rounded-lg flex items-center justify-center">
                      <span className="text-[#888888] text-xs">+{order.items.length - 4}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-[#888888] text-sm">{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</p>
                  <p className="text-[#c9a84c] font-bold">R{Number(order.total).toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Orders;