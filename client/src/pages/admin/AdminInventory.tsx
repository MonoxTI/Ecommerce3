import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../../services/productService';

const AdminInventory = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-inventory'],
    queryFn: () => getProducts({ limit: 100 }),
  });

  const products = data?.products || [];
  const outOfStock = products.filter((p: any) => p.stock === 0);
  const lowStock = products.filter((p: any) => p.stock > 0 && p.stock < 10);
  const inStock = products.filter((p: any) => p.stock >= 10);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-white text-3xl font-bold" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>Inventory</h1>
        <p className="text-[#d5d8d9] text-sm">Stock levels across all products</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'In Stock', count: inStock.length, color: 'text-green-400', bg: 'bg-green-500/10' },
          { label: 'Low Stock', count: lowStock.length, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
          { label: 'Out of Stock', count: outOfStock.length, color: 'text-red-400', bg: 'bg-red-500/10' },
        ].map(({ label, count, color, bg }) => (
          <div key={label} className="bg-[#4f5256] border border-[#1a1a1a] rounded-xl p-4 text-center">
            <p className={`text-3xl font-bold ${color}`}>{count}</p>
            <p className="text-[#d5d8d9] text-sm mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#4f5256] border border-[#1a1a1a] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1a1a1a]">
              {['Product', 'SKU', 'Category', 'Stock Level', 'Status'].map(h => (
                <th key={h} className="text-left text-[#d5d8d9] text-xs font-medium tracking-wider uppercase px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="border-b border-[#1a1a1a]">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <td key={j} className="px-4 py-3"><div className="h-4 bg-[#3a3d40] rounded animate-pulse" /></td>
                  ))}
                </tr>
              ))
            ) : (
              [...outOfStock, ...lowStock, ...inStock].map((p: any) => (
                <tr key={p.id} className="border-b border-[#1a1a1a] hover:bg-[#3a3d40]/50 transition-colors">
                  <td className="px-4 py-3 text-white text-sm font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-[#d5d8d9] text-xs font-mono">{p.sku}</td>
                  <td className="px-4 py-3 text-[#d5d8d9] text-sm">{p.category}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-[#3a3d40] rounded-full h-2 max-w-24">
                        <div className={`h-2 rounded-full ${p.stock === 0 ? 'bg-red-500' : p.stock < 10 ? 'bg-yellow-500' : 'bg-green-500'}`}
                          style={{ width: `${Math.min((p.stock / 100) * 100, 100)}%` }} />
                      </div>
                      <span className="text-white text-sm font-medium w-8">{p.stock}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${p.stock === 0 ? 'bg-red-500/10 text-red-400' : p.stock < 10 ? 'bg-yellow-500/10 text-yellow-400' : 'bg-green-500/10 text-green-400'}`}>
                      {p.stock === 0 ? 'Out of Stock' : p.stock < 10 ? 'Low Stock' : 'In Stock'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminInventory;