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
    <main className="pt-16 min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-center">
        <ShoppingBag size={60} className="text-[#333333] mx-auto mb-4" />
        <p className="text-white text-xl font-medium mb-2">Sign in to view your cart</p>
        <Link to="/login" className="text-[#c9a84c] hover:underline text-sm">Sign in</Link>
      </div>
    </main>
  );

  const items = cart?.items || [];

  return (
    <main className="pt-16 min-h-screen bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-white text-4xl" style={{ fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.05em' }}>
              Your Cart
            </h1>
            <p className="text-[#888888] text-sm">{cart?.itemCount || 0} items</p>
          </div>
          {items.length > 0 && (
            <button onClick={() => { if (confirm('Clear cart?')) clearMutation.mutate(); }}
              className="text-[#888888] hover:text-[#e53e3e] text-sm transition-colors">
              Clear cart
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-[#111111] rounded-xl h-28 animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-[#222222] rounded-2xl">
            <ShoppingBag size={60} className="text-[#333333] mx-auto mb-4" />
            <p className="text-white text-xl font-medium mb-2">Your cart is empty</p>
            <p className="text-[#888888] text-sm mb-6">Add some items to get started</p>
            <Link to="/products"
              className="inline-flex items-center gap-2 bg-[#c9a84c] hover:bg-[#a8893d] text-black font-semibold px-6 py-3 rounded-lg text-sm transition-colors">
              Shop Now <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item: any) => (
                <div key={`${item.productId}-${item.size}-${item.color}`}
                  className="bg-[#111111] border border-[#1a1a1a] rounded-xl p-4 flex gap-4">
                  {/* Image */}
                  <Link to={`/products/${item.productId}`}
                    className="w-24 h-24 bg-[#1a1a1a] rounded-xl overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag size={24} className="text-[#333333]" />
                      </div>
                    )}
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${item.productId}`}>
                      <h3 className="text-white font-medium hover:text-[#c9a84c] transition-colors truncate">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-[#888888] text-xs mt-1">
                      Size: {item.size} · Color: {item.color}
                    </p>
                    <p className="text-[#c9a84c] font-semibold mt-2">R{Number(item.price).toFixed(2)}</p>
                  </div>

                  {/* Quantity & Remove */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeMutation.mutate({ productId: item.productId, size: item.size, color: item.color })}
                      className="text-[#888888] hover:text-[#e53e3e] transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="flex items-center gap-2 bg-[#1a1a1a] border border-[#222222] rounded-lg px-3 py-1.5">
                      <button
                        onClick={() => updateMutation.mutate({ productId: item.productId, size: item.size, color: item.color, quantity: item.quantity - 1 })}
                        className="text-[#888888] hover:text-white font-bold transition-colors"
                      >−</button>
                      <span className="text-white text-sm w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateMutation.mutate({ productId: item.productId, size: item.size, color: item.color, quantity: item.quantity + 1 })}
                        className="text-[#888888] hover:text-white font-bold transition-colors"
                      >+</button>
                    </div>
                    <p className="text-white font-semibold text-sm">R{Number(item.subtotal).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-[#111111] border border-[#1a1a1a] rounded-xl p-6 sticky top-24">
                <h2 className="text-white font-semibold mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#888888]">Subtotal</span>
                    <span className="text-white">R{Number(cart?.total).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#888888]">Shipping</span>
                    <span className="text-white">
                      {Number(cart?.total) >= 800 ? <span className="text-green-400">Free</span> : 'R80.00'}
                    </span>
                  </div>
                  <div className="border-t border-[#1a1a1a] pt-3 flex justify-between">
                    <span className="text-white font-semibold">Total</span>
                    <span className="text-[#c9a84c] font-bold text-lg">
                      R{(Number(cart?.total) + (Number(cart?.total) >= 800 ? 0 : 80)).toFixed(2)}
                    </span>
                  </div>
                </div>

                {Number(cart?.total) < 800 && (
                  <div className="bg-[#c9a84c]/10 border border-[#c9a84c]/20 rounded-lg p-3 mb-4">
                    <p className="text-[#c9a84c] text-xs">
                      Add R{(800 - Number(cart?.total)).toFixed(2)} more for free shipping!
                    </p>
                  </div>
                )}

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-[#c9a84c] hover:bg-[#a8893d] text-black font-semibold py-4 rounded-xl transition-colors text-sm tracking-wider uppercase flex items-center justify-center gap-2"
                >
                  Checkout <ArrowRight size={16} />
                </button>

                <Link to="/products"
                  className="block text-center text-[#888888] hover:text-white text-sm mt-4 transition-colors">
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