import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight, MapPin, CreditCard, Check } from 'lucide-react';
import { getCart } from '../services/cartService';
import { placeOrder } from '../services/orderService';
import API from '../services/api';
import { useCartStore } from '../store/cartStore';
import { useUserStore } from '../store/userStore';

const PROVINCES = ['Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape', 'Limpopo', 'Mpumalanga', 'North West', 'Free State', 'Northern Cape'];

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { clearCart } = useCartStore();

  const [step, setStep] = useState<'address' | 'payment'>('address');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'ozow'>('paystack');
  const [error, setError] = useState('');

  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: '',
    street: '',
    city: '',
    province: 'Gauteng',
    postalCode: '',
    country: 'South Africa',
  });
  const [notes, setNotes] = useState('');

  const { data: cart } = useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
    enabled: !!user,
  });

  const orderMutation = useMutation({
    mutationFn: () => placeOrder({ shippingAddress: address, notes }),
    onSuccess: (data) => {
      setOrderId(data.order.id);
      setStep('payment');
    },
    onError: (err: any) => setError(err.response?.data?.message || 'Failed to place order'),
  });

  const paymentMutation = useMutation({
    mutationFn: () => API.post(`/payments/${paymentMethod}/initialize`, { orderId }).then(r => r.data),
    onSuccess: (data) => {
      clearCart();
      const url = paymentMethod === 'paystack' ? data.authorizationUrl : data.paymentUrl;
      window.location.href = url;
    },
    onError: (err: any) => setError(err.response?.data?.message || 'Payment initialization failed'),
  });

  if (!user) { navigate('/login'); return null; }
  if (!cart?.items?.length) { navigate('/cart'); return null; }

  const shippingFee = Number(cart.total) >= 800 ? 0 : 80;
  const total = Number(cart.total) + shippingFee;

  const inputClass = "w-full bg-[#080808] border border-[#1e1e1e] focus:border-[#c0c0c0] text-white px-4 py-3 outline-none transition-colors text-sm placeholder-[#333333]";
  const labelClass = "text-[#555555] text-xs tracking-[0.2em] uppercase block mb-2";

  return (
    <main className="pt-16 min-h-screen bg-[#080808]">
      <div className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(192,192,192,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(192,192,192,0.015) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => step === 'payment' ? setStep('address') : navigate('/cart')}
            className="text-[#555555] hover:text-white transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-white text-4xl font-black" style={{ fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.05em' }}>
              Checkout
            </h1>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-0 mb-10">
          {[
            { key: 'address', label: 'Shipping' },
            { key: 'payment', label: 'Payment' },
          ].map((s, i) => (
            <div key={s.key} className="flex items-center">
              <div className={`flex items-center gap-2 px-4 py-2 border text-xs transition-colors ${step === s.key || (s.key === 'address' && step === 'payment') ? 'border-[#c0c0c0] bg-[#c0c0c0]/10 text-[#c0c0c0]' : 'border-[#1e1e1e] text-[#444444]'}`}
                style={{ fontFamily: 'Space Mono, monospace' }}>
                {step === 'payment' && s.key === 'address' ? (
                  <Check size={12} />
                ) : (
                  <span>{i + 1}</span>
                )}
                {s.label.toUpperCase()}
              </div>
              {i === 0 && <div className="w-8 h-px bg-[#1e1e1e]" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left — Form */}
          <div className="lg:col-span-2">
            {step === 'address' && (
              <div className="border border-[#1e1e1e] bg-[#0f0f0f] p-6">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#1e1e1e]">
                  <MapPin size={16} className="text-[#c0c0c0]" />
                  <p className="text-white text-xs font-bold tracking-[0.2em] uppercase"
                    style={{ fontFamily: 'Space Mono, monospace' }}>Shipping Address</p>
                </div>

                {error && (
                  <div className="border border-[#e53e3e]/40 bg-[#e53e3e]/5 text-[#e53e3e] px-4 py-3 mb-5 text-xs"
                    style={{ fontFamily: 'Space Mono, monospace' }}>✗ {error}</div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className={labelClass} style={{ fontFamily: 'Space Mono, monospace' }}>Full Name</label>
                    <input value={address.fullName} onChange={e => setAddress({ ...address, fullName: e.target.value })}
                      placeholder="John Doe" className={inputClass} required />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass} style={{ fontFamily: 'Space Mono, monospace' }}>Phone Number</label>
                    <input value={address.phone} onChange={e => setAddress({ ...address, phone: e.target.value })}
                      placeholder="0821234567" className={inputClass} required />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass} style={{ fontFamily: 'Space Mono, monospace' }}>Street Address</label>
                    <input value={address.street} onChange={e => setAddress({ ...address, street: e.target.value })}
                      placeholder="123 Main Street, Apt 4B" className={inputClass} required />
                  </div>
                  <div>
                    <label className={labelClass} style={{ fontFamily: 'Space Mono, monospace' }}>City</label>
                    <input value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })}
                      placeholder="Johannesburg" className={inputClass} required />
                  </div>
                  <div>
                    <label className={labelClass} style={{ fontFamily: 'Space Mono, monospace' }}>Province</label>
                    <select value={address.province} onChange={e => setAddress({ ...address, province: e.target.value })}
                      className={inputClass} style={{ fontFamily: 'Space Mono, monospace' }}>
                      {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass} style={{ fontFamily: 'Space Mono, monospace' }}>Postal Code</label>
                    <input value={address.postalCode} onChange={e => setAddress({ ...address, postalCode: e.target.value })}
                      placeholder="2000" className={inputClass} required />
                  </div>
                  <div>
                    <label className={labelClass} style={{ fontFamily: 'Space Mono, monospace' }}>Country</label>
                    <input value={address.country} readOnly className={`${inputClass} opacity-50 cursor-not-allowed`} />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass} style={{ fontFamily: 'Space Mono, monospace' }}>Order Notes (optional)</label>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)}
                      placeholder="Special delivery instructions..."
                      rows={3}
                      className="w-full bg-[#080808] border border-[#1e1e1e] focus:border-[#c0c0c0] text-white px-4 py-3 outline-none transition-colors text-sm placeholder-[#333333] resize-none" />
                  </div>
                </div>

                <button
                  onClick={() => {
                    setError('');
                    const { fullName, phone, street, city, postalCode } = address;
                    if (!fullName || !phone || !street || !city || !postalCode) {
                      setError('Please fill in all required fields');
                      return;
                    }
                    orderMutation.mutate();
                  }}
                  disabled={orderMutation.isPending}
                  className="w-full bg-[#c0c0c0] hover:bg-white disabled:opacity-40 text-black font-black py-4 transition-colors tracking-[0.2em] uppercase text-sm mt-6 flex items-center justify-center gap-2"
                  style={{ fontFamily: 'Space Mono, monospace' }}>
                  {orderMutation.isPending ? '// Processing...' : <><span>// Continue to Payment</span> <ArrowRight size={14} /></>}
                </button>
              </div>
            )}

            {step === 'payment' && (
              <div className="border border-[#1e1e1e] bg-[#0f0f0f] p-6">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#1e1e1e]">
                  <CreditCard size={16} className="text-[#c0c0c0]" />
                  <p className="text-white text-xs font-bold tracking-[0.2em] uppercase"
                    style={{ fontFamily: 'Space Mono, monospace' }}>Payment Method</p>
                </div>

                {error && (
                  <div className="border border-[#e53e3e]/40 bg-[#e53e3e]/5 text-[#e53e3e] px-4 py-3 mb-5 text-xs"
                    style={{ fontFamily: 'Space Mono, monospace' }}>✗ {error}</div>
                )}

                <div className="space-y-3 mb-6">
                  {[
                    {
                      key: 'paystack',
                      title: 'Paystack',
                      desc: 'Card, Instant EFT, Mobile Money',
                      tag: 'Recommended',
                    },
                    {
                      key: 'ozow',
                      title: 'Ozow',
                      desc: 'Instant EFT / Bank Transfer',
                      tag: 'Bank Transfer',
                    },
                  ].map(method => (
                    <button
                      key={method.key}
                      onClick={() => setPaymentMethod(method.key as 'paystack' | 'ozow')}
                      className={`w-full flex items-center justify-between p-4 border transition-all text-left ${paymentMethod === method.key ? 'border-[#c0c0c0] bg-[#c0c0c0]/5' : 'border-[#1e1e1e] hover:border-[#555555]'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-4 h-4 border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === method.key ? 'border-[#c0c0c0]' : 'border-[#333333]'}`}>
                          {paymentMethod === method.key && <div className="w-2 h-2 bg-[#c0c0c0]" />}
                        </div>
                        <div>
                          <p className="text-white text-sm font-bold" style={{ fontFamily: 'Space Mono, monospace' }}>
                            {method.title}
                          </p>
                          <p className="text-[#555555] text-xs">{method.desc}</p>
                        </div>
                      </div>
                      <span className="text-[#444444] text-xs border border-[#1e1e1e] px-2 py-1"
                        style={{ fontFamily: 'Space Mono, monospace' }}>
                        {method.tag}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Security note */}
                <div className="border border-[#1e1e1e] bg-[#080808] p-4 mb-6">
                  <p className="text-[#444444] text-xs" style={{ fontFamily: 'Space Mono, monospace' }}>
                    // Your payment is processed securely. KIR never stores your card details.
                    You will be redirected to {paymentMethod === 'paystack' ? 'Paystack' : 'Ozow'} to complete payment.
                  </p>
                </div>

                <button
                  onClick={() => paymentMutation.mutate()}
                  disabled={paymentMutation.isPending}
                  className="w-full bg-[#c0c0c0] hover:bg-white disabled:opacity-40 text-black font-black py-4 transition-colors tracking-[0.2em] uppercase text-sm flex items-center justify-center gap-2"
                  style={{ fontFamily: 'Space Mono, monospace' }}>
                  {paymentMutation.isPending
                    ? '// Redirecting...'
                    : <><span>// Pay R{total.toFixed(2)}</span> <ArrowRight size={14} /></>}
                </button>
              </div>
            )}
          </div>

          {/* Right — Order Summary */}
          <div className="lg:col-span-1">
            <div className="border border-[#1e1e1e] bg-[#0f0f0f] p-5 sticky top-24">
              <p className="text-white text-xs font-bold tracking-[0.2em] uppercase mb-5 pb-4 border-b border-[#1e1e1e]"
                style={{ fontFamily: 'Space Mono, monospace' }}>// Order Summary</p>

              {/* Items */}
              <div className="space-y-3 mb-5">
                {cart.items.map((item: any) => (
                  <div key={`${item.productId}-${item.size}-${item.color}`}
                    className="flex gap-3 items-center">
                    <div className="w-12 h-12 bg-[#161616] border border-[#1e1e1e] overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#333333] text-xs">?</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-medium truncate">{item.name}</p>
                      <p className="text-[#444444] text-xs" style={{ fontFamily: 'Space Mono, monospace' }}>
                        {item.size} / {item.color} × {item.quantity}
                      </p>
                    </div>
                    <p className="text-[#c0c0c0] text-xs font-bold flex-shrink-0"
                      style={{ fontFamily: 'Space Mono, monospace' }}>
                      R{Number(item.subtotal).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-[#1e1e1e] pt-4 space-y-2 text-xs" style={{ fontFamily: 'Space Mono, monospace' }}>
                <div className="flex justify-between">
                  <span className="text-[#555555]">Subtotal</span>
                  <span className="text-white">R{Number(cart.total).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#555555]">Shipping</span>
                  <span className={shippingFee === 0 ? 'text-green-400' : 'text-white'}>
                    {shippingFee === 0 ? 'FREE' : `R${shippingFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t border-[#1e1e1e] pt-3 flex justify-between">
                  <span className="text-white font-bold">Total</span>
                  <span className="text-[#c0c0c0] font-black text-base">R{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Checkout;