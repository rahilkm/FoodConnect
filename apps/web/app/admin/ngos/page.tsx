'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/dashboard-layout';
import { useAuth } from '@/hooks/use-auth';
import { api } from '@/lib/api';
import { getStatusColor, formatRelative } from '@/lib/utils';
import { Building2, BarChart3, Package, TrendingUp, Users, CheckCircle2, X, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const navItems = [
  { href: '/admin', label: 'Overview', icon: BarChart3 },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/ngos', label: 'NGO Verification', icon: Building2 },
  { href: '/admin/donations', label: 'All Donations', icon: Package },
  { href: '/admin/hotspots', label: 'Hotspots', icon: TrendingUp },
];

export default function AdminNgosPage() {
  const { user, loading, logout } = useAuth('admin');
  const { data: ngosData, isLoading } = useQuery({ queryKey: ['ngos-admin'], queryFn: () => api.getNgos(), enabled: !!user });
  const qc = useQueryClient();

  const verifyNgo = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/ngos/${id}/verify`, { verificationStatus: status }),
    onSuccess: () => { toast.success('NGO status updated'); qc.invalidateQueries({ queryKey: ['ngos-admin'] }); },
    onError: () => toast.error('Failed to update'),
  });

  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{ background: '#050810' }}><div className="w-8 h-8 rounded-full border-2 border-green-500 border-t-transparent animate-spin" /></div>;

  const ngos = ngosData?.data || ngosData || [];

  const verified = ngos.filter((n: any) => ['verified', 'trusted'].includes(n.verificationStatus));
  const pending = ngos.filter((n: any) => ['unverified', 'pending'].includes(n.verificationStatus));
  const rejected = ngos.filter((n: any) => n.verificationStatus === 'rejected');

  const Section = ({ title, items, color }: any) => (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${color}`} /> {title} ({items.length})
      </h2>
      <div className="grid gap-4">
        {items.map((ngo: any) => (
          <div key={ngo._id} className="p-5 rounded-2xl" style={{ background: 'linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-white">{ngo.name}</h3>
                  <span className={`badge ${getStatusColor(ngo.verificationStatus)} text-xs`}>{ngo.verificationStatus}</span>
                </div>
                <p className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>{ngo.description}</p>
                <div className="flex flex-wrap gap-4 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  <span>📧 {ngo.contactEmail}</span>
                  <span>📞 {ngo.contactPhone}</span>
                  <span>🏢 {ngo.registrationNumber || 'No reg. #'}</span>
                  <span>📍 {ngo.address?.city}</span>
                  <span>🍽️ Cap: {ngo.currentAvailableCapacity}/{ngo.dailyCapacity}</span>
                  <span>⭐ Reliability: {(ngo.reliabilityScore * 100).toFixed(0)}%</span>
                </div>
              </div>
              <div className="flex gap-2 ml-4 flex-shrink-0">
                {ngo.verificationStatus !== 'trusted' && (
                  <button onClick={() => verifyNgo.mutate({ id: ngo._id, status: 'trusted' })}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                    style={{ background: 'rgba(251,191,36,0.2)', border: '1px solid rgba(251,191,36,0.3)' }}>
                    ⭐ Trust
                  </button>
                )}
                {ngo.verificationStatus !== 'verified' && (
                  <button onClick={() => verifyNgo.mutate({ id: ngo._id, status: 'verified' })}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                    style={{ background: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.3)' }}>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verify
                  </button>
                )}
                {ngo.verificationStatus !== 'rejected' && (
                  <button onClick={() => verifyNgo.mutate({ id: ngo._id, status: 'rejected' })}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                    <X className="w-3.5 h-3.5" /> Reject
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-center py-8" style={{ color: 'rgba(255,255,255,0.3)' }}>No NGOs in this category</p>}
      </div>
    </div>
  );

  return (
    <DashboardLayout navItems={navItems} user={user} onLogout={logout}>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-1">NGO Verification</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)' }}>Review and verify NGO registrations</p>
        </div>
        {isLoading ? (
          <div className="text-center py-20" style={{ color: 'rgba(255,255,255,0.3)' }}>Loading NGOs...</div>
        ) : (
          <>
            {pending.length > 0 && <Section title="⚠️ Pending Verification" items={pending} color="bg-yellow-400" />}
            <Section title="✅ Verified & Trusted" items={verified} color="bg-green-400" />
            {rejected.length > 0 && <Section title="❌ Rejected" items={rejected} color="bg-red-400" />}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
