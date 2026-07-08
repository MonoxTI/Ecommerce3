import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Search, X as XIcon, Package, Upload } from 'lucide-react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/productService';

const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'One Size'];
const ALL_COLORS = ['Black', 'White', 'Grey', 'Silver', 'Navy', 'Red', 'Green', 'Brown', 'Beige', 'Camo'];
const CATEGORIES = ['streetwear', 'luxury', 'hoodies', 'sneakers', 'accessories', 'tops', 'bottoms', 'outerwear'];

const inputClass = "w-full bg-[#080808] border border-[#1e1e1e] focus:border-[#c0c0c0] text-white px-4 py-3 outline-none text-sm placeholder-[#333333] transition-colors";
const labelClass = "text-[#888888] text-xs tracking-[0.15em] uppercase block mb-2 font-medium";
const sectionClass = "border border-[#1e1e1e] bg-[#0a0a0a] p-5 space-y-4";

const AdminProducts = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'variants' | 'images'>('basic');

  const [form, setForm] = useState({
    name: '', description: '', price: '',
    comparePrice: '', category: '', stock: '', sku: '',
  });
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [images, setImages] = useState<FileList | null>(null);
  const [imagePreview, setImagePreview] = useState<string[]>([]);

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
          sizes: selectedSizes,
          colors: selectedColors,
        });
      }
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append('sizes', JSON.stringify(selectedSizes));
      fd.append('colors', JSON.stringify(selectedColors));
      if (images) Array.from(images).forEach(img => fd.append('images', img));
      return createProduct(fd);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      closeModal();
    },
  });

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    setActiveTab('basic');
    setForm({ name: '', description: '', price: '', comparePrice: '', category: '', stock: '', sku: '' });
    setSelectedSizes([]);
    setSelectedColors([]);
    setImages(null);
    setImagePreview([]);
  };

  const openEdit = (p: any) => {
    setEditing(p);
    setForm({
      name: p.name, description: p.description, price: p.price,
      comparePrice: p.comparePrice || '', category: p.category,
      stock: p.stock, sku: p.sku,
    });
    setSelectedSizes(p.sizes || []);
    setSelectedColors(p.colors || []);
    setShowModal(true);
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setImages(files);
    const previews = Array.from(files).map(f => URL.createObjectURL(f));
    setImagePreview(previews);
  };

  const products = data?.products || [];

  const tabs = [
    { key: 'basic', label: 'Basic Info' },
    { key: 'variants', label: 'Sizes & Colors' },
    { key: 'images', label: 'Images' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[#444444] text-xs tracking-[0.3em] mb-1" style={{ fontFamily: 'Space Mono, monospace' }}>// Manage</p>
          <h1 className="text-white text-5xl font-black" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>Products</h1>
          <p className="text-[#444444] text-xs mt-1" style={{ fontFamily: 'Space Mono, monospace' }}>{products.length} items in catalogue</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#c0c0c0] hover:bg-white text-black font-black px-5 py-3 transition-colors text-xs tracking-wider uppercase"
          style={{ fontFamily: 'Space Mono, monospace' }}>
          <Plus size={14} /> New Product
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444444]" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, category, SKU..."
          className="w-full bg-[#0f0f0f] border border-[#1e1e1e] focus:border-[#c0c0c0] text-white pl-11 pr-4 py-3 outline-none transition-colors text-sm placeholder-[#333333]" />
      </div>

      {/* Table */}
      <div className="border border-[#1e1e1e] overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="bg-[#0a0a0a] border-b border-[#1e1e1e]">
              {['Product', 'Category', 'Price', 'Stock', 'Sizes', 'SKU', ''].map(h => (
                <th key={h} className="text-left text-[#333333] text-xs font-bold tracking-[0.2em] uppercase px-4 py-3"
                  style={{ fontFamily: 'Space Mono, monospace' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-[#0f0f0f]">
                  {Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="px-4 py-4"><div className="h-3 bg-[#111111] animate-pulse" /></td>
                  ))}
                </tr>
              ))
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <Package size={40} className="text-[#1e1e1e] mb-4" />
                    <p className="text-[#333333] text-sm mb-1" style={{ fontFamily: 'Space Mono, monospace' }}>// No products yet</p>
                    <p className="text-[#222222] text-xs">Add your first product to get started</p>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((p: any) => (
                <tr key={p.id} className="border-b border-[#0f0f0f] hover:bg-[#0a0a0a] transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#111111] border border-[#1e1e1e] overflow-hidden flex-shrink-0">
                        {p.images?.[0]
                          ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-[#222222] text-xs">?</div>
                        }
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{p.name}</p>
                        <p className="text-[#333333] text-xs truncate max-w-[160px]">{p.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[#555555] text-xs border border-[#1e1e1e] px-2 py-1"
                      style={{ fontFamily: 'Space Mono, monospace' }}>{p.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-[#c0c0c0] text-sm font-bold" style={{ fontFamily: 'Space Mono, monospace' }}>
                      R{Number(p.price).toFixed(2)}
                    </p>
                    {p.comparePrice && (
                      <p className="text-[#333333] text-xs line-through">R{Number(p.comparePrice).toFixed(2)}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-1 border ${
                      p.stock === 0 ? 'border-red-500/20 text-red-400 bg-red-500/5'
                      : p.stock < 10 ? 'border-yellow-500/20 text-yellow-400 bg-yellow-500/5'
                      : 'border-green-500/20 text-green-400 bg-green-500/5'
                    }`} style={{ fontFamily: 'Space Mono, monospace' }}>
                      {p.stock === 0 ? 'OUT' : p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap max-w-[120px]">
                      {p.sizes?.slice(0, 3).map((s: string) => (
                        <span key={s} className="text-[#444444] text-xs border border-[#1e1e1e] px-1.5 py-0.5">{s}</span>
                      ))}
                      {p.sizes?.length > 3 && (
                        <span className="text-[#333333] text-xs">+{p.sizes.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#2a2a2a] text-xs font-mono">{p.sku}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(p)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[#555555] hover:text-white border border-[#1e1e1e] hover:border-[#c0c0c0] text-xs transition-colors"
                        style={{ fontFamily: 'Space Mono, monospace' }}>
                        <Edit size={11} /> Edit
                      </button>
                      <button onClick={() => { if (confirm(`Delete ${p.name}?`)) deleteMutation.mutate(p.id); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[#555555] hover:text-[#e53e3e] border border-[#1e1e1e] hover:border-[#e53e3e]/50 text-xs transition-colors"
                        style={{ fontFamily: 'Space Mono, monospace' }}>
                        <Trash2 size={11} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#080808] border border-[#1e1e1e] w-full max-w-2xl max-h-[95vh] flex flex-col">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e1e1e] flex-shrink-0">
              <div>
                <p className="text-white text-sm font-bold tracking-[0.1em]" style={{ fontFamily: 'Space Mono, monospace' }}>
                  {editing ? '// Edit Product' : '// New Product'}
                </p>
                <p className="text-[#333333] text-xs mt-0.5">
                  {editing ? `Editing: ${editing.name}` : 'Fill in the details below'}
                </p>
              </div>
              <button onClick={closeModal} className="text-[#444444] hover:text-white transition-colors p-1">
                <XIcon size={18} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#1e1e1e] flex-shrink-0">
              {tabs.map((tab, i) => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key as any)}
                  className={`flex-1 py-3 text-xs font-bold tracking-wider uppercase transition-colors relative ${
                    activeTab === tab.key
                      ? 'text-white bg-[#0f0f0f]'
                      : 'text-[#444444] hover:text-[#777777] hover:bg-[#0a0a0a]'
                  } ${i > 0 ? 'border-l border-[#1e1e1e]' : ''}`}
                  style={{ fontFamily: 'Space Mono, monospace' }}>
                  {activeTab === tab.key && (
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#c0c0c0]" />
                  )}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto p-6">

              {/* TAB 1 — Basic Info */}
              {activeTab === 'basic' && (
                <div className="space-y-5">
                  <div className={sectionClass}>
                    <p className="text-[#555555] text-xs tracking-[0.2em] uppercase border-b border-[#1e1e1e] pb-3 mb-4"
                      style={{ fontFamily: 'Space Mono, monospace' }}>Product Details</p>

                    <div>
                      <label className={labelClass} style={{ fontFamily: 'Space Mono, monospace' }}>Product Name *</label>
                      <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. Oversized Street Hoodie" className={inputClass} />
                    </div>

                    <div>
                      <label className={labelClass} style={{ fontFamily: 'Space Mono, monospace' }}>Description *</label>
                      <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                        placeholder="Describe the product, materials, fit..."
                        rows={3}
                        className="w-full bg-[#080808] border border-[#1e1e1e] focus:border-[#c0c0c0] text-white px-4 py-3 outline-none text-sm placeholder-[#333333] transition-colors resize-none" />
                    </div>

                    <div>
                      <label className={labelClass} style={{ fontFamily: 'Space Mono, monospace' }}>Category *</label>
                      <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                        className={inputClass} style={{ fontFamily: 'Space Mono, monospace' }}>
                        <option value="">Select category...</option>
                        {CATEGORIES.map(c => (
                          <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className={sectionClass}>
                    <p className="text-[#555555] text-xs tracking-[0.2em] uppercase border-b border-[#1e1e1e] pb-3 mb-4"
                      style={{ fontFamily: 'Space Mono, monospace' }}>Pricing & Stock</p>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass} style={{ fontFamily: 'Space Mono, monospace' }}>Price (R) *</label>
                        <input value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
                          placeholder="499.00" type="number" step="0.01" className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass} style={{ fontFamily: 'Space Mono, monospace' }}>Compare Price (R)</label>
                        <input value={form.comparePrice} onChange={e => setForm({ ...form, comparePrice: e.target.value })}
                          placeholder="699.00 (optional)" type="number" step="0.01" className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass} style={{ fontFamily: 'Space Mono, monospace' }}>Stock Quantity *</label>
                        <input value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })}
                          placeholder="100" type="number" className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass} style={{ fontFamily: 'Space Mono, monospace' }}>SKU Code *</label>
                        <input value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })}
                          placeholder="HOOD-BLK-001" className={inputClass} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2 — Sizes & Colors */}
              {activeTab === 'variants' && (
                <div className="space-y-5">
                  {/* Sizes */}
                  <div className={sectionClass}>
                    <div className="flex items-center justify-between border-b border-[#1e1e1e] pb-3 mb-4">
                      <p className="text-[#555555] text-xs tracking-[0.2em] uppercase"
                        style={{ fontFamily: 'Space Mono, monospace' }}>Sizes Available</p>
                      <p className="text-[#c0c0c0] text-xs" style={{ fontFamily: 'Space Mono, monospace' }}>
                        {selectedSizes.length} selected
                      </p>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {ALL_SIZES.map(size => {
                        const checked = selectedSizes.includes(size);
                        return (
                          <button key={size} onClick={() => toggleSize(size)}
                            className={`relative flex items-center gap-2 p-3 border transition-all text-left ${
                              checked
                                ? 'border-[#c0c0c0] bg-[#c0c0c0]/8 text-white'
                                : 'border-[#1e1e1e] text-[#555555] hover:border-[#444444] hover:text-[#888888]'
                            }`}>
                            <div className={`w-4 h-4 border flex-shrink-0 flex items-center justify-center transition-colors ${
                              checked ? 'border-[#c0c0c0] bg-[#c0c0c0]' : 'border-[#333333]'
                            }`}>
                              {checked && (
                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                  <path d="M1 4L3.5 6.5L9 1" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </div>
                            <span className="text-xs font-bold" style={{ fontFamily: 'Space Mono, monospace' }}>{size}</span>
                          </button>
                        );
                      })}
                    </div>

                    {selectedSizes.length > 0 && (
                      <div className="mt-4 p-3 bg-[#080808] border border-[#1e1e1e]">
                        <p className="text-[#444444] text-xs mb-2" style={{ fontFamily: 'Space Mono, monospace' }}>Selected:</p>
                        <div className="flex gap-2 flex-wrap">
                          {selectedSizes.map(s => (
                            <span key={s} className="flex items-center gap-1.5 bg-[#c0c0c0]/10 border border-[#c0c0c0]/20 text-[#c0c0c0] text-xs px-2 py-1"
                              style={{ fontFamily: 'Space Mono, monospace' }}>
                              {s}
                              <button onClick={() => toggleSize(s)} className="hover:text-white transition-colors">
                                <XIcon size={10} />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Colors */}
                  <div className={sectionClass}>
                    <div className="flex items-center justify-between border-b border-[#1e1e1e] pb-3 mb-4">
                      <p className="text-[#555555] text-xs tracking-[0.2em] uppercase"
                        style={{ fontFamily: 'Space Mono, monospace' }}>Colors Available</p>
                      <p className="text-[#c0c0c0] text-xs" style={{ fontFamily: 'Space Mono, monospace' }}>
                        {selectedColors.length} selected
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {ALL_COLORS.map(color => {
                        const checked = selectedColors.includes(color);
                        return (
                          <button key={color} onClick={() => toggleColor(color)}
                            className={`flex items-center gap-3 p-3 border transition-all text-left ${
                              checked
                                ? 'border-[#c0c0c0] bg-[#c0c0c0]/8'
                                : 'border-[#1e1e1e] hover:border-[#444444]'
                            }`}>
                            <div className={`w-4 h-4 border flex-shrink-0 flex items-center justify-center transition-colors ${
                              checked ? 'border-[#c0c0c0] bg-[#c0c0c0]' : 'border-[#333333]'
                            }`}>
                              {checked && (
                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                  <path d="M1 4L3.5 6.5L9 1" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </div>
                            <span className={`text-xs font-medium ${checked ? 'text-white' : 'text-[#555555]'}`}>{color}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3 — Images */}
              {activeTab === 'images' && (
                <div className={sectionClass}>
                  <p className="text-[#555555] text-xs tracking-[0.2em] uppercase border-b border-[#1e1e1e] pb-3 mb-4"
                    style={{ fontFamily: 'Space Mono, monospace' }}>Product Images</p>

                  {/* Upload area */}
                  <label className="block cursor-pointer">
                    <div className="border-2 border-dashed border-[#1e1e1e] hover:border-[#c0c0c0] transition-colors p-10 text-center">
                      <Upload size={32} className="text-[#333333] mx-auto mb-3" />
                      <p className="text-[#555555] text-sm mb-1">Click to upload images</p>
                      <p className="text-[#333333] text-xs" style={{ fontFamily: 'Space Mono, monospace' }}>
                        JPG, PNG, WEBP · Max 5MB each · Up to 5 images
                      </p>
                    </div>
                    <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>

                  {/* Previews */}
                  {imagePreview.length > 0 && (
                    <div className="grid grid-cols-3 gap-3 mt-4">
                      {imagePreview.map((src, i) => (
                        <div key={i} className="relative aspect-square border border-[#1e1e1e] overflow-hidden group">
                          <img src={src} alt="" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-xs" style={{ fontFamily: 'Space Mono, monospace' }}>
                              Image {i + 1}
                            </span>
                          </div>
                          {i === 0 && (
                            <div className="absolute top-2 left-2 bg-[#c0c0c0] text-black text-xs px-1.5 py-0.5 font-bold"
                              style={{ fontFamily: 'Space Mono, monospace' }}>
                              MAIN
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Existing images when editing */}
                  {editing && editing.images?.length > 0 && imagePreview.length === 0 && (
                    <div>
                      <p className="text-[#444444] text-xs mb-3 mt-4" style={{ fontFamily: 'Space Mono, monospace' }}>
                        Current images:
                      </p>
                      <div className="grid grid-cols-3 gap-3">
                        {editing.images.map((src: string, i: number) => (
                          <div key={i} className="relative aspect-square border border-[#1e1e1e] overflow-hidden">
                            <img src={src} alt="" className="w-full h-full object-cover" />
                            {i === 0 && (
                              <div className="absolute top-2 left-2 bg-[#c0c0c0] text-black text-xs px-1.5 py-0.5 font-bold"
                                style={{ fontFamily: 'Space Mono, monospace' }}>
                                MAIN
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div className="border-t border-[#1e1e1e] px-6 py-4 flex items-center justify-between flex-shrink-0 bg-[#0a0a0a]">
              <div className="flex gap-3">
                {tabs.map((tab, i) => (
                  <div key={tab.key}
                    className={`w-2 h-2 transition-colors ${activeTab === tab.key ? 'bg-[#c0c0c0]' : 'bg-[#1e1e1e]'}`} />
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={closeModal}
                  className="px-5 py-2.5 border border-[#1e1e1e] text-[#555555] hover:text-white hover:border-[#555555] text-xs transition-colors"
                  style={{ fontFamily: 'Space Mono, monospace' }}>
                  Cancel
                </button>
                {activeTab !== 'images' ? (
                  <button onClick={() => setActiveTab(activeTab === 'basic' ? 'variants' : 'images')}
                    className="px-5 py-2.5 bg-[#1e1e1e] hover:bg-[#2a2a2a] text-white text-xs transition-colors"
                    style={{ fontFamily: 'Space Mono, monospace' }}>
                    Next →
                  </button>
                ) : null}
                <button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || !form.name || !form.price || !form.stock || !form.sku}
                  className="px-5 py-2.5 bg-[#c0c0c0] hover:bg-white disabled:opacity-30 text-black font-black text-xs transition-colors"
                  style={{ fontFamily: 'Space Mono, monospace' }}>
                  {saveMutation.isPending ? '// Saving...' : editing ? '// Update' : '// Create'}
                </button>
              </div>
            </div>

            {saveMutation.isError && (
              <div className="px-6 pb-4 bg-[#0a0a0a]">
                <p className="text-[#e53e3e] text-xs" style={{ fontFamily: 'Space Mono, monospace' }}>
                  ✗ {(saveMutation.error as any)?.response?.data?.message || 'Save failed'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;