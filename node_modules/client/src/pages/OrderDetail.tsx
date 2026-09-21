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
    <main className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-10 animate-pulse space-y-4">
        <div className="h-4 bg-[#4f5256] w-32" />
        <div className="h-8 bg-[#4f5256] w-64" />
        <div className="h-40 bg-[#4f5256]" />
        <div className="h-60 bg-[#4f5256]" />
      </div>
    </main>
  );

  if (!order) return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-center">
        <p className="text-white text-xl mb-4">Order not found</p>
        <Link to="/orders"
          className="text-[#cc1352] hover:text-[#e8175e] text-sm transition-colors underline underline-offset-4">
          Back to orders
        </Link>
      </div>
    </main>
  );

  const currentStep = statusSteps.indexOf(order.status);
  const canCancel = !['shipped', 'delivered', 'cancelled'].includes(order.status);

  return (
    <main className="min-h-screen bg-[#0a0a0a]">

      {/* Page header */}
      <div className="border-b border-[#d5d8d9]/20 bg-[#4f5256]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button onClick={() => navigate('/orders')}
            className="flex items-center gap-2 text-[#9a9d9f] hover:text-white transition-colors text-xs mb-4 group"
            style={{ fontFamily: 'Space Mono, monospace' }}>
            <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform" />
            Back to Orders
          </button>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[#cc1352] text-xs tracking-[0.3em] uppercase mb-1"
                style={{ fontFamily: 'Space Mono, monospace' }}>// Order</p>
              <h1 className="text-white text-3xl md:text-4xl font-black"
                style={{ fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.05em' }}>
                #{order.id.slice(0, 8).toUpperCase()}
              </h1>
              <p className="text-[#9a9d9f] text-xs mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-ZA', {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}
              </p>
            </div>
            {canCancel && (
              <button onClick={() => setShowCancelModal(true)}
                className="text-[#e53e3e] border border-[#e53e3e]/30 hover:bg-[#e53e3e]/10 px-4 py-2 text-xs transition-colors"
                style={{ fontFamily: 'Space Mono, monospace' }}>
                Cancel Order
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">

        {/* ── Status Tracker ──────────────────────────────── */}
        {order.status !== 'cancelled' ? (
          <div className="bg-[#4f5256] border border-[#d5d8d9]/20 p-6">
            <p className="text-white text-xs font-bold tracking-[0.2em] uppercase mb-6"
              style={{ fontFamily: 'Space Mono, monospace' }}>// Order Status</p>

            <div className="relative">
              {/* Background track */}
              <div className="absolute top-5 left-5 right-5 h-px bg-[#3a3d40]">
                <div
                  className="h-full bg-[#cc1352] transition-all duration-700"
                  style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
                />
              </div>

              <div className="flex justify-between relative z-10">
                {statusSteps.map((step, i) => {
                  const done = i <= currentStep;
                  const active = i === currentStep;
                  const StepIcon = statusIcons[step];
                  return (
                    <div key={step} className="flex flex-col items-center gap-2">
                      <div className={`w-10 h-10 border-2 flex items-center justify-center transition-all duration-300 ${
                        done
                          ? 'border-[#cc1352] bg-[#cc1352]'
                          : 'border-[#d5d8d9]/25 bg-[#0a0a0a]'
                      } ${active ? 'scale-110' : ''}`}>
                        <StepIcon size={15} className={done ? 'text-white' : 'text-[#6a6d70]'} />
                      </div>
                      <span className={`text-xs capitalize hidden md:block tracking-wider ${
                        done ? 'text-[#cc1352]' : 'text-[#6a6d70]'
                      }`} style={{ fontFamily: 'Space Mono, monospace' }}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tracking number */}
            {order.trackingNumber && (
              <div className="mt-6 border border-[#cc1352]/20 bg-[#cc1352]/5 p-4 flex items-center gap-3">
                <Truck size={16} className="text-[#cc1352] flex-shrink-0" />
                <div>
                  <p className="text-[#9a9d9f] text-xs" style={{ fontFamily: 'Space Mono, monospace' }}>
                    Tracking Number
                  </p>
                  <p className="text-white font-bold text-sm font-mono mt-0.5">
                    {order.trackingNumber}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="border border-[#e53e3e]/30 bg-[#e53e3e]/5 p-4 flex items-center gap-3">
            <XCircle size={18} className="text-[#e53e3e] flex-shrink-0" />
            <div>
              <p className="text-[#e53e3e] font-bold text-sm"
                style={{ fontFamily: 'Space Mono, monospace' }}>
                Order Cancelled
              </p>
              {order.cancelReason && (
                <p className="text-[#d5d8d9] text-xs mt-0.5">{order.cancelReason}</p>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* ── Items + Address ─────────────────────────── */}
          <div className="md:col-span-2 space-y-4">

            {/* Items */}
            <div className="bg-[#4f5256] border border-[#d5d8d9]/20 p-6">
              <p className="text-white text-xs font-bold tracking-[0.2em] uppercase mb-5 pb-4 border-b border-[#d5d8d9]/20"
                style={{ fontFamily: 'Space Mono, monospace' }}>// Items Ordered</p>

              <div className="space-y-4">
                {order.items?.map((item: any, i: number) => (
                  <div key={i} className="flex gap-4 pb-4 border-b border-[#d5d8d9]/20 last:border-0 last:pb-0">
                    <div className="w-16 h-16 bg-[#3a3d40] border border-[#d5d8d9]/20 overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={18} className="text-[#6a6d70]" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm">{item.name}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[#9a9d9f] text-xs border border-[#d5d8d9]/20 px-2 py-0.5"
                          style={{ fontFamily: 'Space Mono, monospace' }}>
                          {item.size}
                        </span>
                        <span className="text-[#9a9d9f] text-xs border border-[#d5d8d9]/20 px-2 py-0.5"
                          style={{ fontFamily: 'Space Mono, monospace' }}>
                          {item.color}
                        </span>
                        <span className="text-[#9a9d9f] text-xs" style={{ fontFamily: 'Space Mono, monospace' }}>
                          ×{item.quantity}
                        </span>
                      </div>
                    </div>
                    <p className="text-[#cc1352] font-black text-sm flex-shrink-0"
                      style={{ fontFamily: 'Space Mono, monospace' }}>
                      R{Number(item.subtotal).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping address */}
            <div className="bg-[#4f5256] border border-[#d5d8d9]/20 p-6">
              <p className="text-white text-xs font-bold tracking-[0.2em] uppercase mb-5 pb-4 border-b border-[#d5d8d9]/20 flex items-center gap-2"
                style={{ fontFamily: 'Space Mono, monospace' }}>
                <MapPin size={14} className="text-[#cc1352]" />
                // Shipping Address
              </p>
              <div className="space-y-1.5 text-sm">
                <p className="text-white font-bold">{order.shippingAddress?.fullName}</p>
                <p className="text-[#d5d8d9]">{order.shippingAddress?.phone}</p>
                <p className="text-[#d5d8d9]">{order.shippingAddress?.street}</p>
                <p className="text-[#d5d8d9]">
                  {order.shippingAddress?.city}, {order.shippingAddress?.province}
                </p>
                <p className="text-[#d5d8d9]">
                  {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
                </p>
              </div>
            </div>
          </div>

          {/* ── Order Summary ────────────────────────────── */}
          <div className="bg-[#4f5256] border border-[#d5d8d9]/20 p-6 h-fit">
            <p className="text-white text-xs font-bold tracking-[0.2em] uppercase mb-5 pb-4 border-b border-[#d5d8d9]/20"
              style={{ fontFamily: 'Space Mono, monospace' }}>// Summary</p>

            <div className="space-y-3 text-xs" style={{ fontFamily: 'Space Mono, monospace' }}>
              <div className="flex justify-between">
                <span className="text-[#9a9d9f]">Subtotal</span>
                <span className="text-white">R{Number(order.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9a9d9f]">Shipping</span>
                <span className="text-white">R{Number(order.shippingFee).toFixed(2)}</span>
              </div>
              <div className="border-t border-[#d5d8d9]/20 pt-3 flex justify-between items-center">
                <span className="text-white font-bold">Total</span>
                <span className="text-[#cc1352] font-black text-base">
                  R{Number(order.total).toFixed(2)}
                </span>
              </div>
              {/* Inside the Summary card, after the total line: */}
{order.paymentMethod && (
  <div className="border-t border-[#d5d8d9]/20 pt-3 mt-3">
    <div className="flex justify-between">
      <span className="text-[#9a9d9f]">Payment</span>
      <span className="text-white capitalize">
        {order.paymentMethod.replace(/_/g, ' ')}
      </span>
    </div>
  </div>
)}
            </div>
          </div>
        </div>
      </div>

      {/* ── Cancel Modal ─────────────────────────────────── */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#4f5256] border border-[#d5d8d9]/20 w-full max-w-md">
            <div className="px-6 py-5 border-b border-[#d5d8d9]/20">
              <p className="text-white text-sm font-bold" style={{ fontFamily: 'Space Mono, monospace' }}>
                // Cancel Order
              </p>
              <p className="text-[#9a9d9f] text-xs mt-1">Please tell us why you're cancelling</p>
            </div>
            <div className="p-6">
              <textarea
                value={cancelReason}
                onChange={e => setCancelReason(e.target.value)}
                placeholder="Reason for cancellation..."
                rows={4}
                className="w-full 	bg-[#3a3d40] border border-[#d5d8d9]/20 focus:border-[#cc1352] text-white px-4 py-3 outline-none text-sm placeholder-[#6a6d70] resize-none transition-colors mb-5"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 border border-[#d5d8d9]/20 hover:border-[#555555] text-[#9a9d9f] hover:text-white py-3 text-xs transition-colors"
                  style={{ fontFamily: 'Space Mono, monospace' }}>
                  Keep Order
                </button>
                <button
                  onClick={() => cancelMutation.mutate()}
                  disabled={!cancelReason || cancelMutation.isPending}
                  className="flex-1 bg-[#e53e3e] hover:bg-red-600 disabled:opacity-40 text-white font-black py-3 text-xs transition-colors"
                  style={{ fontFamily: 'Space Mono, monospace' }}>
                  {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default OrderDetail;