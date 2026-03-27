'use client';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/dashboard-layout';
import { useAuth } from '@/hooks/use-auth';
import { api } from '@/lib/api';
import { getStatusColor, formatRelative } from '@/lib/utils';
import { Building2, BarChart3, Package, TrendingUp, Users, Filter } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

const navItems = [
  { href: '/admin', label: 'Overview', icon: BarChart3 },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/ngos', label: 'NGO Verification', icon: Building2 },
  { href: '/admin/donations', label: 'All Donations', icon: Package },
  { href: '/admin/hotspots', label: 'Hotspots', icon: TrendingUp },
];

export default function AdminDonationsPage() {
  const { user, loading, logout } = useAuth('admin');
  const [status, setStatus] = useState('');
  const { data } = useQuery({
    queryKey: ['admin-donations', status],
    queryFn: () => api.getDonations(status ? `status=${status}&limit=50` : 'limit=50'),
    enabled: !!user
  });

  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{ background: '#050810' }}><div className="w-8 h-8 rounded-full border-2 border-green-500 border-t-transparent animate-spin" /></div>;

  const donations: any[] = data?.data || [];
  const statuses = ['', 'posted', 'accepted', 'volunteer_assigned', 'pickup_complete', 'delivered', 'cancelled', 'expired'];

  return (
    <DashboardLayout navItems={navItems} user={user} onLogout={logout}>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-1">All Donations</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)' }}>Platform-wide donation activity</p>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {statuses.map(s => (
            <button key={s} onClick={() => setStatus(s)}
              className="px-4 py-2 rounded-xl text-xs font-semibold transition-all"
              style={status === s
                ? { background: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.4)', color: '#4ade80' }
                : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }
              }>
              {s || 'All'}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="space-y-3">
          {donations.map((d: any) => (
            <div key={d._id} className="p-4 rounded-2xl flex items-center gap-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(34,197,94,0.1)' }}>
                <Package className="w-5 h-5 text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white capitalize">{d.donationType?.replace(/_/g, ' ')} — {d.quantity} {d.quantityUnit}</div>
                <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  {d.donorAddress?.city} · {d.foodType} · {formatRelative(d.createdAt)}
                </div>
              </div>
              <span className={`badge ${getStatusColor(d.status)} text-xs capitalize flex-shrink-0`}>{d.status?.replace(/_/g, ' ')}</span>
            </div>
          ))}
          {donations.length === 0 && (
            <div className="text-center py-20" style={{ color: 'rgba(255,255,255,0.3)' }}>No donations found</div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
