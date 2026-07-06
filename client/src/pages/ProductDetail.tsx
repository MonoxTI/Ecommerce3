import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ShoppingBag, Heart, ArrowLeft, Check, Truck, Shield, RefreshCw } from 'lucide-react';
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
      setTimeout(() => setAdded(false), 2000);
    },
  });

  const handleAddToCart = () => {
    if (!user) { navigate('/login'); return; }
    if (!selectedSize) { alert('Please select a size'); return; }
    if (!selectedColor) { alert('Please select a color'); return; }
    cartMutation.mutate();
  };

  const discount = product?.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : null;

  if (isLoading) return (
    <main className="pt-16 min-h-screen bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-square bg-[#111111] rounded-2xl" />
          <div className="space-y-4">
            <div className="h-8 bg-[#111111] rounded w-3/4" />
            <div className="h-6 bg-[#111111] rounded w-1/4" />
            <div className="h-24 bg-[#111111] rounded" />
          </div>
        </div>
      </div>
    </main>
  );

  if (!product) return (
    <main className="pt-16 min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-center">
        <p className="text-white text-xl mb-4">Product not found</p>
        <button onClick={() => navigate('/products')} className="text-[#c9a84c] hover:underline">Back to products</button>
      </div>
    </main>
  );

  return (
    <main className="pt-16 min-h-screen bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#888888] hover:text-white transition-colors text-sm mb-8"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-[#111111] rounded-2xl overflow-hidden border border-[#1a1a1a]">
              {product.images?.length > 0 ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingBag size={60} className="text-[#333333]" />
                </div>
              )}
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                      selectedImage === i ? 'border-[#c9a84c]' : 'border-[#1a1a1a]'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <p className="text-[#888888] text-xs tracking-widest uppercase mb-2">{product.category}</p>
            <h1 className="text-white text-3xl font-bold mb-4">{product.name}</h1>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[#c9a84c] text-3xl font-bold">R{Number(product.price).toFixed(2)}</span>
              {product.comparePrice && (
                <span className="text-[#444444] text-xl line-through">R{Number(product.comparePrice).toFixed(2)}</span>
              )}
              {discount && (
                <span className="bg-[#e53e3e] text-white text-xs font-bold px-2 py-1 rounded-md">-{discount}%</span>
              )}
            </div>

            {/* Description */}
            <p className="text-[#888888] text-sm leading-relaxed mb-8">{product.description}</p>

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div className="mb-6">
                <p className="text-[#888888] text-xs tracking-widest uppercase mb-3">
                  Color: <span className="text-white">{selectedColor || 'Select'}</span>
                </p>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map((color: string) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        selectedColor === color
                          ? 'border-[#c9a84c] bg-[#c9a84c]/10 text-[#c9a84c]'
                          : 'border-[#222222] text-[#888888] hover:border-[#444444] hover:text-white'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div className="mb-8">
                <p className="text-[#888888] text-xs tracking-widest uppercase mb-3">
                  Size: <span className="text-white">{selectedSize || 'Select'}</span>
                </p>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-lg text-sm font-medium border transition-colors ${
                        selectedSize === size
                          ? 'border-[#c9a84c] bg-[#c9a84c]/10 text-[#c9a84c]'
                          : 'border-[#222222] text-[#888888] hover:border-[#444444] hover:text-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-8">
              <p className="text-[#888888] text-xs tracking-widest uppercase">Qty:</p>
              <div className="flex items-center gap-3 bg-[#111111] border border-[#1a1a1a] rounded-lg px-4 py-2">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="text-[#888888] hover:text-white text-lg font-bold transition-colors">−</button>
                <span className="text-white font-medium w-6 text-center">{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  className="text-[#888888] hover:text-white text-lg font-bold transition-colors">+</button>
              </div>
              <span className="text-[#888888] text-xs">{product.stock} in stock</span>
            </div>

            {/* Add to Cart */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={cartMutation.isPending || product.stock === 0}
                className={`flex-1 flex items-center justify-center gap-2 font-semibold py-4 rounded-xl transition-all text-sm tracking-wider uppercase ${
                  added
                    ? 'bg-green-500 text-white'
                    : 'bg-[#c9a84c] hover:bg-[#a8893d] text-black disabled:opacity-50'
                }`}
              >
                {added ? <><Check size={18} /> Added!</> :
                  cartMutation.isPending ? 'Adding...' :
                  product.stock === 0 ? 'Out of Stock' :
                  <><ShoppingBag size={18} /> Add to Cart</>}
              </button>
              <button className="w-14 h-14 border border-[#222222] hover:border-[#c9a84c] text-[#888888] hover:text-[#c9a84c] rounded-xl flex items-center justify-center transition-colors">
                <Heart size={20} />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="border-t border-[#1a1a1a] pt-6 space-y-3">
              {[
                { icon: Truck, text: 'Free shipping on orders over R800' },
                { icon: Shield, text: 'Secure payment via Paystack & Ozow' },
                { icon: RefreshCw, text: '30-day hassle-free returns' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-[#888888] text-sm">
                  <Icon size={16} className="text-[#c9a84c] flex-shrink-0" />
                  {text}
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