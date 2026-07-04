import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllOrders, updateOrderStatus } from '../../services/orderService';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-400',
  confirmed: 'bg-blue-500/10 text-blue-400',
  processing: 'bg-purple-500/10 text-purple-400',
  shipped: 'bg-indigo-500/10 text-indigo-400',
  delivered: 'bg-green-500/10 text-green-400',
  cancelled: 'bg-red-500/10 text-red-400',
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      setSelectedOrder(null);
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-3xl font-bold" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>Orders</h1>
          <p className="text-[#888888] text-sm">{orders.length} orders</p>
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="bg-[#111111] border border-[#1a1a1a] text-white px-4 py-2 rounded-lg text-sm outline-none focus:border-[#c9a84c]">
          <option value="">All Statuses</option>
          {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      <div className="bg-[#111111] border border-[#1a1a1a] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1a1a1a]">
              {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date', 'Actions'].map(h => (
                <th key={h} className="text-left text-[#888888] text-xs font-medium tracking-wider uppercase px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-[#1a1a1a]">
                  {Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="px-4 py-3"><div className="h-4 bg-[#1a1a1a] rounded animate-pulse" /></td>
                  ))}
                </tr>
              ))
            ) : orders.length === 0 ? (
              <tr><td colSpan={7} className="text-center text-[#888888] py-12">No orders found</td></tr>
            ) : (
              orders.map((order: any) => (
                <tr key={order.id} className="border-b border-[#1a1a1a] hover:bg-[#1a1a1a]/50 transition-colors">
                  <td className="px-4 py-3 text-white text-xs font-mono">#{order.id.slice(0, 8)}</td>
                  <td className="px-4 py-3 text-[#888888] text-sm">{order.shippingAddress?.fullName}</td>
                  <td className="px-4 py-3 text-[#888888] text-sm">{order.items?.length} items</td>
                  <td className="px-4 py-3 text-[#c9a84c] font-semibold text-sm">R{Number(order.total).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#888888] text-xs">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => { setSelectedOrder(order); setNewStatus(order.status); setTrackingNumber(order.trackingNumber || ''); }}
                      className="text-xs text-[#888888] hover:text-[#c9a84c] border border-[#222222] hover:border-[#c9a84c]/30 px-3 py-1.5 rounded-lg transition-colors">
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#1a1a1a] rounded-2xl w-full max-w-md p-6">
            <h2 className="text-white font-semibold mb-1">Update Order</h2>
            <p className="text-[#888888] text-xs mb-6">#{selectedOrder.id.slice(0, 8)}</p>

            <div className="space-y-4">
              <div>
                <label className="text-[#888888] text-xs tracking-wider uppercase block mb-2">Status</label>
                <select value={newStatus} onChange={e => setNewStatus(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-[#222222] text-white px-3 py-2.5 rounded-lg text-sm outline-none focus:border-[#c9a84c]">
                  {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[#888888] text-xs tracking-wider uppercase block mb-2">Tracking Number</label>
                <input value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)}
                  placeholder="SA123456789 (optional)"
                  className="w-full bg-[#1a1a1a] border border-[#222222] focus:border-[#c9a84c] text-white px-3 py-2.5 rounded-lg outline-none text-sm placeholder-[#444444] transition-colors" />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setSelectedOrder(null)}
                className="flex-1 border border-[#222222] text-[#888888] hover:text-white py-2.5 rounded-lg text-sm transition-colors">
                Cancel
              </button>
              <button onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending}
                className="flex-1 bg-[#c9a84c] hover:bg-[#a8893d] disabled:opacity-50 text-black font-semibold py-2.5 rounded-lg text-sm transition-colors">
                {updateMutation.isPending ? 'Saving...' : 'Update Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;