import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, X as XIcon, Upload, GripVertical, Eye, EyeOff } from 'lucide-react';
import {
  getAdminCategories, createCategory,
  updateCategory, deleteCategory,
} from '../../services/categoryService';

const inputClass = "w-full bg-[#080808] border border-[#d5d8d9]/20 focus:border-[#cc1352] text-white px-4 py-3 outline-none text-sm placeholder-[#6a6d70] transition-colors";
const labelClass = "text-[#9a9d9f] text-xs tracking-[0.15em] uppercase block mb-2 font-medium";

const AdminCategories = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [form, setForm] = useState({
    name: '', description: '', sortOrder: '0',
  });

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: getAdminCategories,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('description', form.description);
      fd.append('sortOrder', form.sortOrder);
      if (imageFile) fd.append('image', imageFile);

      if (editing) return updateCategory(editing.id, fd);
      return createCategory(fd);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      closeModal();
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (cat: any) => {
      const fd = new FormData();
      fd.append('isActive', String(!cat.isActive));
      return updateCategory(cat.id, fd);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-categories'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-categories'] }),
  });

  const openEdit = (cat: any) => {
    setEditing(cat);
    setForm({ name: cat.name, description: cat.description || '', sortOrder: String(cat.sortOrder) });
    setImagePreview(cat.image || '');
    setImageFile(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    setImageFile(null);
    setImagePreview('');
    setForm({ name: '', description: '', sortOrder: '0' });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const active = categories.filter((c: any) => c.isActive);
  const inactive = categories.filter((c: any) => !c.isActive);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[#cc1352] text-xs tracking-[0.3em] mb-1"
            style={{ fontFamily: 'Space Mono, monospace' }}>// Manage</p>
          <h1 className="text-white text-5xl font-black"
            style={{ fontFamily: 'Bebas Neue, sans-serif' }}>Categories</h1>
          <p className="text-[#9a9d9f] text-xs mt-1"
            style={{ fontFamily: 'Space Mono, monospace' }}>
            {active.length} active · {inactive.length} inactive
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#cc1352] hover:bg-[#e8175e] text-white font-black px-5 py-3 transition-colors text-xs tracking-wider uppercase"
          style={{ fontFamily: 'Space Mono, monospace' }}>
          <Plus size={14} /> New Category
        </button>
      </div>

      {/* Category Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-[#4f5256] border border-[#d5d8d9]/20 animate-pulse">
              <div className="aspect-video bg-[#3a3d40]" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-[#3a3d40] w-2/3" />
                <div className="h-3 bg-[#3a3d40] w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-[#d5d8d9]/20">
          <p className="text-[#9a9d9f] text-sm mb-4" style={{ fontFamily: 'Space Mono, monospace' }}>
            // No categories yet
          </p>
          <p className="text-[#6a6d70] text-xs mb-6">Create your first category to get started</p>
          <button onClick={() => setShowModal(true)}
            className="bg-[#cc1352] hover:bg-[#e8175e] text-white font-black px-6 py-3 text-xs transition-colors tracking-wider uppercase"
            style={{ fontFamily: 'Space Mono, monospace' }}>
            Create Category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat: any) => (
            <div
              key={cat.id}
              className={`bg-[#4f5256] border group transition-all duration-200 ${
                cat.isActive
                  ? 'border-[#d5d8d9]/20 hover:border-[#cc1352]/40'
                  : 'border-[#d5d8d9]/10 opacity-50'
              }`}
            >
              {/* Image */}
              <div className="aspect-video bg-[#3a3d40] overflow-hidden relative">
                {cat.image ? (
                  <img src={cat.image} alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-[#6a6d70] text-3xl font-black"
                      style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                      {cat.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}

                {/* Sort order badge */}
                <div className="absolute top-2 left-2 bg-[#0a0a0a]/80 text-[#9a9d9f] text-[10px] px-2 py-1"
                  style={{ fontFamily: 'Space Mono, monospace' }}>
                  #{cat.sortOrder}
                </div>

                {/* Inactive badge */}
                {!cat.isActive && (
                  <div className="absolute top-2 right-2 bg-[#e53e3e]/90 text-white text-[10px] px-2 py-1 font-bold"
                    style={{ fontFamily: 'Space Mono, monospace' }}>
                    HIDDEN
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="text-white font-bold text-sm mb-0.5">{cat.name}</h3>
                <p className="text-[#9a9d9f] text-xs mb-1"
                  style={{ fontFamily: 'Space Mono, monospace' }}>/{cat.slug}</p>
                {cat.description && (
                  <p className="text-[#6a6d70] text-xs line-clamp-1 mb-3">{cat.description}</p>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t border-[#d5d8d9]/10">
                  <button
                    onClick={() => openEdit(cat)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[#d5d8d9] hover:text-white border border-[#d5d8d9]/20 hover:border-[#cc1352] text-xs transition-colors"
                    style={{ fontFamily: 'Space Mono, monospace' }}>
                    <Edit size={12} /> Edit
                  </button>
                  <button
                    onClick={() => toggleMutation.mutate(cat)}
                    className={`py-2 px-3 border text-xs transition-colors ${
                      cat.isActive
                        ? 'border-[#d5d8d9]/20 text-[#9a9d9f] hover:text-white hover:border-[#d5d8d9]/40'
                        : 'border-[#22c55e]/30 text-[#22c55e] hover:bg-[#22c55e]/10'
                    }`}>
                    {cat.isActive ? <EyeOff size={12} /> : <Eye size={12} />}
                  </button>
                  <button
                    onClick={() => { if (confirm(`Delete "${cat.name}"?`)) deleteMutation.mutate(cat.id); }}
                    className="py-2 px-3 border border-[#d5d8d9]/20 text-[#9a9d9f] hover:text-[#e53e3e] hover:border-[#e53e3e]/30 text-xs transition-colors">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f0f0f] border border-[#d5d8d9]/20 w-full max-w-lg">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#d5d8d9]/20">
              <div>
                <p className="text-white text-sm font-bold"
                  style={{ fontFamily: 'Space Mono, monospace' }}>
                  {editing ? '// Edit Category' : '// New Category'}
                </p>
                <p className="text-[#6a6d70] text-xs mt-0.5">
                  {editing ? `Editing: ${editing.name}` : 'Fill in the details below'}
                </p>
              </div>
              <button onClick={closeModal}
                className="text-[#6a6d70] hover:text-white transition-colors">
                <XIcon size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5">

              {/* Image upload */}
              <div>
                <label className={labelClass} style={{ fontFamily: 'Space Mono, monospace' }}>
                  Category Image
                </label>
                <label className="block cursor-pointer">
                  <div className={`relative overflow-hidden border-2 border-dashed transition-colors ${
                    imagePreview ? 'border-[#cc1352]/40' : 'border-[#d5d8d9]/20 hover:border-[#cc1352]/40'
                  }`}>
                    {imagePreview ? (
                      <div className="relative">
                        <img src={imagePreview} alt="Preview"
                          className="w-full h-48 object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <p className="text-white text-xs font-bold"
                            style={{ fontFamily: 'Space Mono, monospace' }}>
                            Click to change image
                          </p>
                        </div>
                        {/* Remove image button */}
                        <button
                          type="button"
                          onClick={(e) => { e.preventDefault(); setImagePreview(''); setImageFile(null); }}
                          className="absolute top-2 right-2 bg-[#e53e3e] text-white w-6 h-6 flex items-center justify-center">
                          <XIcon size={12} />
                        </button>
                      </div>
                    ) : (
                      <div className="h-48 flex flex-col items-center justify-center gap-3">
                        <Upload size={28} className="text-[#6a6d70]" />
                        <div className="text-center">
                          <p className="text-[#9a9d9f] text-sm">Click to upload image</p>
                          <p className="text-[#6a6d70] text-xs mt-1">
                            JPG, PNG, WEBP · Max 5MB
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>

              {/* Name */}
              <div>
                <label className={labelClass} style={{ fontFamily: 'Space Mono, monospace' }}>
                  Category Name *
                </label>
                <input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Hoodies, T-Shirts, Jackets"
                  className={inputClass}
                />
                {form.name && (
                  <p className="text-[#6a6d70] text-xs mt-1"
                    style={{ fontFamily: 'Space Mono, monospace' }}>
                    Slug: /{form.name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className={labelClass} style={{ fontFamily: 'Space Mono, monospace' }}>
                  Description <span className="text-[#6a6d70] normal-case">(optional)</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Short description of this category..."
                  rows={2}
                  className="w-full bg-[#080808] border border-[#d5d8d9]/20 focus:border-[#cc1352] text-white px-4 py-3 outline-none text-sm placeholder-[#6a6d70] transition-colors resize-none"
                />
              </div>

              {/* Sort order */}
              <div>
                <label className={labelClass} style={{ fontFamily: 'Space Mono, monospace' }}>
                  Display Order
                </label>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={e => setForm({ ...form, sortOrder: e.target.value })}
                  min="0"
                  className={inputClass}
                />
                <p className="text-[#6a6d70] text-xs mt-1">
                  Lower number = appears first (0 = top)
                </p>
              </div>

              {saveMutation.isError && (
                <p className="text-[#e53e3e] text-xs"
                  style={{ fontFamily: 'Space Mono, monospace' }}>
                  ✗ {(saveMutation.error as any)?.response?.data?.message || 'Save failed'}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button onClick={closeModal}
                  className="flex-1 border border-[#d5d8d9]/20 hover:border-[#d5d8d9]/40 text-[#9a9d9f] hover:text-white py-3 text-xs transition-colors"
                  style={{ fontFamily: 'Space Mono, monospace' }}>
                  Cancel
                </button>
                <button
                  onClick={() => saveMutation.mutate()}
                  disabled={saveMutation.isPending || !form.name}
                  className="flex-1 bg-[#cc1352] hover:bg-[#e8175e] disabled:opacity-40 text-white font-black py-3 text-xs transition-colors"
                  style={{ fontFamily: 'Space Mono, monospace' }}>
                  {saveMutation.isPending
                    ? '// Saving...'
                    : editing ? '// Update' : '// Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;