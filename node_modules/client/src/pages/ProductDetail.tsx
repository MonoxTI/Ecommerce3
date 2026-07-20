import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ShoppingBag, Heart, ArrowLeft, Check, Truck, Shield, RefreshCw, ChevronRight } from 'lucide-react';
import { getProduct } from '../services/productService';
import { addToCart } from '../services/cartService';
import { useCartStore } from '../store/cartStore';
import { useUserStore } from '../store/userStore';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { setCart } = useCartStore();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [colorError, setColorError] = useState(false);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id!),
  });

  const cartMutation = useMutation({
    mutationFn: () => addToCart({
      productId: product.id,
      size: selectedSize,
      color: selectedColor,
      quantity,
    }),
    onSuccess: (data) => {
      setCart(data.cart);
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    },
  });

  const handleAddToCart = () => {
    if (!user) { navigate('/login'); return; }
    setSizeError(!selectedSize);
    setColorError(!selectedColor);
    if (!selectedSize || !selectedColor) return;
    cartMutation.mutate();
  };

  const discount = product?.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : null;

  if (isLoading) return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 animate-pulse">
          <div className="aspect-[3/4] bg-[#111111]" />
          <div className="space-y-4 pt-4">
            <div className="h-3 bg-[#111111] w-1/4" />
            <div className="h-8 bg-[#111111] w-3/4" />
            <div className="h-6 bg-[#111111] w-1/4" />
            <div className="h-24 bg-[#111111]" />
          </div>
        </div>
      </div>
    </main>
  );

  if (!product) return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-center">
        <p className="text-white text-xl mb-4">Product not found</p>
        <button onClick={() => navigate('/products')}
          className="text-[#cc1352] hover:text-[#e8175e] text-sm transition-colors underline underline-offset-4">
          Back to products
        </button>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen bg-[#0a0a0a]">

      {/* ── Breadcrumb ──────────────────────────────────── */}
      <div className="border-b border-[#1e1e1e] bg-[#0f0f0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-xs"
            style={{ fontFamily: 'Space Mono, monospace' }}>
            <Link to="/" className="text-[#555555] hover:text-white transition-colors">Home</Link>
            <ChevronRight size={10} className="text-[#333333]" />
            <Link to="/products" className="text-[#555555] hover:text-white transition-colors">Products</Link>
            <ChevronRight size={10} className="text-[#333333]" />
            <span className="text-[#888888] truncate max-w-[200px]">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

        {/* Back */}
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#555555] hover:text-white transition-colors text-xs mb-8 group"
          style={{ fontFamily: 'Space Mono, monospace' }}>
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">

          {/* ── Images ──────────────────────────────────── */}
          <div className="space-y-3">
            <div className="relative aspect-[3/4] overflow-hidden bg-[#111111]">
              {product.images?.length > 0 ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingBag size={60} className="text-[#222222]" />
                </div>
              )}

              {/* Discount badge on image */}
              {discount && (
                <div className="absolute top-4 left-4 bg-[#cc1352] text-white text-xs font-black px-3 py-1.5">
                  -{discount}% OFF
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((img: string, i: number) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 w-20 h-20 overflow-hidden border-2 transition-all ${
                      selectedImage === i
                        ? 'border-[#cc1352]'
                        : 'border-transparent opacity-50 hover:opacity-80 hover:border-[#cc1352]/40'
                    }`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Info ─────────────────────────────── */}
          <div className="lg:py-2">

            {/* Category + Name */}
            <p className="text-[#cc1352] text-xs tracking-[0.2em] uppercase mb-3"
              style={{ fontFamily: 'Space Mono, monospace' }}>{product.category}</p>
            <h1 className="text-white text-2xl md:text-3xl font-bold mb-5 leading-snug">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[#1e1e1e]">
              <span className="text-[#cc1352] text-2xl font-black"
                style={{ fontFamily: 'Space Mono, monospace' }}>
                R{Number(product.price).toFixed(2)}
              </span>
              {product.comparePrice && (
                <span className="text-[#444444] text-lg line-through">
                  R{Number(product.comparePrice).toFixed(2)}
                </span>
              )}
              {discount && (
                <span className="bg-[#cc1352]/10 border border-[#cc1352]/30 text-[#cc1352] text-xs font-black px-2 py-1">
                  SAVE {discount}%
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-[#888888] text-sm leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Color selection */}
            {product.colors?.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-white text-xs font-bold tracking-[0.1em] uppercase"
                    style={{ fontFamily: 'Space Mono, monospace' }}>
                    Color:&nbsp;
                    <span className="text-[#cc1352] font-normal">{selectedColor || 'Select one'}</span>
                  </p>
                  {colorError && (
                    <p className="text-[#e53e3e] text-xs" style={{ fontFamily: 'Space Mono, monospace' }}>
                      ✗ Required
                    </p>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map((color: string) => (
                    <button key={color}
                      onClick={() => { setSelectedColor(color); setColorError(false); }}
                      className={`px-4 py-2 text-xs font-medium border transition-all ${
                        selectedColor === color
                          ? 'border-[#cc1352] bg-[#cc1352]/10 text-[#cc1352]'
                          : `border-[#222222] text-[#888888] hover:border-[#cc1352]/50 hover:text-white ${
                              colorError ? 'border-[#e53e3e]/40' : ''
                            }`
                      }`}
                      style={{ fontFamily: 'Space Mono, monospace' }}>
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size selection */}
            {product.sizes?.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-white text-xs font-bold tracking-[0.1em] uppercase"
                    style={{ fontFamily: 'Space Mono, monospace' }}>
                    Size:&nbsp;
                    <span className="text-[#cc1352] font-normal">{selectedSize || 'Select one'}</span>
                  </p>
                  {sizeError && (
                    <p className="text-[#e53e3e] text-xs" style={{ fontFamily: 'Space Mono, monospace' }}>
                      ✗ Required
                    </p>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((size: string) => (
                    <button key={size}
                      onClick={() => { setSelectedSize(size); setSizeError(false); }}
                      className={`min-w-[44px] h-11 px-3 text-xs font-bold border transition-all ${
                        selectedSize === size
                          ? 'border-[#cc1352] bg-[#cc1352]/10 text-[#cc1352]'
                          : `border-[#222222] text-[#888888] hover:border-[#cc1352]/50 hover:text-white ${
                              sizeError ? 'border-[#e53e3e]/40' : ''
                            }`
                      }`}
                      style={{ fontFamily: 'Space Mono, monospace' }}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <p className="text-white text-xs font-bold tracking-[0.1em] uppercase"
                style={{ fontFamily: 'Space Mono, monospace' }}>Qty:</p>
              <div className="flex items-center border border-[#222222] hover:border-[#cc1352]/40 transition-colors">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-10 text-[#888888] hover:text-white hover:bg-[#1a1a1a] transition-colors text-lg font-bold">
                  −
                </button>
                <span className="w-12 text-center text-white text-sm font-bold"
                  style={{ fontFamily: 'Space Mono, monospace' }}>{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  className="w-10 h-10 text-[#888888] hover:text-white hover:bg-[#1a1a1a] transition-colors text-lg font-bold">
                  +
                </button>
              </div>
              <p className="text-[#555555] text-xs" style={{ fontFamily: 'Space Mono, monospace' }}>
                {product.stock} available
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3 mb-8">
              <button onClick={handleAddToCart}
                disabled={cartMutation.isPending || product.stock === 0}
                className={`flex-1 flex items-center justify-center gap-2.5 font-black py-4 transition-all text-sm tracking-[0.1em] uppercase ${
                  added
                    ? 'bg-[#22c55e] text-white'
                    : product.stock === 0
                    ? 'bg-[#111111] text-[#444444] cursor-not-allowed border border-[#222222]'
                    : 'bg-[#cc1352] hover:bg-[#e8175e] text-white disabled:opacity-50'
                }`}
                style={{ fontFamily: 'Space Mono, monospace' }}>
                {added ? (
                  <><Check size={16} /> Added to Cart</>
                ) : cartMutation.isPending ? (
                  'Adding...'
                ) : product.stock === 0 ? (
                  'Out of Stock'
                ) : (
                  <><ShoppingBag size={16} /> Add to Cart</>
                )}
              </button>

              <button
                onClick={() => setWishlisted(!wishlisted)}
                className={`w-14 h-14 border flex items-center justify-center transition-all ${
                  wishlisted
                    ? 'border-[#cc1352] bg-[#cc1352]/10 text-[#cc1352]'
                    : 'border-[#222222] hover:border-[#cc1352]/50 text-[#555555] hover:text-[#cc1352]'
                }`}>
                <Heart size={18} className={wishlisted ? 'fill-[#cc1352]' : ''} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="border border-[#1e1e1e] divide-y divide-[#1e1e1e]">
              {[
                { icon: Truck, title: 'Free shipping', desc: 'on orders over R800' },
                { icon: Shield, title: 'Secure payment', desc: 'via Paystack & Ozow' },
                { icon: RefreshCw, title: '30-day returns', desc: 'hassle-free policy' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-center gap-4 px-4 py-3 hover:bg-[#0f0f0f] transition-colors">
                  <Icon size={15} className="text-[#cc1352] flex-shrink-0" />
                  <p className="text-white text-xs">
                    <span className="font-bold">{title}</span>
                    <span className="text-[#555555]"> — {desc}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetail;