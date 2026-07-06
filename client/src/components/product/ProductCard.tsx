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
}

const ProductCard = ({ product }: { product: Product }) => {
  const [hovered, setHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : null;

  return (
    <div
      className="group relative bg-[#0f0f0f] border border-[#161616] hover:border-[#c0c0c0]/40 transition-all duration-300"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <Link to={`/products/${product.id}`} className="block relative aspect-[3/4] overflow-hidden bg-[#161616]">
        {product.images?.length > 0 ? (
          <img
            src={hovered && product.images[1] ? product.images[1] : product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag size={40} className="text-[#222222]" />
          </div>
        )}

        {/* Discount Badge */}
        {discount && (
          <span className="absolute top-0 left-0 bg-[#c0c0c0] text-black text-xs font-black px-2 py-1"
            style={{ fontFamily: 'Space Mono, monospace' }}>
            -{discount}%
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); setWishlisted(!wishlisted); }}
          className="absolute top-3 right-3 w-8 h-8 bg-[#080808]/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-[#c0c0c0]"
        >
          <Heart size={13} className={wishlisted ? 'text-[#e53e3e] fill-[#e53e3e]' : 'text-white'} />
        </button>

        {/* Quick Add */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#080808]/95 py-3 px-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 border-t border-[#1e1e1e]">
          <p className="text-[#555555] text-xs text-center tracking-widest uppercase mb-2"
            style={{ fontFamily: 'Space Mono, monospace' }}>Quick Add</p>
          <div className="flex gap-1.5 justify-center">
            {product.sizes?.slice(0, 4).map(size => (
              <button key={size}
                className="w-8 h-8 bg-[#161616] hover:bg-[#c0c0c0] text-white hover:text-black text-xs font-bold transition-colors border border-[#1e1e1e]"
                style={{ fontFamily: 'Space Mono, monospace' }}>
                {size}
              </button>
            ))}
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4 border-t border-[#161616]">
        <p className="text-[#444444] text-xs tracking-widest uppercase mb-1"
          style={{ fontFamily: 'Space Mono, monospace' }}>{product.category}</p>
        <Link to={`/products/${product.id}`}>
          <h3 className="text-white text-sm font-medium hover:text-[#c0c0c0] transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[#c0c0c0] font-bold text-sm"
            style={{ fontFamily: 'Space Mono, monospace' }}>
            R{Number(product.price).toFixed(2)}
          </span>
          {product.comparePrice && (
            <span className="text-[#333333] text-xs line-through">
              R{Number(product.comparePrice).toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;