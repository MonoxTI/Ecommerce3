import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, XCircle, MapPin } from 'lucide-react';
import { getOrder, cancelOrder } from '../services/orderService';

const statusSteps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

const statusIcons: Record<string, any> = {
  pending: Clock,
  confirmed: CheckCircle,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
};

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrder(id!),
  });

  const cancelMutation = useMutation({
    mutationFn: () => cancelOrder(id!, cancelReason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      setShowCancelModal(false);
    },
  });

  if (isLoading) return (
    <main className="pt-16 min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-10 animate-pulse space-y-4">
        <div className="h-8 bg-[#111111] rounded w-48" />
        <div className="h-40 bg-[#111111] rounded-xl" />
        <div className="h-60 bg-[#111111] rounded-xl" />
      </div>
    </main>
  );

  if (!order) return (
    <main className="pt-16 min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-center">
        <p className="text-white text-xl mb-4">Order not found</p>
        <Link to="/orders" className="text-[#c9a84c] hover:underline">Back to orders</Link>
      </div>
    </main>
  );

  const currentStep = statusSteps.indexOf(order.status);
  const StatusIcon = statusIcons[order.status] || Clock;
  const canCancel = !['shipped', 'delivered', 'cancelled'].includes(order.status);

  return (
    <main className="pt-16 min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Back */}
        <button onClick={() => navigate('/orders')}
          className="flex items-center gap-2 text-[#888888] hover:text-white transition-colors text-sm mb-8">
          <ArrowLeft size={16} /> Back to Orders
        </button>

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-white text-3xl font-bold" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
              Order #{order.id.slice(0, 8).toUpperCase()}
            </h1>
            <p className="text-[#888888] text-sm mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          {canCancel && (
            <button onClick={() => setShowCancelModal(true)}
              className="text-[#e53e3e] border border-[#e53e3e]/30 hover:bg-[#e53e3e]/10 px-4 py-2 rounded-lg text-sm transition-colors">
              Cancel Order
            </button>
          )}
        </div>

        {/* Order Status Tracker */}
        {order.status !== 'cancelled' ? (
          <div className="bg-[#111111] border border-[#1a1a1a] rounded-xl p-6 mb-6">
            <h2 className="text-white font-semibold mb-6">Order Status</h2>
            <div className="relative">
              {/* Progress line */}
              <div className="absolute top-5 left-5 right-5 h-0.5 bg-[#222222]">
                <div
                  className="h-full bg-[#c9a84c] transition-all duration-500"
                  style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
                />
              </div>
              <div className="flex justify-between relative">
                {statusSteps.map((step, i) => {
                  const done = i <= currentStep;
                  const StepIcon = statusIcons[step];
                  return (
                    <div key={step} className="flex flex-col items-center gap-2">
                      <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 transition-colors ${
                        done ? 'bg-[#c9a84c] border-[#c9a84c]' : 'bg-[#0a0a0a] border-[#333333]'
                      }`}>
                        <StepIcon size={16} className={done ? 'text-black' : 'text-[#444444]'} />
                      </div>
                      <span className={`text-xs capitalize hidden md:block ${done ? 'text-[#c9a84c]' : 'text-[#444444]'}`}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {order.trackingNumber && (
              <div className="mt-6 bg-[#1a1a1a] rounded-lg p-4 flex items-center gap-3">
                <Truck size={18} className="text-[#c9a84c]" />
                <div>
                  <p className="text-[#888888] text-xs">Tracking Number</p>
                  <p className="text-white font-mono font-medium">{order.trackingNumber}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-[#e53e3e]/10 border border-[#e53e3e]/30 rounded-xl p-4 mb-6 flex items-center gap-3">
            <XCircle size={20} className="text-[#e53e3e]" />
            <div>
              <p className="text-[#e53e3e] font-medium">Order Cancelled</p>
              {order.cancelReason && <p className="text-[#888888] text-sm">{order.cancelReason}</p>}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Order Items */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-[#111111] border border-[#1a1a1a] rounded-xl p-6">
              <h2 className="text-white font-semibold mb-4">Items Ordered</h2>
              <div className="space-y-4">
                {order.items?.map((item: any, i: number) => (
                  <div key={i} className="flex gap-4 pb-4 border-b border-[#1a1a1a] last:border-0 last:pb-0">
                    <div className="w-16 h-16 bg-[#1a1a1a] rounded-xl overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={20} className="text-[#333333]" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">{item.name}</p>
                      <p className="text-[#888888] text-xs mt-0.5">Size: {item.size} · Color: {item.color}</p>
                      <p className="text-[#888888] text-xs">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-[#c9a84c] font-semibold text-sm">R{Number(item.subtotal).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-[#111111] border border-[#1a1a1a] rounded-xl p-6">
              <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                <MapPin size={16} className="text-[#c9a84c]" /> Shipping Address
              </h2>
              <div className="text-[#888888] text-sm space-y-1">
                <p className="text-white font-medium">{order.shippingAddress?.fullName}</p>
                <p>{order.shippingAddress?.phone}</p>
                <p>{order.shippingAddress?.street}</p>
                <p>{order.shippingAddress?.city}, {order.shippingAddress?.province}</p>
                <p>{order.shippingAddress?.postalCode}, {order.shippingAddress?.country}</p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-[#111111] border border-[#1a1a1a] rounded-xl p-6 h-fit">
            <h2 className="text-white font-semibold mb-4">Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#888888]">Subtotal</span>
                <span className="text-white">R{Number(order.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#888888]">Shipping</span>
                <span className="text-white">R{Number(order.shippingFee).toFixed(2)}</span>
              </div>
              <div className="border-t border-[#1a1a1a] pt-3 flex justify-between">
                <span className="text-white font-semibold">Total</span>
                <span className="text-[#c9a84c] font-bold text-lg">R{Number(order.total).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#1a1a1a] rounded-2xl w-full max-w-md p-6">
            <h2 className="text-white font-semibold mb-1">Cancel Order</h2>
            <p className="text-[#888888] text-sm mb-4">Please tell us why you're cancelling</p>
            <textarea
              value={cancelReason}
              onChange={e => setCancelReason(e.target.value)}
              placeholder="Reason for cancellation..."
              rows={3}
              className="w-full bg-[#1a1a1a] border border-[#222222] focus:border-[#c9a84c] text-white px-3 py-2.5 rounded-lg outline-none text-sm placeholder-[#444444] resize-none mb-4 transition-colors"
            />
            <div className="flex gap-3">
              <button onClick={() => setShowCancelModal(false)}
                className="flex-1 border border-[#222222] text-[#888888] hover:text-white py-2.5 rounded-lg text-sm transition-colors">
                Keep Order
              </button>
              <button
                onClick={() => cancelMutation.mutate()}
                disabled={!cancelReason || cancelMutation.isPending}
                className="flex-1 bg-[#e53e3e] hover:bg-red-600 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
              >
                {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default OrderDetail;