'use client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { useAuth } from '@/hooks/use-auth';
import { LayoutDashboard, Plus, List, TrendingUp } from 'lucide-react';

const navItems = [
  { href: '/donor', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/donor/new', label: 'Donate Food', icon: Plus },
  { href: '/donor/donations', label: 'My Donations', icon: List },
  { href: '/donor/analytics', label: 'My Impact', icon: TrendingUp },
];

export default function DonorAnalyticsPage() {
  const { user, loading, logout } = useAuth('donor');

  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{ background: '#050810' }}><div className="w-8 h-8 rounded-full border-2 border-green-500 border-t-transparent animate-spin" /></div>;

  return (
    <DashboardLayout navItems={navItems} user={user} onLogout={logout}>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-1">My Impact</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)' }}>Track how your donations are making a difference</p>
        </div>
        <div className="grid grid-cols-3 gap-6 mb-8">
          {[
            { emoji: '🍽️', label: 'Meals Enabled', value: '0', desc: 'Estimated from deliveries' },
            { emoji: '🏢', label: 'NGOs Helped', value: '0', desc: 'Unique NGOs served' },
            { emoji: '🌱', label: 'Waste Saved', value: '0 kg', desc: 'Food diverted from waste' },
          ].map(s => (
            <div key={s.label} className="p-6 rounded-2xl text-center" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="text-4xl mb-3">{s.emoji}</div>
              <div className="text-3xl font-black text-white mb-1">{s.value}</div>
              <div className="font-semibold text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{s.label}</div>
              <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>{s.desc}</div>
            </div>
          ))}
        </div>
        <div className="p-5 rounded-2xl text-center" style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.12)' }}>
          <p className="font-semibold text-white mb-1">📊 Detailed analytics coming soon</p>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Post your first donation to start tracking your impact</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
