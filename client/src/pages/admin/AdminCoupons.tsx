import { useState } from 'react';
import { Plus, Trash2, Copy, X } from 'lucide-react';

// Note: Coupons need a backend module — for now this manages them in local state
// We'll build the coupons backend endpoint after the frontend is complete

interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrder: number;
  maxUses: number;
  usedCount: number;
  expiresAt: string;
  isActive: boolean;
}

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([
    { id: '1', code: 'MONOX10', type: 'percentage', value: 10, minOrder: 200, maxUses: 100, usedCount: 23, expiresAt: '2026-12-31', isActive: true },
    { id: '2', code: 'WELCOME50', type: 'fixed', value: 50, minOrder: 300, maxUses: 500, usedCount: 145, expiresAt: '2026-09-30', isActive: true },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ code: '', type: 'percentage', value: '', minOrder: '', maxUses: '', expiresAt: '' });

  const addCoupon = () => {
    const newCoupon: Coupon = {
      id: Date.now().toString(),
      code: form.code.toUpperCase(),
      type: form.type as 'percentage' | 'fixed',
      value: Number(form.value),
      minOrder: Number(form.minOrder),
      maxUses: Number(form.maxUses),
      usedCount: 0,
      expiresAt: form.expiresAt,
      isActive: true,
    };
    setCoupons([...coupons, newCoupon]);
    setShowModal(false);
    setForm({ code: '', type: 'percentage', value: '', minOrder: '', maxUses: '', expiresAt: '' });
  };

  const toggleCoupon = (id: string) => {
    setCoupons(coupons.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
  };

  const deleteCoupon = (id: string) => {
    setCoupons(coupons.filter(c => c.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-3xl font-bold" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>Coupons</h1>
          <p className="text-[#888888] text-sm">{coupons.filter(c => c.isActive).length} active coupons</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#c9a84c] hover:bg-[#a8893d] text-black font-semibold px-4 py-2 rounded-lg transition-colors text-sm">
          <Plus size={16} /> Add Coupon
        </button>
      </div>

      <div className="grid gap-4">
        {coupons.map(coupon => (
          <div key={coupon.id} className={`bg-[#111111] border rounded-xl p-5 transition-colors ${coupon.isActive ? 'border-[#1a1a1a]' : 'border-[#1a1a1a] opacity-50'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-[#c9a84c]/10 border border-[#c9a84c]/20 rounded-lg px-4 py-2">
                  <span className="text-[#c9a84c] font-bold font-mono tracking-widest">{coupon.code}</span>
                </div>
                <div>
                  <p className="text-white font-semibold">
                    {coupon.type === 'percentage' ? `${coupon.value}% off` : `R${coupon.value} off`}
                  </p>
                  <p className="text-[#888888] text-xs">Min order: R{coupon.minOrder} · Expires: {coupon.expiresAt}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-white text-sm font-medium">{coupon.usedCount}/{coupon.maxUses}</p>
                  <p className="text-[#888888] text-xs">uses</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => navigator.clipboard.writeText(coupon.code)}
                    className="p-1.5 text-[#888888] hover:text-[#c9a84c] hover:bg-[#c9a84c]/10 rounded transition-colors">
                    <Copy size={14} />
                  </button>
                  <button onClick={() => toggleCoupon(coupon.id)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${coupon.isActive ? 'border-green-500/30 text-green-400 hover:bg-green-500/10' : 'border-[#222222] text-[#888888] hover:text-white'}`}>
                    {coupon.isActive ? 'Active' : 'Inactive'}
                  </button>
                  <button onClick={() => { if (confirm('Delete coupon?')) deleteCoupon(coupon.id); }}
                    className="p-1.5 text-[#888888] hover:text-[#e53e3e] hover:bg-[#e53e3e]/10 rounded transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Usage bar */}
            <div className="mt-4">
              <div className="w-full bg-[#1a1a1a] rounded-full h-1.5">
                <div className="bg-[#c9a84c] h-1.5 rounded-full transition-all"
                  style={{ width: `${(coupon.usedCount / coupon.maxUses) * 100}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#1a1a1a] rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-[#1a1a1a]">
              <h2 className="text-white font-semibold">Create Coupon</h2>
              <button onClick={() => setShowModal(false)} className="text-[#888888] hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: 'Coupon Code', key: 'code', placeholder: 'MONOX20' },
                { label: 'Discount Value', key: 'value', placeholder: '10 (percent or rand)' },
                { label: 'Minimum Order (R)', key: 'minOrder', placeholder: '200' },
                { label: 'Max Uses', key: 'maxUses', placeholder: '100' },
                { label: 'Expires At', key: 'expiresAt', placeholder: '2026-12-31' },
              ].map(field => (
                <div key={field.key}>
                  <label className="text-[#888888] text-xs tracking-wider uppercase block mb-1">{field.label}</label>
                  <input value={form[field.key as keyof typeof form]}
                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    className="w-full bg-[#1a1a1a] border border-[#222222] focus:border-[#c9a84c] text-white px-3 py-2.5 rounded-lg outline-none text-sm placeholder-[#444444] transition-colors" />
                </div>
              ))}
              <div>
                <label className="text-[#888888] text-xs tracking-wider uppercase block mb-1">Discount Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-[#222222] text-white px-3 py-2.5 rounded-lg text-sm outline-none focus:border-[#c9a84c]">
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (R)</option>
                </select>
              </div>
              <button onClick={addCoupon}
                className="w-full bg-[#c9a84c] hover:bg-[#a8893d] text-black font-semibold py-3 rounded-lg transition-colors text-sm">
                Create Coupon
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;