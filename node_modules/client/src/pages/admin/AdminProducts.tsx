import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Search, X } from 'lucide-react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/productService';

const AdminProducts = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', comparePrice: '', category: '', stock: '', sku: '', sizes: '', colors: '' });
  const [images, setImages] = useState<FileList | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', search],
    queryFn: () => getProducts({ search, limit: 50 }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-products'] }),
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editing) {
        return updateProduct(editing.id, {
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
          sizes: form.sizes.split(',').map(s => s.trim()),
          colors: form.colors.split(',').map(s => s.trim()),
        });
      } else {
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        if (images) Array.from(images).forEach(img => fd.append('images', img));
        return createProduct(fd);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setShowModal(false);
      setEditing(null);
      setForm({ name: '', description: '', price: '', comparePrice: '', category: '', stock: '', sku: '', sizes: '', colors: '' });
    },
  });

  const openEdit = (product: any) => {
    setEditing(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      comparePrice: product.comparePrice || '',
      category: product.category,
      stock: product.stock,
      sku: product.sku,
      sizes: product.sizes?.join(', ') || '',
      colors: product.colors?.join(', ') || '',
    });
    setShowModal(true);
  };

  const products = data?.products || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-3xl font-bold" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>Products</h1>
          <p className="text-[#888888] text-sm">{products.length} products</p>
        </div>
        <button onClick={() => { setEditing(null); setShowModal(true); }}
          className="flex items-center gap-2 bg-[#c9a84c] hover:bg-[#a8893d] text-black font-semibold px-4 py-2 rounded-lg transition-colors text-sm">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full bg-[#111111] border border-[#1a1a1a] text-white pl-10 pr-4 py-2.5 rounded-lg outline-none focus:border-[#c9a84c] transition-colors text-sm placeholder-[#444444]" />
      </div>

      {/* Table */}
      <div className="bg-[#111111] border border-[#1a1a1a] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1a1a1a]">
              {['Product', 'Category', 'Price', 'Stock', 'SKU', 'Actions'].map(h => (
                <th key={h} className="text-left text-[#888888] text-xs font-medium tracking-wider uppercase px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-[#1a1a1a]">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="px-4 py-3"><div className="h-4 bg-[#1a1a1a] rounded animate-pulse" /></td>
                  ))}
                </tr>
              ))
            ) : products.length === 0 ? (
              <tr><td colSpan={6} className="text-center text-[#888888] py-12">No products found</td></tr>
            ) : (
              products.map((p: any) => (
                <tr key={p.id} className="border-b border-[#1a1a1a] hover:bg-[#1a1a1a]/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.images?.[0] ? (
                        <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-cover rounded-lg" />
                      ) : (
                        <div className="w-10 h-10 bg-[#222222] rounded-lg" />
                      )}
                      <span className="text-white text-sm font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#888888] text-sm">{p.category}</td>
                  <td className="px-4 py-3 text-[#c9a84c] text-sm font-semibold">R{Number(p.price).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${p.stock === 0 ? 'bg-red-500/10 text-red-400' : p.stock < 10 ? 'bg-yellow-500/10 text-yellow-400' : 'bg-green-500/10 text-green-400'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#888888] text-xs font-mono">{p.sku}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(p)} className="p-1.5 text-[#888888] hover:text-[#c9a84c] hover:bg-[#c9a84c]/10 rounded transition-colors">
                        <Edit size={14} />
                      </button>
                      <button onClick={() => { if (confirm(`Delete ${p.name}?`)) deleteMutation.mutate(p.id); }}
                        className="p-1.5 text-[#888888] hover:text-[#e53e3e] hover:bg-[#e53e3e]/10 rounded transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#1a1a1a] rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-[#1a1a1a]">
              <h2 className="text-white font-semibold">{editing ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setShowModal(false)} className="text-[#888888] hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: 'Name', key: 'name', placeholder: 'Classic White Shirt' },
                { label: 'Description', key: 'description', placeholder: 'Product description...' },
                { label: 'Price (R)', key: 'price', placeholder: '49.99' },
                { label: 'Compare Price (R)', key: 'comparePrice', placeholder: '69.99 (optional)' },
                { label: 'Category', key: 'category', placeholder: 'streetwear' },
                { label: 'Stock', key: 'stock', placeholder: '100' },
                { label: 'SKU', key: 'sku', placeholder: 'SHIRT-WHT-001' },
                { label: 'Sizes (comma separated)', key: 'sizes', placeholder: 'S, M, L, XL' },
                { label: 'Colors (comma separated)', key: 'colors', placeholder: 'white, black, blue' },
              ].map(field => (
                <div key={field.key}>
                  <label className="text-[#888888] text-xs tracking-wider uppercase block mb-1">{field.label}</label>
                  <input
                    value={form[field.key as keyof typeof form]}
                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    className="w-full bg-[#1a1a1a] border border-[#222222] focus:border-[#c9a84c] text-white px-3 py-2.5 rounded-lg outline-none text-sm placeholder-[#444444] transition-colors"
                  />
                </div>
              ))}
              {!editing && (
                <div>
                  <label className="text-[#888888] text-xs tracking-wider uppercase block mb-1">Images</label>
                  <input type="file" multiple accept="image/*" onChange={e => setImages(e.target.files)}
                    className="w-full bg-[#1a1a1a] border border-[#222222] text-[#888888] px-3 py-2.5 rounded-lg text-sm file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-[#c9a84c] file:text-black file:text-xs file:font-semibold" />
                </div>
              )}
              {saveMutation.isError && (
                <p className="text-[#e53e3e] text-sm">{(saveMutation.error as any)?.response?.data?.message || 'Save failed'}</p>
              )}
              <button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}
                className="w-full bg-[#c9a84c] hover:bg-[#a8893d] disabled:opacity-50 text-black font-semibold py-3 rounded-lg transition-colors text-sm">
                {saveMutation.isPending ? 'Saving...' : editing ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;