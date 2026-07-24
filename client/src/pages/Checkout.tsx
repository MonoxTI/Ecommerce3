import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight, MapPin, CreditCard, Check } from 'lucide-react';
import { getCart } from '../services/cartService';
import { placeOrder } from '../services/orderService';
import API from '../services/api';
import { useCartStore } from '../store/cartStore';
import { useUserStore } from '../store/userStore';

const PROVINCES = [
  'Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape',
  'Limpopo', 'Mpumalanga', 'North West', 'Free State', 'Northern Cape',
];

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { clearCart } = useCartStore();

  const [step, setStep] = useState<'address' | 'payment'>('address');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'ozow'>('paystack');
  const [error, setError] = useState('');
  const [notes, setNotes] = useState('');

  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: '',
    street: '',
    city: '',
    province: 'Gauteng',
    postalCode: '',
    country: 'South Africa',
  });

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

  const inputClass = "w-full 	bg-[#3a3d40] border border-[#d5d8d9]/20 focus:border-[#cc1352] text-white px-4 py-3 outline-none transition-colors text-sm placeholder-[#6a6d70]";
  const labelClass = "text-[#9a9d9f] text-xs tracking-[0.2em] uppercase block mb-2 font-medium";

  const handleContinue = () => {
    setError('');
    const { fullName, phone, street, city, postalCode } = address;
    if (!fullName || !phone || !street || !city || !postalCode) {
      setError('Please fill in all required fields');
      return;
    }
    orderMutation.mutate();
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a]">

      {/* Page header */}
      <div className="border-b border-[#d5d8d9]/20 bg-[#4f5256]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => step === 'payment' ? setStep('address') : navigate('/cart')}
            className="flex items-center gap-2 text-[#9a9d9f] hover:text-white transition-colors text-xs mb-4 group"
            style={{ fontFamily: 'Space Mono, monospace' }}>
            <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform" />
            {step === 'payment' ? 'Back to Shipping' : 'Back to Cart'}
          </button>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-[#cc1352] text-xs tracking-[0.3em] uppercase mb-1"
                style={{ fontFamily: 'Space Mono, monospace' }}>// Secure</p>
              <h1 className="text-white text-4xl font-black"
                style={{ fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.05em' }}>
                Checkout
              </h1>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-0">
              {[
                { key: 'address', label: 'Shipping' },
                { key: 'payment', label: 'Payment' },
              ].map((s, i) => (
                <div key={s.key} className="flex items-center">
                  <div className={`flex items-center gap-2 px-4 py-2 border text-xs transition-all ${
                    step === s.key
                      ? 'border-[#cc1352] bg-[#cc1352]/10 text-[#cc1352]'
                      : s.key === 'address' && step === 'payment'
                      ? 'border-[#22c55e]/40 bg-[#22c55e]/5 text-[#22c55e]'
                      : 'border-[#d5d8d9]/20 text-[#9a9d9f]'
                  }`} style={{ fontFamily: 'Space Mono, monospace' }}>
                    {step === 'payment' && s.key === 'address'
                      ? <Check size={11} />
                      : <span>{i + 1}</span>
                    }
                    {s.label.toUpperCase()}
                  </div>
                  {i === 0 && <div className="w-6 h-px bg-[#3a3d40]" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left — Forms ─────────────────────────────── */}
          <div className="lg:col-span-2">

            {/* ADDRESS STEP */}
            {step === 'address' && (
              <div className="border border-[#d5d8d9]/20 bg-[#4f5256]">
                <div className="flex items-center gap-2 px-6 py-5 border-b border-[#d5d8d9]/20">
                  <MapPin size={15} className="text-[#cc1352]" />
                  <p className="text-white text-xs font-bold tracking-[0.2em] uppercase"
                    style={{ fontFamily: 'Space Mono, monospace' }}>
                    Shipping Address
                  </p>
                </div>

                <div className="p-6">
                  {error && (
                    <div className="border border-[#e53e3e]/40 bg-[#e53e3e]/5 text-[#e53e3e] px-4 py-3 mb-5 text-xs"
                      style={{ fontFamily: 'Space Mono, monospace' }}>
                      ✗ {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className={labelClass} style={{ fontFamily: 'Space Mono, monospace' }}>Full Name *</label>
                      <input value={address.fullName}
                        onChange={e => setAddress({ ...address, fullName: e.target.value })}
                        placeholder="John Doe" className={inputClass} />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelClass} style={{ fontFamily: 'Space Mono, monospace' }}>Phone Number *</label>
                      <input value={address.phone}
                        onChange={e => setAddress({ ...address, phone: e.target.value })}
                        placeholder="0821234567" className={inputClass} />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelClass} style={{ fontFamily: 'Space Mono, monospace' }}>Street Address *</label>
                      <input value={address.street}
                        onChange={e => setAddress({ ...address, street: e.target.value })}
                        placeholder="123 Main Street, Apt 4B" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass} style={{ fontFamily: 'Space Mono, monospace' }}>City *</label>
                      <input value={address.city}
                        onChange={e => setAddress({ ...address, city: e.target.value })}
                        placeholder="Johannesburg" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass} style={{ fontFamily: 'Space Mono, monospace' }}>Province</label>
                      <select value={address.province}
                        onChange={e => setAddress({ ...address, province: e.target.value })}
                        className={inputClass} style={{ fontFamily: 'Space Mono, monospace' }}>
                        {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass} style={{ fontFamily: 'Space Mono, monospace' }}>Postal Code *</label>
                      <input value={address.postalCode}
                        onChange={e => setAddress({ ...address, postalCode: e.target.value })}
                        placeholder="2000" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass} style={{ fontFamily: 'Space Mono, monospace' }}>Country</label>
                      <input value={address.country} readOnly
                        className={`${inputClass} opacity-40 cursor-not-allowed`} />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelClass} style={{ fontFamily: 'Space Mono, monospace' }}>
                        Order Notes <span className="text-[#6a6d70]">(optional)</span>
                      </label>
                      <textarea value={notes} onChange={e => setNotes(e.target.value)}
                        placeholder="Special delivery instructions..."
                        rows={3}
                        className="w-full 	bg-[#3a3d40] border border-[#d5d8d9]/20 focus:border-[#cc1352] text-white px-4 py-3 outline-none transition-colors text-sm placeholder-[#6a6d70] resize-none" />
                    </div>
                  </div>

                  <button
                    onClick={handleContinue}
                    disabled={orderMutation.isPending}
                    className="w-full bg-[#cc1352] hover:bg-[#e8175e] disabled:opacity-40 text-white font-black py-4 transition-colors tracking-[0.15em] uppercase text-sm mt-6 flex items-center justify-center gap-2"
                    style={{ fontFamily: 'Space Mono, monospace' }}>
                    {orderMutation.isPending
                      ? '// Processing...'
                      : <><span>Continue to Payment</span><ArrowRight size={14} /></>
                    }
                  </button>
                </div>
              </div>
            )}

            {/* PAYMENT STEP */}
            {step === 'payment' && (
              <div className="border border-[#d5d8d9]/20 bg-[#4f5256]">
                <div className="flex items-center gap-2 px-6 py-5 border-b border-[#d5d8d9]/20">
                  <CreditCard size={15} className="text-[#cc1352]" />
                  <p className="text-white text-xs font-bold tracking-[0.2em] uppercase"
                    style={{ fontFamily: 'Space Mono, monospace' }}>
                    Payment Method
                  </p>
                </div>

                <div className="p-6">
                  {error && (
                    <div className="border border-[#e53e3e]/40 bg-[#e53e3e]/5 text-[#e53e3e] px-4 py-3 mb-5 text-xs"
                      style={{ fontFamily: 'Space Mono, monospace' }}>
                      ✗ {error}
                    </div>
                  )}

                  <div className="space-y-3 mb-6">
                    {[
                      { key: 'paystack', title: 'Paystack', desc: 'Card, Instant EFT, Mobile Money', tag: 'Recommended' },
                      { key: 'ozow', title: 'Ozow', desc: 'Instant EFT / Bank Transfer', tag: 'Bank Transfer' },
                    ].map(method => (
                      <button
                        key={method.key}
                        onClick={() => setPaymentMethod(method.key as 'paystack' | 'ozow')}
                        className={`w-full flex items-center justify-between p-4 border transition-all text-left ${
                          paymentMethod === method.key
                            ? 'border-[#cc1352] bg-[#cc1352]/5'
                            : 'border-[#d5d8d9]/20 hover:border-[#cc1352]/40'
                        }`}>
                        <div className="flex items-center gap-4">
                          {/* Radio */}
                          <div className={`w-4 h-4 border-2 flex items-center justify-center flex-shrink-0 ${
                            paymentMethod === method.key ? 'border-[#cc1352]' : 'border-[#333333]'
                          }`}>
                            {paymentMethod === method.key && (
                              <div className="w-2 h-2 bg-[#cc1352]" />
                            )}
                          </div>
                          <div>
                            <p className="text-white text-sm font-bold"
                              style={{ fontFamily: 'Space Mono, monospace' }}>
                              {method.title}
                            </p>
                            <p className="text-[#9a9d9f] text-xs">{method.desc}</p>
                          </div>
                        </div>
                        <span className={`text-xs border px-2 py-1 ${
                          paymentMethod === method.key
                            ? 'border-[#cc1352]/30 text-[#cc1352]'
                            : 'border-[#d5d8d9]/20 text-[#9a9d9f]'
                        }`} style={{ fontFamily: 'Space Mono, monospace' }}>
                          {method.tag}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Security note */}
                  <div className="border border-[#d5d8d9]/20 	bg-[#3a3d40] p-4 mb-6 flex items-start gap-3">
                    <div className="w-1 h-1 bg-[#cc1352] flex-shrink-0 mt-1.5" />
                    <p className="text-[#9a9d9f] text-xs leading-relaxed"
                      style={{ fontFamily: 'Space Mono, monospace' }}>
                      Your payment is processed securely via{' '}
                      {paymentMethod === 'paystack' ? 'Paystack' : 'Ozow'}.
                      KIR never stores your card details.
                    </p>
                  </div>

                  <button
                    onClick={() => paymentMutation.mutate()}
                    disabled={paymentMutation.isPending}
                    className="w-full bg-[#cc1352] hover:bg-[#e8175e] disabled:opacity-40 text-white font-black py-4 transition-colors tracking-[0.15em] uppercase text-sm flex items-center justify-center gap-2"
                    style={{ fontFamily: 'Space Mono, monospace' }}>
                    {paymentMutation.isPending
                      ? '// Redirecting...'
                      : <><span>Pay R{total.toFixed(2)}</span><ArrowRight size={14} /></>
                    }
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Right — Order Summary ─────────────────────── */}
          <div className="lg:col-span-1">
            <div className="border border-[#d5d8d9]/20 bg-[#4f5256] p-5 sticky top-6">
              <p className="text-white text-xs font-bold tracking-[0.2em] uppercase mb-5 pb-4 border-b border-[#d5d8d9]/20"
                style={{ fontFamily: 'Space Mono, monospace' }}>// Order Summary</p>

              {/* Items list */}
              <div className="space-y-3 mb-5">
                {cart.items.map((item: any) => (
                  <div key={`${item.productId}-${item.size}-${item.color}`}
                    className="flex gap-3 items-center">
                    <div className="w-12 h-12 bg-[#3a3d40] border border-[#d5d8d9]/20 overflow-hidden flex-shrink-0 relative">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#6a6d70] text-xs">?</div>
                      )}
                      {/* Qty badge */}
                      <span className="absolute -top-1 -right-1 bg-[#cc1352] text-white text-[9px] font-black w-4 h-4 flex items-center justify-center leading-none">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-medium truncate">{item.name}</p>
                      <p className="text-[#9a9d9f] text-xs" style={{ fontFamily: 'Space Mono, monospace' }}>
                        {item.size} / {item.color}
                      </p>
                    </div>
                    <p className="text-white text-xs font-bold flex-shrink-0"
                      style={{ fontFamily: 'Space Mono, monospace' }}>
                      R{Number(item.subtotal).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-[#d5d8d9]/20 pt-4 space-y-2.5 text-xs"
                style={{ fontFamily: 'Space Mono, monospace' }}>
                <div className="flex justify-between">
                  <span className="text-[#9a9d9f]">Subtotal</span>
                  <span className="text-white">R{Number(cart.total).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9a9d9f]">Shipping</span>
                  <span className={shippingFee === 0 ? 'text-[#22c55e]' : 'text-white'}>
                    {shippingFee === 0 ? 'FREE' : `R${shippingFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t border-[#d5d8d9]/20 pt-3 flex justify-between items-center">
                  <span className="text-white font-bold">Total</span>
                  <span className="text-[#cc1352] font-black text-base">
                    R{total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Shipping progress */}
              {shippingFee > 0 && (
                <div className="mt-4 pt-4 border-t border-[#d5d8d9]/20">
                  <div className="flex justify-between text-xs mb-2"
                    style={{ fontFamily: 'Space Mono, monospace' }}>
                    <span className="text-[#9a9d9f]">Free shipping</span>
                    <span className="text-[#cc1352]">
                      R{(800 - Number(cart.total)).toFixed(2)} away
                    </span>
                  </div>
                  <div className="w-full h-1 bg-[#3a3d40]">
                    <div
                      className="h-1 bg-[#cc1352] transition-all"
                      style={{ width: `${Math.min((Number(cart.total) / 800) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Checkout;