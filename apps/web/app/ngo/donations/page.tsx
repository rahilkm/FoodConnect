'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/dashboard-layout';
import { useAuth } from '@/hooks/use-auth';
import { api } from '@/lib/api';
import { getStatusColor, formatRelative } from '@/lib/utils';
import { BarChart3, Package, MapPin, TrendingUp, Users, Filter } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const navItems = [
  { href: '/ngo', label: 'Dashboard', icon: BarChart3 },
  { href: '/ngo/donations', label: 'Donations', icon: Package },
  { href: '/ngo/hotspots', label: 'Hotspots', icon: MapPin },
  { href: '/ngo/volunteers', label: 'Volunteers', icon: Users },
  { href: '/ngo/analytics', label: 'Analytics', icon: TrendingUp },
];

export default function NgoDonationsPage() {
  const { user, loading, logout } = useAuth('ngo_manager');
  const [statusFilter, setStatusFilter] = useState('');
  const qc = useQueryClient();

  const { data: ngoData } = useQuery({ queryKey: ['my-ngo'], queryFn: () => api.getMyNgo(), enabled: !!user });
  const { data } = useQuery({
    queryKey: ['ngo-donations', statusFilter],
    queryFn: () => api.getDonations(statusFilter ? `status=${statusFilter}&limit=50` : 'limit=50'),
    enabled: !!user
  });

  const acceptDonation = useMutation({
    mutationFn: ({ donationId, ngoId }: any) => api.acceptDonation(donationId, ngoId),
    onSuccess: () => { toast.success('Accepted!'); qc.invalidateQueries({ queryKey: ['ngo-donations'] }); },
    onError: () => toast.error('Failed'),
  });

  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{ background: '#050810' }}><div className="w-8 h-8 rounded-full border-2 border-green-500 border-t-transparent animate-spin" /></div>;

  const ngo = ngoData?.data || ngoData;
  const donations: any[] = data?.data || [];
  const statuses = ['', 'posted', 'recommended', 'accepted', 'volunteer_assigned', 'pickup_complete', 'delivered'];

  return (
    <DashboardLayout navItems={navItems} user={user} onLogout={logout} accentColor="from-blue-500 to-blue-700">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-1">Donation Management</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)' }}>All donations assigned to your NGO</p>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {statuses.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className="px-4 py-2 rounded-xl text-xs font-semibold transition-all capitalize"
              style={statusFilter === s
                ? { background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.4)', color: '#60a5fa' }
                : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }
              }>
              {s?.replace(/_/g, ' ') || 'All'}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {donations.map((d: any) => (
            <div key={d._id} className="p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-bold text-white capitalize">{d.donationType?.replace(/_/g, ' ')}</span>
                    <span style={{ color: 'rgba(255,255,255,0.4)' }}>— {d.quantity} {d.quantityUnit}</span>
                    <span className={`badge ${getStatusColor(d.status)} text-xs capitalize`}>{d.status?.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    📍 {d.donorAddress?.city} · {d.foodType} · {formatRelative(d.createdAt)}
                  </div>
                  {d.notes && <div className="text-sm mt-1 italic" style={{ color: 'rgba(255,255,255,0.3)' }}>"{d.notes}"</div>}
                </div>
                {(d.status === 'posted' || d.status === 'recommended') && (
                  <button onClick={() => acceptDonation.mutate({ donationId: d._id, ngoId: ngo?._id })}
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-white flex-shrink-0"
                    style={{ background: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.3)' }}>
                    Accept
                  </button>
                )}
              </div>
            </div>
          ))}
          {donations.length === 0 && (
            <div className="text-center py-20" style={{ color: 'rgba(255,255,255,0.3)' }}>
              <Package className="w-12 h-12 mx-auto mb-4 opacity-30" />
              No donations found
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
