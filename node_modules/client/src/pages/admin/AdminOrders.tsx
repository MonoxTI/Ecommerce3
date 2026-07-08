import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { X as XIcon } from 'lucide-react';
import { getAllOrders, updateOrderStatus } from '../../services/orderService';

const statusColors: Record<string, string> = {
  pending: 'border-yellow-500/30 text-yellow-400 bg-yellow-500/5',
  confirmed: 'border-blue-500/30 text-blue-400 bg-blue-500/5',
  processing: 'border-purple-500/30 text-purple-400 bg-purple-500/5',
  shipped: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/5',
  delivered: 'border-green-500/30 text-green-400 bg-green-500/5',
  cancelled: 'border-red-500/30 text-red-400 bg-red-500/5',
};

const AdminOrders = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [newStatus, setNewStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin-orders', statusFilter],
    queryFn: () => getAllOrders(statusFilter || undefined),
  });

  const updateMutation = useMutation({
    mutationFn: () => updateOrderStatus(selectedOrder.id, { status: newStatus, trackingNumber }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-orders'] }); setSelectedOrder(null); },
  });

  const inputClass = "w-full bg-[#080808] border border-[#1e1e1e] focus:border-[#c0c0c0] text-white px-3 py-2.5 outline-none text-sm placeholder-[#333333] transition-colors";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[#444444] text-xs tracking-[0.3em] mb-1" style={{ fontFamily: 'Space Mono, monospace' }}>// Manage</p>
          <h1 className="text-white text-5xl font-black" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>Orders</h1>
          <p className="text-[#444444] text-xs" style={{ fontFamily: 'Space Mono, monospace' }}>{orders.length} total</p>
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="bg-[#0f0f0f] border border-[#1e1e1e] text-white px-4 py-2.5 text-xs outline-none focus:border-[#c0c0c0] transition-colors"
          style={{ fontFamily: 'Space Mono, monospace' }}>
          <option value="">All Statuses</option>
          {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
            <option key={s} value={s}>{s.toUpperCase()}</option>
          ))}
        </select>
      </div>

      <div className="border border-[#1e1e1e] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1e1e1e] bg-[#0f0f0f]">
              {['Order', 'Customer', 'Items', 'Total', 'Status', 'Date', 'Action'].map(h => (
                <th key={h} className="text-left text-[#444444] text-xs font-bold tracking-[0.2em] uppercase px-4 py-3"
                  style={{ fontFamily: 'Space Mono, monospace' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-b border-[#161616]">
                  {Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="px-4 py-3"><div className="h-4 bg-[#161616] animate-pulse" /></td>
                  ))}
                </tr>
              ))
            ) : orders.length === 0 ? (
              <tr><td colSpan={7} className="text-center text-[#444444] py-16 text-xs"
                style={{ fontFamily: 'Space Mono, monospace' }}>// No orders found</td></tr>
            ) : (
              orders.map((order: any) => (
                <tr key={order.id} className="border-b border-[#161616] hover:bg-[#0f0f0f] transition-colors group">
                  <td className="px-4 py-3 text-white text-xs font-mono">#{order.id.slice(0, 8)}</td>
                  <td className="px-4 py-3 text-[#777777] text-sm">{order.shippingAddress?.fullName}</td>
                  <td className="px-4 py-3 text-[#555555] text-xs">{order.items?.length}</td>
                  <td className="px-4 py-3 text-[#c0c0c0] text-sm font-bold"
                    style={{ fontFamily: 'Space Mono, monospace' }}>
                    R{Number(order.total).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 border font-bold ${statusColors[order.status]}`}
                      style={{ fontFamily: 'Space Mono, monospace' }}>
                      {order.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#444444] text-xs"
                    style={{ fontFamily: 'Space Mono, monospace' }}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => { setSelectedOrder(order); setNewStatus(order.status); setTrackingNumber(order.trackingNumber || ''); }}
                      className="text-xs text-[#555555] hover:text-[#c0c0c0] border border-[#1e1e1e] hover:border-[#c0c0c0] px-3 py-1.5 transition-colors opacity-0 group-hover:opacity-100"
                      style={{ fontFamily: 'Space Mono, monospace' }}>
                      Update
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Update Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f0f0f] border border-[#1e1e1e] w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-[#1e1e1e]">
              <p className="text-white text-xs font-bold tracking-[0.2em] uppercase"
                style={{ fontFamily: 'Space Mono, monospace' }}>
                // Update Order #{selectedOrder.id.slice(0, 8)}
              </p>
              <button onClick={() => setSelectedOrder(null)} className="text-[#555555] hover:text-white transition-colors">
                <XIcon size={16} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-[#555555] text-xs tracking-[0.2em] uppercase block mb-2"
                  style={{ fontFamily: 'Space Mono, monospace' }}>Status</label>
                <select value={newStatus} onChange={e => setNewStatus(e.target.value)} className={inputClass}
                  style={{ fontFamily: 'Space Mono, monospace' }}>
                  {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                    <option key={s} value={s}>{s.toUpperCase()}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[#555555] text-xs tracking-[0.2em] uppercase block mb-2"
                  style={{ fontFamily: 'Space Mono, monospace' }}>Tracking Number</label>
                <input value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)}
                  placeholder="SA123456789" className={inputClass} />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setSelectedOrder(null)}
                  className="flex-1 border border-[#1e1e1e] text-[#555555] hover:text-white py-3 text-xs transition-colors"
                  style={{ fontFamily: 'Space Mono, monospace' }}>
                  Cancel
                </button>
                <button onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending}
                  className="flex-1 bg-[#c0c0c0] hover:bg-white disabled:opacity-40 text-black font-black py-3 text-xs transition-colors"
                  style={{ fontFamily: 'Space Mono, monospace' }}>
                  {updateMutation.isPending ? '// Saving...' : '// Update'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;