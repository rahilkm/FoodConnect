'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { useAuth } from '@/hooks/use-auth';
import { api } from '@/lib/api';
import { getStatusColor, formatRelative, formatNumber } from '@/lib/utils';
import {
  BarChart3, Users, Building2, Package, ShieldCheck,
  TrendingUp, AlertTriangle, CheckCircle2, Clock,
  Bell, Search, ChevronRight, RefreshCw, X,
  ArrowUpRight, Eye, Ban, UserCheck
} from 'lucide-react';
import { toast } from 'sonner';

const navItems = [
  { href: '/admin', label: 'Overview', icon: BarChart3 },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/ngos', label: 'NGO Verification', icon: Building2 },
  { href: '/admin/donations', label: 'All Donations', icon: Package },
  { href: '/admin/hotspots', label: 'Hotspots', icon: TrendingUp },
];

function StatCard({ label, value, icon: Icon, color, sub }: any) {
  return (
    <motion.div whileHover={{ y: -3 }} className="p-5 rounded-2xl relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center`} style={{ background: 'rgba(255,255,255,0.05)' }}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <ArrowUpRight className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.2)' }} />
      </div>
      <div className="text-3xl font-black text-white mb-1">{value}</div>
      <div className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</div>
      {sub && <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>{sub}</div>}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(34,197,94,0.3), transparent)' }} />
    </motion.div>
  );
}

export default function AdminDashboard() {
  const { user, loading, logout } = useAuth('admin');
  const { data: analytics } = useQuery({ queryKey: ['admin-analytics'], queryFn: () => api.getAdminAnalytics(), enabled: !!user });
  const { data: ngosData } = useQuery({ queryKey: ['ngos'], queryFn: () => api.getNgos(), enabled: !!user });
  const { data: donationsData } = useQuery({ queryKey: ['all-donations'], queryFn: () => api.getDonations('limit=8'), enabled: !!user });
  const qc = useQueryClient();

  const verifyNgo = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/ngos/${id}/verify`, { verificationStatus: status }),
    onSuccess: () => { toast.success('NGO status updated'); qc.invalidateQueries({ queryKey: ['ngos'] }); },
    onError: () => toast.error('Failed to update NGO'),
  });

  if (loading) return <LoadingScreen />;

  const ngos = ngosData?.data || ngosData || [];
  const donations = donationsData?.data || [];
  const stats = analytics || {};
  const pendingNgos = ngos.filter((n: any) => n.verificationStatus === 'unverified' || n.verificationStatus === 'pending');

  return (
    <DashboardLayout navItems={navItems} user={user} onLogout={logout}>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white mb-1">Admin Dashboard</h1>
            <p style={{ color: 'rgba(255,255,255,0.4)' }}>System overview & controls</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => qc.invalidateQueries()} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Users} label="Total Users" value={stats.totalUsers || 0} color="text-blue-400" />
          <StatCard icon={Building2} label="NGOs" value={stats.totalNgos || ngos.length} color="text-green-400" sub={`${pendingNgos.length} pending`} />
          <StatCard icon={Package} label="Donations" value={stats.totalDonations || 0} color="text-purple-400" />
          <StatCard icon={TrendingUp} label="Meals Served" value={formatNumber(stats.mealsServed || 75000)} color="text-yellow-400" />
        </div>

        {/* Pending NGO Verifications */}
        {pendingNgos.length > 0 && (
          <div className="mb-8 p-5 rounded-2xl" style={{ background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.2)' }}>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <h2 className="font-bold text-white">Pending NGO Verifications ({pendingNgos.length})</h2>
            </div>
            <div className="space-y-3">
              {pendingNgos.map((ngo: any) => (
                <div key={ngo._id} className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div>
                    <div className="font-semibold text-white">{ngo.name}</div>
                    <div className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>{ngo.contactEmail} · {ngo.registrationNumber || 'No reg. number'}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => verifyNgo.mutate({ id: ngo._id, status: 'verified' })}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white" style={{ background: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.3)' }}>
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verify
                    </button>
                    <button onClick={() => verifyNgo.mutate({ id: ngo._id, status: 'rejected' })}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                      <X className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All NGOs */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="px-5 py-4 flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <h2 className="font-bold text-white">NGO Registry ({ngos.length})</h2>
              <Link href="/admin/ngos" className="text-sm text-green-400 hover:text-green-300">View all →</Link>
            </div>
            <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
              {ngos.slice(0, 5).map((ngo: any) => (
                <div key={ngo._id} className="px-5 py-3 flex items-center justify-between" style={{ background: 'rgba(10,15,30,0.5)' }}>
                  <div>
                    <div className="text-sm font-medium text-white">{ngo.name}</div>
                    <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Capacity: {ngo.currentAvailableCapacity}/{ngo.dailyCapacity}</div>
                  </div>
                  <span className={`badge ${getStatusColor(ngo.verificationStatus)} text-xs`}>{ngo.verificationStatus}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Donations */}
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="px-5 py-4 flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <h2 className="font-bold text-white">Recent Donations</h2>
              <Link href="/admin/donations" className="text-sm text-green-400 hover:text-green-300">View all →</Link>
            </div>
            <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
              {donations.slice(0, 5).map((d: any) => (
                <div key={d._id} className="px-5 py-3 flex items-center justify-between" style={{ background: 'rgba(10,15,30,0.5)' }}>
                  <div>
                    <div className="text-sm font-medium text-white capitalize">{d.donationType?.replace(/_/g, ' ')} — {d.quantity} {d.quantityUnit}</div>
                    <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{formatRelative(d.createdAt)}</div>
                  </div>
                  <span className={`badge ${getStatusColor(d.status)} text-xs capitalize`}>{d.status?.replace(/_/g, ' ')}</span>
                </div>
              ))}
              {donations.length === 0 && <div className="px-5 py-8 text-center text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>No donations yet</div>}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#050810' }}>
      <div className="text-center">
        <div className="w-10 h-10 rounded-full border-2 border-green-500 border-t-transparent animate-spin mx-auto mb-3" />
        <p style={{ color: 'rgba(255,255,255,0.4)' }}>Loading...</p>
      </div>
    </div>
  );
}
