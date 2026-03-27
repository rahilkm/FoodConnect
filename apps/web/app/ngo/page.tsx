'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard-layout';
import { useAuth } from '@/hooks/use-auth';
import { api } from '@/lib/api';
import { getStatusColor, formatRelative, formatNumber } from '@/lib/utils';
import {
  BarChart3, Package, MapPin, TrendingUp, CheckCircle2,
  Clock, Users, ArrowUpRight, Bell, Star, ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';

const navItems = [
  { href: '/ngo', label: 'Dashboard', icon: BarChart3 },
  { href: '/ngo/donations', label: 'Donations', icon: Package },
  { href: '/ngo/hotspots', label: 'Hotspots', icon: MapPin },
  { href: '/ngo/volunteers', label: 'Volunteers', icon: Users },
  { href: '/ngo/analytics', label: 'Analytics', icon: TrendingUp },
];

function StatCard({ label, value, icon: Icon, color, sub }: any) {
  return (
    <motion.div whileHover={{ y: -3 }} className="p-5 rounded-2xl relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}>
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(34,197,94,0.3), transparent)' }} />
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <ArrowUpRight className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.2)' }} />
      </div>
      <div className="text-3xl font-black text-white mb-1">{value}</div>
      <div className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</div>
      {sub && <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>{sub}</div>}
    </motion.div>
  );
}

export default function NgoDashboard() {
  const { user, loading, logout } = useAuth('ngo_manager');
  const qc = useQueryClient();
  const { data: ngoData } = useQuery({ queryKey: ['my-ngo'], queryFn: () => api.getMyNgo(), enabled: !!user });
  const { data: donationsData } = useQuery({ queryKey: ['ngo-incoming'], queryFn: () => api.getDonations('limit=10'), enabled: !!user });

  const acceptDonation = useMutation({
    mutationFn: ({ donationId, ngoId }: { donationId: string; ngoId: string }) => api.acceptDonation(donationId, ngoId),
    onSuccess: () => { toast.success('Donation accepted!'); qc.invalidateQueries({ queryKey: ['ngo-incoming'] }); },
    onError: () => toast.error('Failed to accept'),
  });

  const rejectDonation = useMutation({
    mutationFn: ({ donationId }: { donationId: string }) => api.rejectDonation(donationId, 'Capacity full'),
    onSuccess: () => { toast.success('Donation rejected'); qc.invalidateQueries({ queryKey: ['ngo-incoming'] }); },
    onError: () => toast.error('Failed to reject'),
  });

  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{ background: '#050810' }}><div className="w-8 h-8 rounded-full border-2 border-green-500 border-t-transparent animate-spin" /></div>;

  const ngo = ngoData?.data || ngoData;
  const donations = donationsData?.data || [];
  const incoming = donations.filter((d: any) => d.status === 'posted' || d.status === 'recommended');
  const active = donations.filter((d: any) => ['accepted', 'volunteer_assigned', 'pickup_complete'].includes(d.status));

  return (
    <DashboardLayout navItems={navItems} user={user} onLogout={logout} accentColor="from-blue-500 to-blue-700">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white mb-1">
              {ngo?.name || 'NGO Dashboard'}
            </h1>
            <div className="flex items-center gap-3">
              <span className={`badge ${getStatusColor(ngo?.verificationStatus || 'unverified')}`}>
                {ngo?.verificationStatus || 'unverified'}
              </span>
              {ngo?.reliabilityScore && (
                <span className="flex items-center gap-1 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  <Star className="w-3.5 h-3.5 text-yellow-400" />
                  {(ngo.reliabilityScore * 100).toFixed(0)}% reliability
                </span>
              )}
            </div>
          </div>
          <Link href="/ngo/donations" className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)', boxShadow: '0 4px 15px rgba(59,130,246,0.35)' }}>
            <Package className="w-4 h-4" /> View All Donations
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Package} label="Incoming" value={incoming.length} color="text-yellow-400" sub="Needs action" />
          <StatCard icon={Clock} label="Active" value={active.length} color="text-blue-400" sub="In progress" />
          <StatCard icon={CheckCircle2} label="Capacity Left" value={ngo?.currentAvailableCapacity || '—'} color="text-green-400" sub={`of ${ngo?.dailyCapacity || '—'}`} />
          <StatCard icon={TrendingUp} label="Meals Served" value={formatNumber(ngo?.mealsServedCount || 0)} color="text-purple-400" />
        </div>

        {/* Incoming Donations */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-yellow-400" />
            <h2 className="font-bold text-white text-lg">Incoming Donations ({incoming.length})</h2>
          </div>
          {incoming.length === 0 ? (
            <div className="text-center py-12 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <Package className="w-10 h-10 mx-auto mb-3" style={{ color: 'rgba(255,255,255,0.2)' }} />
              <p style={{ color: 'rgba(255,255,255,0.3)' }}>No new donations right now</p>
            </div>
          ) : (
            <div className="space-y-3">
              {incoming.map((d: any) => (
                <motion.div key={d._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white capitalize">{d.donationType?.replace(/_/g, ' ')}</span>
                        <span className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>— {d.quantity} {d.quantityUnit}</span>
                        <span className="badge badge-blue text-xs capitalize">{d.foodType}</span>
                      </div>
                      <p className="text-sm mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        📍 {d.donorAddress?.street}, {d.donorAddress?.city} · {formatRelative(d.createdAt)}
                      </p>
                      {d.notes && <p className="text-sm italic" style={{ color: 'rgba(255,255,255,0.35)' }}>"{d.notes}"</p>}
                      <div className="flex items-center gap-3 mt-2 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        {d.pickupRequired && <span className="text-blue-400">🚗 Pickup required</span>}
                        {d.expiresAt && <span>⏱ Expires {formatRelative(d.expiresAt)}</span>}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => acceptDonation.mutate({ donationId: d._id, ngoId: ngo?._id || ngo?.id })}
                        className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
                        style={{ background: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.3)' }}>
                        ✅ Accept
                      </button>
                      <button
                        onClick={() => rejectDonation.mutate({ donationId: d._id })}
                        className="px-4 py-2 rounded-xl text-sm font-semibold"
                        style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                        ❌ Decline
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Active Donations */}
        {active.length > 0 && (
          <div>
            <h2 className="font-bold text-white text-lg mb-4">🚀 Active Donations ({active.length})</h2>
            <div className="space-y-3">
              {active.map((d: any) => (
                <div key={d._id} className="p-4 rounded-2xl flex items-center gap-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-white capitalize">{d.donationType?.replace(/_/g, ' ')} — {d.quantity} {d.quantityUnit}</span>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{formatRelative(d.createdAt)}</p>
                  </div>
                  <span className={`badge ${getStatusColor(d.status)} capitalize text-xs`}>{d.status?.replace(/_/g, ' ')}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
