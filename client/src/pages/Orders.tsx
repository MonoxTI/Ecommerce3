import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Package, ChevronRight, ShoppingBag, ArrowRight } from 'lucide-react';
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
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-center">
        <ShoppingBag size={48} className="text-[#222222] mx-auto mb-4" />
        <p className="text-white text-xl mb-2">Sign in to view your orders</p>
        <Link to="/login"
          className="text-[#cc1352] hover:text-[#e8175e] text-sm transition-colors underline underline-offset-4">
          Sign in
        </Link>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen bg-[#0a0a0a]">

      {/* Page header */}
      <div className="border-b border-[#1e1e1e] bg-[#0f0f0f]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-[#cc1352] text-xs tracking-[0.3em] uppercase mb-1"
            style={{ fontFamily: 'Space Mono, monospace' }}>// Account</p>
          <h1 className="text-white text-4xl md:text-5xl font-black"
            style={{ fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.05em' }}>
            My Orders
          </h1>
          <p className="text-[#555555] text-xs mt-1"
            style={{ fontFamily: 'Space Mono, monospace' }}>
            {orders.length} order{orders.length !== 1 ? 's' : ''} placed
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-32 bg-[#111111] border border-[#1e1e1e] animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-[#1e1e1e]">
            <ShoppingBag size={48} className="text-[#222222] mx-auto mb-4" />
            <p className="text-white text-2xl font-black mb-2"
              style={{ fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.05em' }}>
              No Orders Yet
            </p>
            <p className="text-[#555555] text-sm mb-8">
              Start shopping to see your orders here
            </p>
            <Link to="/products"
              className="inline-flex items-center gap-2 bg-[#cc1352] hover:bg-[#e8175e] text-white font-black px-8 py-4 text-xs transition-colors tracking-[0.15em] uppercase"
              style={{ fontFamily: 'Space Mono, monospace' }}>
              Shop Now <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order: any) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="block bg-[#0f0f0f] border border-[#1e1e1e] hover:border-[#cc1352]/30 p-5 transition-all duration-200 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {/* Icon */}
                    <div className="w-10 h-10 border border-[#1e1e1e] group-hover:border-[#cc1352]/40 flex items-center justify-center transition-colors">
                      <Package size={16} className="text-[#cc1352]" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm"
                        style={{ fontFamily: 'Space Mono, monospace' }}>
                        #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-[#555555] text-xs">
                        {new Date(order.createdAt).toLocaleDateString('en-ZA', {
                          day: 'numeric', month: 'long', year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-3 py-1 border font-bold ${statusColors[order.status]}`}
                      style={{ fontFamily: 'Space Mono, monospace' }}>
                      {order.status.toUpperCase()}
                    </span>
                    <ChevronRight size={14} className="text-[#333333] group-hover:text-[#cc1352] transition-colors" />
                  </div>
                </div>

                {/* Item previews */}
                <div className="flex gap-2 mb-4">
                  {order.items?.slice(0, 4).map((item: any, i: number) => (
                    <div key={i} className="w-12 h-12 bg-[#161616] border border-[#1e1e1e] overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={14} className="text-[#333333]" />
                        </div>
                      )}
                    </div>
                  ))}
                  {order.items?.length > 4 && (
                    <div className="w-12 h-12 bg-[#161616] border border-[#1e1e1e] flex items-center justify-center">
                      <span className="text-[#555555] text-xs" style={{ fontFamily: 'Space Mono, monospace' }}>
                        +{order.items.length - 4}
                      </span>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center pt-3 border-t border-[#1e1e1e]">
                  <p className="text-[#555555] text-xs" style={{ fontFamily: 'Space Mono, monospace' }}>
                    {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                  </p>
                  <p className="text-[#cc1352] font-black text-sm"
                    style={{ fontFamily: 'Space Mono, monospace' }}>
                    R{Number(order.total).toFixed(2)}
                  </p>
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