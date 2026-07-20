import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { getCart, updateCartItem, removeFromCart, clearCart } from '../services/cartService';
import { useCartStore } from '../store/cartStore';
import { useUserStore } from '../store/userStore';

const Cart = () => {
  const { user } = useUserStore();
  const { setCart } = useCartStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: cart, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
    enabled: !!user,
  });

  useEffect(() => {
    if (cart) setCart(cart);
  }, [cart]);

  const updateMutation = useMutation({
    mutationFn: (data: any) => updateCartItem(data),
    onSuccess: (data) => { setCart(data.cart); queryClient.invalidateQueries({ queryKey: ['cart'] }); },
  });

  const removeMutation = useMutation({
    mutationFn: (data: any) => removeFromCart(data),
    onSuccess: (data) => { setCart(data.cart); queryClient.invalidateQueries({ queryKey: ['cart'] }); },
  });

  const clearMutation = useMutation({
    mutationFn: clearCart,
    onSuccess: (data) => { setCart(data); queryClient.invalidateQueries({ queryKey: ['cart'] }); },
  });

  if (!user) return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-center">
        <ShoppingBag size={48} className="text-[#222222] mx-auto mb-4" />
        <p className="text-white text-xl font-medium mb-2">Sign in to view your cart</p>
        <Link to="/login"
          className="text-[#cc1352] hover:text-[#e8175e] text-sm transition-colors underline underline-offset-4">
          Sign in
        </Link>
      </div>
    </main>
  );

  const items = cart?.items || [];

  return (
    <main className="min-h-screen bg-[#0a0a0a]">

      {/* Page header */}
      <div className="border-b border-[#1e1e1e] bg-[#0f0f0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[#cc1352] text-xs tracking-[0.3em] uppercase mb-1"
                style={{ fontFamily: 'Space Mono, monospace' }}>// Your</p>
              <h1 className="text-white text-4xl md:text-5xl font-black"
                style={{ fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.05em' }}>
                Cart
              </h1>
              <p className="text-[#555555] text-xs mt-1"
                style={{ fontFamily: 'Space Mono, monospace' }}>
                {cart?.itemCount || 0} item{cart?.itemCount !== 1 ? 's' : ''}
              </p>
            </div>
            {items.length > 0 && (
              <button
                onClick={() => { if (confirm('Clear your entire cart?')) clearMutation.mutate(); }}
                className="text-[#555555] hover:text-[#e53e3e] text-xs transition-colors tracking-wider uppercase"
                style={{ fontFamily: 'Space Mono, monospace' }}>
                Clear cart
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-28 bg-[#111111] animate-pulse border border-[#1e1e1e]" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-[#1e1e1e]">
            <ShoppingBag size={48} className="text-[#222222] mx-auto mb-4" />
            <p className="text-white text-xl font-black mb-2"
              style={{ fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.05em' }}>
              Your cart is empty
            </p>
            <p className="text-[#555555] text-sm mb-8">Add some items to get started</p>
            <Link to="/products"
              className="inline-flex items-center gap-2 bg-[#cc1352] hover:bg-[#e8175e] text-white font-black px-8 py-4 text-xs transition-colors tracking-[0.15em] uppercase"
              style={{ fontFamily: 'Space Mono, monospace' }}>
              Shop Now <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── Cart Items ─────────────────────────────── */}
            <div className="lg:col-span-2 space-y-3">
              {items.map((item: any) => (
                <div
                  key={`${item.productId}-${item.size}-${item.color}`}
                  className="bg-[#0f0f0f] border border-[#1e1e1e] hover:border-[#cc1352]/20 p-4 flex gap-4 transition-colors group"
                >
                  {/* Image */}
                  <Link
                    to={`/products/${item.productId}`}
                    className="w-24 h-24 bg-[#161616] overflow-hidden flex-shrink-0 border border-[#1e1e1e]">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag size={20} className="text-[#333333]" />
                      </div>
                    )}
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${item.productId}`}>
                      <h3 className="text-white font-bold text-sm hover:text-[#cc1352] transition-colors truncate">
                        {item.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[#555555] text-xs border border-[#1e1e1e] px-2 py-0.5"
                        style={{ fontFamily: 'Space Mono, monospace' }}>
                        {item.size}
                      </span>
                      <span className="text-[#555555] text-xs border border-[#1e1e1e] px-2 py-0.5"
                        style={{ fontFamily: 'Space Mono, monospace' }}>
                        {item.color}
                      </span>
                    </div>
                    <p className="text-[#cc1352] font-black text-sm mt-2"
                      style={{ fontFamily: 'Space Mono, monospace' }}>
                      R{Number(item.price).toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity & Remove */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeMutation.mutate({ productId: item.productId, size: item.size, color: item.color })}
                      className="text-[#444444] hover:text-[#e53e3e] transition-colors p-1"
                    >
                      <Trash2 size={14} />
                    </button>

                    <div className="flex items-center border border-[#222222] hover:border-[#cc1352]/40 transition-colors">
                      <button
                        onClick={() => updateMutation.mutate({ productId: item.productId, size: item.size, color: item.color, quantity: item.quantity - 1 })}
                        className="w-8 h-8 text-[#888888] hover:text-white hover:bg-[#1a1a1a] transition-colors font-bold text-sm"
                      >−</button>
                      <span className="text-white text-xs font-bold w-8 text-center"
                        style={{ fontFamily: 'Space Mono, monospace' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateMutation.mutate({ productId: item.productId, size: item.size, color: item.color, quantity: item.quantity + 1 })}
                        className="w-8 h-8 text-[#888888] hover:text-white hover:bg-[#1a1a1a] transition-colors font-bold text-sm"
                      >+</button>
                    </div>

                    <p className="text-white font-black text-sm"
                      style={{ fontFamily: 'Space Mono, monospace' }}>
                      R{Number(item.subtotal).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Order Summary ──────────────────────────── */}
            <div className="lg:col-span-1">
              <div className="bg-[#0f0f0f] border border-[#1e1e1e] p-6 sticky top-24">
                <p className="text-white text-xs font-bold tracking-[0.2em] uppercase mb-6 pb-4 border-b border-[#1e1e1e]"
                  style={{ fontFamily: 'Space Mono, monospace' }}>
                  // Order Summary
                </p>

                <div className="space-y-3 mb-6 text-xs" style={{ fontFamily: 'Space Mono, monospace' }}>
                  <div className="flex justify-between">
                    <span className="text-[#555555]">Subtotal</span>
                    <span className="text-white">R{Number(cart?.total).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#555555]">Shipping</span>
                    <span className={Number(cart?.total) >= 800 ? 'text-[#22c55e]' : 'text-white'}>
                      {Number(cart?.total) >= 800 ? 'FREE' : 'R80.00'}
                    </span>
                  </div>
                  <div className="border-t border-[#1e1e1e] pt-3 flex justify-between items-center">
                    <span className="text-white font-bold">Total</span>
                    <span className="text-[#cc1352] font-black text-lg">
                      R{(Number(cart?.total) + (Number(cart?.total) >= 800 ? 0 : 80)).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Free shipping progress */}
                {Number(cart?.total) < 800 && (
                  <div className="mb-5">
                    <div className="flex justify-between text-xs mb-2" style={{ fontFamily: 'Space Mono, monospace' }}>
                      <span className="text-[#555555]">Free shipping progress</span>
                      <span className="text-[#cc1352]">R{(800 - Number(cart?.total)).toFixed(2)} away</span>
                    </div>
                    <div className="w-full h-1 bg-[#1e1e1e]">
                      <div
                        className="h-1 bg-[#cc1352] transition-all duration-500"
                        style={{ width: `${Math.min((Number(cart?.total) / 800) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-[#cc1352] hover:bg-[#e8175e] text-white font-black py-4 transition-colors text-xs tracking-[0.15em] uppercase flex items-center justify-center gap-2 mb-3"
                  style={{ fontFamily: 'Space Mono, monospace' }}>
                  Checkout <ArrowRight size={14} />
                </button>

                <Link to="/products"
                  className="block text-center text-[#555555] hover:text-white text-xs transition-colors tracking-wider uppercase"
                  style={{ fontFamily: 'Space Mono, monospace' }}>
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Cart;