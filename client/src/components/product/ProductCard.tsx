import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: string;
  sizes: string[];
  colors: string[];
}

const ProductCard = ({ product }: { product: Product }) => {
  const [hovered, setHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : null;

  return (
    <div className="group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>

      {/* Image container */}
      <div className="relative overflow-hidden bg-[#4f5256] mb-3">
        <Link to={`/products/${product.id}`} className="block aspect-[3/4]">
          {product.images?.length > 0 ? (
            <img
              src={hovered && product.images[1] ? product.images[1] : product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingBag size={32} className="text-[#6a6d70]" />
            </div>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount && (
            <span className="bg-[#e53e3e] text-white text-[10px] font-black px-2 py-1 leading-none">
              -{discount}%
            </span>
          )}
          {product.images?.length === 0 && (
            <span className="bg-[#333333] text-[#d5d8d9] text-[10px] px-2 py-1 leading-none"
              style={{ fontFamily: 'Space Mono, monospace' }}>
              No Image
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); setWishlisted(!wishlisted); }}
          className="absolute top-3 right-3 w-8 h-8 bg-[#0a0a0a]/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-[#0a0a0a]">
          <Heart size={14} className={wishlisted ? 'text-[#e53e3e] fill-[#e53e3e]' : 'text-white'} />
        </button>

        {/* Quick size select — slides up on hover */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur-sm translate-y-full group-hover:translate-y-0 transition-transform duration-300 p-3 border-t border-[#d5d8d9]/20">
          {product.sizes?.length > 0 ? (
            <>
              <p className="text-[#9a9d9f] text-[10px] tracking-[0.2em] uppercase mb-2 text-center"
                style={{ fontFamily: 'Space Mono, monospace' }}>Select Size</p>
              <div className="flex gap-1.5 justify-center flex-wrap">
                {product.sizes.slice(0, 5).map(size => (
  <button
    key={size}
    onClick={(e) => { e.preventDefault(); setSelectedSize(size === selectedSize ? '' : size); }}
    className={`min-w-[32px] h-8 px-2 text-[10px] font-bold border transition-all duration-150 ${
      selectedSize === size
        ? 'bg-[#cc1352] border-[#cc1352] text-white'
        : 'border-[#d5d8d9]/30 text-[#d5d8d9] hover:border-[#cc1352] hover:text-white'
    }`}
    style={{ fontFamily: 'Space Mono, monospace' }}>
    {size}
  </button>
))}
              </div>
              {selectedSize && (
  <Link
    to={`/products/${product.id}`}
    className="mt-2 w-full flex items-center justify-center gap-1.5 bg-[#cc1352] hover:bg-[#e8175e] text-white text-[10px] font-black py-2 transition-colors"
    style={{ fontFamily: 'Space Mono, monospace' }}>
    <ShoppingBag size={11} />
    Add to Cart
  </Link>
)}
            </>
          ) : (
            <Link to={`/products/${product.id}`}
  className="w-full flex items-center justify-center gap-1.5 bg-[#cc1352] hover:bg-[#e8175e] text-white text-[10px] font-black py-2 transition-colors"
  style={{ fontFamily: 'Space Mono, monospace' }}>
  <ShoppingBag size={11} />
  View Product
</Link>
          )}
        </div>
      </div>

      {/* Product info */}
      <div>
        <p className="text-[#9a9d9f] text-[10px] tracking-[0.15em] uppercase mb-1"
          style={{ fontFamily: 'Space Mono, monospace' }}>{product.category}</p>
        <Link to={`/products/${product.id}`}>
          <h3 className="text-white text-sm font-medium hover:text-[#cc1352] transition-colors line-clamp-1 mb-2">
  {product.name}
</h3>
        </Link>

        {/* Colors */}
        {product.colors?.length > 0 && (
          <div className="flex gap-1.5 mb-2">
            {product.colors.slice(0, 5).map(color => (
              <div key={color} className="w-3 h-3 border border-[#333333]"
                style={{
                  backgroundColor:
                    color.toLowerCase() === 'white' ? '#ffffff' :
                    color.toLowerCase() === 'black' ? '#000000' :
                    color.toLowerCase() === 'grey' || color.toLowerCase() === 'gray' ? '#888888' :
                    color.toLowerCase() === 'silver' ? '#c0c0c0' :
                    color.toLowerCase() === 'red' ? '#e53e3e' :
                    color.toLowerCase() === 'navy' ? '#1a237e' :
                    color.toLowerCase() === 'green' ? '#22c55e' :
                    color.toLowerCase() === 'brown' ? '#78350f' :
                    color.toLowerCase() === 'beige' ? '#d4b896' : '#555555',
                }}
                title={color}
              />
            ))}
            {product.colors.length > 5 && (
              <span className="text-[#9a9d9f] text-[10px]">+{product.colors.length - 5}</span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
         <span className="text-[#cc1352] text-sm font-bold"
  style={{ fontFamily: 'Space Mono, monospace' }}>
  R{Number(product.price).toFixed(2)}
</span>
          {product.comparePrice && (
            <span className="text-[#9a9d9f] text-xs line-through">
              R{Number(product.comparePrice).toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;