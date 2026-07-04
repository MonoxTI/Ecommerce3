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

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  const [hovered, setHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : null;

  return (
    <div
      className="group relative bg-[#111111] rounded-xl overflow-hidden border border-[#1a1a1a] hover:border-[#c9a84c]/30 transition-all duration-300"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <Link to={`/products/${product.id}`} className="block relative aspect-[3/4] overflow-hidden bg-[#1a1a1a]">
        {product.images.length > 0 ? (
          <img
            src={hovered && product.images[1] ? product.images[1] : product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag size={40} className="text-[#333333]" />
          </div>
        )}

        {/* Discount Badge */}
        {discount && (
          <span className="absolute top-3 left-3 bg-[#e53e3e] text-white text-xs font-bold px-2 py-1 rounded-md">
            -{discount}%
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); setWishlisted(!wishlisted); }}
          className="absolute top-3 right-3 w-8 h-8 bg-[#0a0a0a]/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-[#c9a84c]"
        >
          <Heart
            size={14}
            className={wishlisted ? 'text-[#e53e3e] fill-[#e53e3e]' : 'text-white'}
          />
        </button>

        {/* Quick Add overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#0a0a0a]/90 backdrop-blur-sm py-3 px-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-[#888888] text-xs text-center tracking-wider uppercase">Quick Add</p>
          <div className="flex gap-2 justify-center mt-2">
            {product.sizes.slice(0, 4).map(size => (
              <button
                key={size}
                className="w-8 h-8 bg-[#1a1a1a] hover:bg-[#c9a84c] text-white hover:text-black text-xs font-medium rounded transition-colors duration-150"
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <p className="text-[#888888] text-xs tracking-widest uppercase mb-1">{product.category}</p>
        <Link to={`/products/${product.id}`}>
          <h3 className="text-white text-sm font-medium hover:text-[#c9a84c] transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[#c9a84c] font-semibold">R{Number(product.price).toFixed(2)}</span>
          {product.comparePrice && (
            <span className="text-[#444444] text-sm line-through">R{Number(product.comparePrice).toFixed(2)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;