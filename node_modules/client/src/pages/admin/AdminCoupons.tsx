import { useState } from 'react';
import { Plus, Trash2, Copy, X as XIcon, Tag, Check, AlertCircle } from 'lucide-react';

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

const inputClass = "w-full 	bg-[#3a3d40] border border-[#d5d8d9]/20 focus:border-[#c0c0c0] text-white px-4 py-3 outline-none text-sm placeholder-[#6a6d70] transition-colors";
const labelClass = "text-[#d5d8d9] text-xs tracking-[0.15em] uppercase block mb-2 font-medium";

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([
    { id: '1', code: 'KIR10', type: 'percentage', value: 10, minOrder: 200, maxUses: 100, usedCount: 23, expiresAt: '2026-12-31', isActive: true },
    { id: '2', code: 'WELCOME50', type: 'fixed', value: 50, minOrder: 300, maxUses: 500, usedCount: 145, expiresAt: '2026-09-30', isActive: true },
    { id: '3', code: 'STREET20', type: 'percentage', value: 20, minOrder: 500, maxUses: 50, usedCount: 50, expiresAt: '2026-08-01', isActive: false },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [form, setForm] = useState({
    code: '', type: 'percentage' as 'percentage' | 'fixed',
    value: '', minOrder: '', maxUses: '', expiresAt: '',
  });

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const addCoupon = () => {
    if (!form.code || !form.value) return;
    setCoupons([...coupons, {
      id: Date.now().toString(),
      code: form.code.toUpperCase(),
      type: form.type,
      value: Number(form.value),
      minOrder: Number(form.minOrder) || 0,
      maxUses: Number(form.maxUses) || 999,
      usedCount: 0,
      expiresAt: form.expiresAt || '2099-12-31',
      isActive: true,
    }]);
    setShowModal(false);
    setForm({ code: '', type: 'percentage', value: '', minOrder: '', maxUses: '', expiresAt: '' });
  };

  const toggleCoupon = (id: string) =>
    setCoupons(coupons.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));

  const deleteCoupon = (id: string) =>
    setCoupons(coupons.filter(c => c.id !== id));

  const activeCoupons = coupons.filter(c => c.isActive);
  const expiredCoupons = coupons.filter(c => !c.isActive || new Date(c.expiresAt) < new Date());

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[#9a9d9f] text-xs tracking-[0.3em] mb-1" style={{ fontFamily: 'Space Mono, monospace' }}>// Manage</p>
          <h1 className="text-white text-5xl font-black" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>Coupons</h1>
          <p className="text-[#9a9d9f] text-xs mt-1" style={{ fontFamily: 'Space Mono, monospace' }}>
            {activeCoupons.length} active · {expiredCoupons.length} inactive
          </p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#c0c0c0] hover:bg-white text-black font-black px-5 py-3 transition-colors text-xs tracking-wider uppercase"
          style={{ fontFamily: 'Space Mono, monospace' }}>
          <Plus size={14} /> New Coupon
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Active Codes', value: activeCoupons.length, color: 'text-green-400' },
          { label: 'Total Uses', value: coupons.reduce((s, c) => s + c.usedCount, 0), color: 'text-[#c0c0c0]' },
          { label: 'Inactive', value: expiredCoupons.length, color: 'text-[#9a9d9f]' },
        ].map(({ label, value, color }) => (
          <div key={label} className="border border-[#d5d8d9]/20 bg-[#0a0a0a] p-4">
            <p className={`text-3xl font-black ${color}`} style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{value}</p>
            <p className="text-[#9a9d9f] text-xs mt-1" style={{ fontFamily: 'Space Mono, monospace' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Coupons list */}
      <div className="space-y-2">
        {coupons.map(coupon => {
          const usagePercent = Math.min((coupon.usedCount / coupon.maxUses) * 100, 100);
          const isExpired = new Date(coupon.expiresAt) < new Date();
          const isFull = coupon.usedCount >= coupon.maxUses;

          return (
            <div key={coupon.id}
              className={`border transition-all ${coupon.isActive && !isExpired ? 'border-[#d5d8d9]/20 bg-[#0a0a0a] hover:border-[#d5d8d9]/15' : 'border-[#111111] 	bg-[#3a3d40] opacity-60'}`}>

              {/* Top row */}
              <div className="flex items-center justify-between p-5">
                <div className="flex items-center gap-5">
                  {/* Code badge */}
                  <div className="border border-[#c0c0c0]/20 bg-[#c0c0c0]/5 px-4 py-2.5 flex items-center gap-2">
                    <Tag size={12} className="text-[#c0c0c0]" />
                    <span className="text-[#c0c0c0] font-black text-sm tracking-[0.2em]"
                      style={{ fontFamily: 'Space Mono, monospace' }}>
                      {coupon.code}
                    </span>
                  </div>

                  {/* Info */}
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-white font-bold text-sm">
                        {coupon.type === 'percentage' ? `${coupon.value}% off` : `R${coupon.value} off`}
                      </p>
                      {isExpired && (
                        <span className="text-xs border border-red-500/30 text-red-400 px-2 py-0.5"
                          style={{ fontFamily: 'Space Mono, monospace' }}>EXPIRED</span>
                      )}
                      {isFull && !isExpired && (
                        <span className="text-xs border border-yellow-500/30 text-yellow-400 px-2 py-0.5"
                          style={{ fontFamily: 'Space Mono, monospace' }}>MAXED</span>
                      )}
                    </div>
                    <p className="text-[#9a9d9f] text-xs" style={{ fontFamily: 'Space Mono, monospace' }}>
                      Min R{coupon.minOrder} · Expires {coupon.expiresAt}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <div className="text-right mr-4">
                    <p className="text-white text-sm font-black" style={{ fontFamily: 'Space Mono, monospace' }}>
                      {coupon.usedCount}/{coupon.maxUses}
                    </p>
                    <p className="text-[#9a9d9f] text-xs">uses</p>
                  </div>

                  <button onClick={() => copyCode(coupon.code)}
                    className={`flex items-center gap-1.5 px-3 py-2 border text-xs transition-colors ${
                      copied === coupon.code
                        ? 'border-green-500/30 text-green-400 bg-green-500/5'
                        : 'border-[#d5d8d9]/20 text-[#9a9d9f] hover:border-[#c0c0c0] hover:text-white'
                    }`}
                    style={{ fontFamily: 'Space Mono, monospace' }}>
                    {copied === coupon.code ? <><Check size={11} /> Copied</> : <><Copy size={11} /> Copy</>}
                  </button>

                  <button onClick={() => toggleCoupon(coupon.id)}
                    className={`px-3 py-2 border text-xs transition-colors ${
                      coupon.isActive
                        ? 'border-green-500/20 text-green-400 hover:bg-green-500/5'
                        : 'border-[#d5d8d9]/20 text-[#9a9d9f] hover:text-white hover:border-[#555555]'
                    }`}
                    style={{ fontFamily: 'Space Mono, monospace' }}>
                    {coupon.isActive ? 'Active' : 'Inactive'}
                  </button>

                  <button onClick={() => { if (confirm(`Delete ${coupon.code}?`)) deleteCoupon(coupon.id); }}
                    className="p-2 border border-[#d5d8d9]/20 text-[#9a9d9f] hover:text-[#e53e3e] hover:border-[#e53e3e]/30 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Usage bar */}
              <div className="px-5 pb-4">
                <div className="w-full bg-[#4f5256] h-1">
                  <div
                    className={`h-1 transition-all ${usagePercent >= 100 ? 'bg-red-500' : usagePercent >= 75 ? 'bg-yellow-500' : 'bg-[#c0c0c0]'}`}
                    style={{ width: `${usagePercent}%` }}
                  />
                </div>
                <p className="text-[#6a6d70] text-xs mt-1" style={{ fontFamily: 'Space Mono, monospace' }}>
                  {usagePercent.toFixed(0)}% used
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {coupons.length === 0 && (
        <div className="border border-dashed border-[#d5d8d9]/20 py-20 text-center">
          <Tag size={40} className="text-[#1e1e1e] mx-auto mb-4" />
          <p className="text-[#6a6d70] text-sm" style={{ fontFamily: 'Space Mono, monospace' }}>// No coupons yet</p>
        </div>
      )}

      {/* CREATE MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="	bg-[#3a3d40] border border-[#d5d8d9]/20 w-full max-w-lg">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#d5d8d9]/20">
              <div>
                <p className="text-white text-sm font-bold" style={{ fontFamily: 'Space Mono, monospace' }}>
                  // Create Coupon
                </p>
                <p className="text-[#6a6d70] text-xs mt-0.5">Set up a new discount code</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-[#9a9d9f] hover:text-white transition-colors">
                <XIcon size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5">

              {/* Code */}
              <div>
                <label className={labelClass} style={{ fontFamily: 'Space Mono, monospace' }}>Coupon Code *</label>
                <div className="relative">
                  <input value={form.code}
                    onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. STREET20"
                    className={`${inputClass} pr-16 font-bold tracking-wider`}
                    style={{ fontFamily: 'Space Mono, monospace' }} />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6a6d70] text-xs"
                    style={{ fontFamily: 'Space Mono, monospace' }}>{form.code.length}/20</span>
                </div>
                <p className="text-[#6a6d70] text-xs mt-1">Auto-converted to uppercase</p>
              </div>

              {/* Discount Type */}
              <div>
                <label className={labelClass} style={{ fontFamily: 'Space Mono, monospace' }}>Discount Type *</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: 'percentage', label: 'Percentage', desc: 'e.g. 10% off total' },
                    { key: 'fixed', label: 'Fixed Amount', desc: 'e.g. R50 off total' },
                  ].map(opt => (
                    <button key={opt.key} onClick={() => setForm({ ...form, type: opt.key as any })}
                      className={`p-4 border text-left transition-all ${
                        form.type === opt.key
                          ? 'border-[#c0c0c0] bg-[#c0c0c0]/5'
                          : 'border-[#d5d8d9]/20 hover:border-[#d5d8d9]/15'
                      }`}>
                      <div className={`w-3 h-3 border mb-2 flex items-center justify-center ${
                        form.type === opt.key ? 'border-[#c0c0c0] bg-[#c0c0c0]' : 'border-[#333333]'
                      }`}>
                        {form.type === opt.key && <div className="w-1.5 h-1.5 bg-black" />}
                      </div>
                      <p className="text-white text-xs font-bold" style={{ fontFamily: 'Space Mono, monospace' }}>{opt.label}</p>
                      <p className="text-[#9a9d9f] text-xs mt-0.5">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Value */}
              <div>
                <label className={labelClass} style={{ fontFamily: 'Space Mono, monospace' }}>
                  {form.type === 'percentage' ? 'Discount (%)' : 'Discount Amount (R)'} *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a9d9f] text-sm font-bold"
                    style={{ fontFamily: 'Space Mono, monospace' }}>
                    {form.type === 'percentage' ? '%' : 'R'}
                  </span>
                  <input value={form.value} onChange={e => setForm({ ...form, value: e.target.value })}
                    placeholder={form.type === 'percentage' ? '10' : '50'}
                    type="number" className={`${inputClass} pl-9`} />
                </div>
                {form.type === 'percentage' && Number(form.value) > 100 && (
                  <div className="flex items-center gap-2 mt-2">
                    <AlertCircle size={12} className="text-yellow-400" />
                    <p className="text-yellow-400 text-xs" style={{ fontFamily: 'Space Mono, monospace' }}>
                      Percentage cannot exceed 100%
                    </p>
                  </div>
                )}
              </div>

              {/* Min order & max uses */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass} style={{ fontFamily: 'Space Mono, monospace' }}>Min Order (R)</label>
                  <input value={form.minOrder} onChange={e => setForm({ ...form, minOrder: e.target.value })}
                    placeholder="200" type="number" className={inputClass} />
                  <p className="text-[#6a6d70] text-xs mt-1">0 = no minimum</p>
                </div>
                <div>
                  <label className={labelClass} style={{ fontFamily: 'Space Mono, monospace' }}>Max Uses</label>
                  <input value={form.maxUses} onChange={e => setForm({ ...form, maxUses: e.target.value })}
                    placeholder="100" type="number" className={inputClass} />
                  <p className="text-[#6a6d70] text-xs mt-1">Empty = unlimited</p>
                </div>
              </div>

              {/* Expiry */}
              <div>
                <label className={labelClass} style={{ fontFamily: 'Space Mono, monospace' }}>Expiry Date</label>
                <input value={form.expiresAt} onChange={e => setForm({ ...form, expiresAt: e.target.value })}
                  type="date" min={new Date().toISOString().split('T')[0]}
                  className={`${inputClass} [color-scheme:dark]`} />
                <p className="text-[#6a6d70] text-xs mt-1">Leave empty for no expiry</p>
              </div>

              {/* Preview */}
              {form.code && form.value && (
                <div className="border border-[#c0c0c0]/20 bg-[#c0c0c0]/5 p-4">
                  <p className="text-[#9a9d9f] text-xs mb-2" style={{ fontFamily: 'Space Mono, monospace' }}>Preview:</p>
                  <div className="flex items-center gap-3">
                    <span className="text-[#c0c0c0] font-black text-lg tracking-[0.2em]"
                      style={{ fontFamily: 'Space Mono, monospace' }}>{form.code}</span>
                    <span className="text-[#9a9d9f] text-xs">→</span>
                    <span className="text-white text-sm">
                      {form.type === 'percentage' ? `${form.value}% off` : `R${form.value} off`}
                      {form.minOrder ? ` on orders over R${form.minOrder}` : ''}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-[#d5d8d9]/20 px-6 py-4 flex gap-3 bg-[#0a0a0a]">
              <button onClick={() => setShowModal(false)}
                className="flex-1 border border-[#d5d8d9]/20 text-[#9a9d9f] hover:text-white py-3 text-xs transition-colors"
                style={{ fontFamily: 'Space Mono, monospace' }}>
                Cancel
              </button>
              <button onClick={addCoupon}
                disabled={!form.code || !form.value || (form.type === 'percentage' && Number(form.value) > 100)}
                className="flex-1 bg-[#c0c0c0] hover:bg-white disabled:opacity-30 text-black font-black py-3 text-xs transition-colors"
                style={{ fontFamily: 'Space Mono, monospace' }}>
                // Create Coupon
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;