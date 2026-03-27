'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/dashboard-layout';
import { useAuth } from '@/hooks/use-auth';
import { api } from '@/lib/api';
import { BarChart3, Package, MapPin, TrendingUp, Users, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const navItems = [
  { href: '/ngo', label: 'Dashboard', icon: BarChart3 },
  { href: '/ngo/donations', label: 'Donations', icon: Package },
  { href: '/ngo/hotspots', label: 'Hotspots', icon: MapPin },
  { href: '/ngo/volunteers', label: 'Volunteers', icon: Users },
  { href: '/ngo/analytics', label: 'Analytics', icon: TrendingUp },
];

export default function NgoHotspotsPage() {
  const { user, loading, logout } = useAuth('ngo_manager');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ label: '', address: '', city: 'Mumbai', lat: '', lng: '', urgencyLevel: 'medium', estimatedDailyBeneficiaries: '' });
  const qc = useQueryClient();

  const { data } = useQuery({ queryKey: ['hotspots'], queryFn: () => api.getHotspots(), enabled: !!user });

  const addHotspot = useMutation({
    mutationFn: (body: any) => api.post('/hotspots', body),
    onSuccess: () => { toast.success('Hotspot added!'); qc.invalidateQueries({ queryKey: ['hotspots'] }); setShowAdd(false); setForm({ label: '', address: '', city: 'Mumbai', lat: '', lng: '', urgencyLevel: 'medium', estimatedDailyBeneficiaries: '' }); },
    onError: () => toast.error('Failed to add hotspot'),
  });

  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{ background: '#050810' }}><div className="w-8 h-8 rounded-full border-2 border-green-500 border-t-transparent animate-spin" /></div>;

  const hotspots: any[] = data?.data || data || [];
  const urgencyColors: Record<string, string> = { critical: 'badge-red', high: 'badge-gold', medium: 'badge-blue', low: 'badge-gray' };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.lat || !form.lng) { toast.error('Coordinates required'); return; }
    addHotspot.mutate({
      label: form.label,
      address: { street: form.address, city: form.city },
      geoPoint: { type: 'Point', coordinates: [parseFloat(form.lng), parseFloat(form.lat)] },
      urgencyLevel: form.urgencyLevel,
      estimatedDailyBeneficiaries: parseInt(form.estimatedDailyBeneficiaries) || 0,
      isActive: true,
    });
  };

  return (
    <DashboardLayout navItems={navItems} user={user} onLogout={logout} accentColor="from-blue-500 to-blue-700">
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white mb-1">Hotspot Management</h1>
            <p style={{ color: 'rgba(255,255,255,0.4)' }}>High-need food security locations</p>
          </div>
          <button onClick={() => setShowAdd(!showAdd)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)', boxShadow: '0 4px 15px rgba(59,130,246,0.35)' }}>
            <Plus className="w-4 h-4" /> Add Hotspot
          </button>
        </div>

        {/* Add Form */}
        {showAdd && (
          <form onSubmit={handleSubmit} className="mb-8 p-6 rounded-2xl" style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)' }}>
            <h2 className="font-bold text-white mb-5">New Hotspot</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Label / Name', key: 'label', placeholder: 'e.g. Dharavi Slum Area A' },
                { label: 'Street Address', key: 'address', placeholder: '90 Feet Road, Dharavi' },
                { label: 'Latitude', key: 'lat', placeholder: '19.0383' },
                { label: 'Longitude', key: 'lng', placeholder: '72.8527' },
                { label: 'Daily Beneficiaries', key: 'estimatedDailyBeneficiaries', placeholder: '150' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.6)' }}>{f.label}</label>
                  <input value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder} required
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.85)' }} />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.6)' }}>Urgency Level</label>
                <select value={form.urgencyLevel} onChange={e => setForm(p => ({ ...p, urgencyLevel: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.85)' }}>
                  <option value="critical">🔴 Critical</option>
                  <option value="high">🟡 High</option>
                  <option value="medium">🟢 Medium</option>
                  <option value="low">⚪ Low</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button type="submit" className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)' }}>Add Hotspot</button>
              <button type="button" onClick={() => setShowAdd(false)} className="px-5 py-2.5 rounded-xl text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Cancel</button>
            </div>
          </form>
        )}

        {/* Hotspot List */}
        <div className="grid gap-4">
          {hotspots.map((h: any) => (
            <div key={h._id} className="p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <MapPin className="w-5 h-5 text-blue-400" />
                    <h3 className="font-bold text-white">{h.label}</h3>
                    <span className={`badge ${urgencyColors[h.urgencyLevel] || 'badge-gray'} text-xs capitalize`}>{h.urgencyLevel}</span>
                  </div>
                  <p className="text-sm mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>{h.address?.street}, {h.address?.city}</p>
                  <div className="flex gap-4 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    <span>👥 ~{h.estimatedDailyBeneficiaries} beneficiaries/day</span>
                    <span>📍 {h.geoPoint?.coordinates?.[1]?.toFixed(4)}, {h.geoPoint?.coordinates?.[0]?.toFixed(4)}</span>
                    <span className={h.isActive ? 'text-green-400' : 'text-red-400'}>{h.isActive ? '✅ Active' : '❌ Inactive'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {hotspots.length === 0 && (
            <div className="text-center py-20" style={{ color: 'rgba(255,255,255,0.3)' }}>
              <MapPin className="w-12 h-12 mx-auto mb-4 opacity-30" />
              No hotspots yet. Add your first one!
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
