'use client';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard-layout';
import { useAuth } from '@/hooks/use-auth';
import { api } from '@/lib/api';
import { getStatusColor, formatRelative, getDonationTypeIcon } from '@/lib/utils';
import { LayoutDashboard, Plus, List, TrendingUp, Filter, Package } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/donor', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/donor/new', label: 'Donate Food', icon: Plus },
  { href: '/donor/donations', label: 'My Donations', icon: List },
  { href: '/donor/analytics', label: 'My Impact', icon: TrendingUp },
];

export default function DonorDonationsPage() {
  const { user, loading, logout } = useAuth('donor');
  const [statusFilter, setStatusFilter] = useState('');
  const { data, isLoading } = useQuery({
    queryKey: ['my-donations', statusFilter],
    queryFn: () => api.getDonations(statusFilter ? `mine=true&status=${statusFilter}&limit=50` : 'mine=true&limit=50'),
    enabled: !!user
  });

  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{ background: '#050810' }}><div className="w-8 h-8 rounded-full border-2 border-green-500 border-t-transparent animate-spin" /></div>;

  const donations: any[] = data?.data || data || [];
  const statuses = ['', 'posted', 'recommended', 'accepted', 'volunteer_assigned', 'pickup_complete', 'delivered', 'cancelled'];

  return (
    <DashboardLayout navItems={navItems} user={user} onLogout={logout}>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white mb-1">My Donations</h1>
            <p style={{ color: 'rgba(255,255,255,0.4)' }}>Track all your food donations</p>
          </div>
          <Link href="/donor/new" className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #16a34a, #22c55e)', boxShadow: '0 4px 15px rgba(34,197,94,0.3)' }}>
            <Plus className="w-4 h-4" /> New Donation
          </Link>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {statuses.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className="px-4 py-2 rounded-xl text-xs font-semibold transition-all capitalize"
              style={statusFilter === s
                ? { background: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.4)', color: '#4ade80' }
                : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }
              }>{s?.replace(/_/g, ' ') || 'All'}</button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="h-20 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />)}
          </div>
        ) : donations.length === 0 ? (
          <div className="text-center py-24">
            <Package className="w-14 h-14 mx-auto mb-4" style={{ color: 'rgba(255,255,255,0.15)' }} />
            <p className="text-lg font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>No donations yet</p>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.3)' }}>Start donating to track your impact</p>
            <Link href="/donor/new" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg,#16a34a,#22c55e)', boxShadow: '0 4px 15px rgba(34,197,94,0.3)' }}>
              <Plus className="w-4 h-4" /> Post First Donation
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {donations.map((d: any) => (
              <Link key={d._id} href={`/donor/donations/${d._id}`}>
                <div className="p-5 rounded-2xl flex items-center gap-4 cursor-pointer transition-all"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: 'rgba(34,197,94,0.1)' }}>
                    {getDonationTypeIcon(d.donationType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-white capitalize">{d.donationType?.replace(/_/g, ' ')} — {d.quantity} {d.quantityUnit}</div>
                    <div className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      📍 {d.donorAddress?.city} · {d.foodType} · {formatRelative(d.createdAt)}
                    </div>
                    {d.notes && <div className="text-xs mt-1 truncate italic" style={{ color: 'rgba(255,255,255,0.3)' }}>"{d.notes}"</div>}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`badge ${getStatusColor(d.status)} text-xs capitalize`}>{d.status?.replace(/_/g, ' ')}</span>
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>View →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
