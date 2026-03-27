'use client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard-layout';
import { useAuth } from '@/hooks/use-auth';
import { api } from '@/lib/api';
import { getStatusColor, formatRelative, formatNumber, getDonationTypeIcon } from '@/lib/utils';
import { LayoutDashboard, Plus, List, TrendingUp, Bell, ArrowUpRight, Package, CheckCircle2, Star, Clock } from 'lucide-react';

const navItems = [
  { href: '/donor', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/donor/new', label: 'Donate Food', icon: Plus },
  { href: '/donor/donations', label: 'My Donations', icon: List },
  { href: '/donor/analytics', label: 'My Impact', icon: TrendingUp },
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

export default function DonorDashboard() {
  const { user, loading, logout } = useAuth('donor');
  const { data: donationsData } = useQuery({
    queryKey: ['my-donations'],
    queryFn: () => api.getDonations('mine=true&limit=10'),
    enabled: !!user,
  });
  const { data: analytics } = useQuery({
    queryKey: ['donor-analytics'],
    queryFn: () => api.getDonorAnalytics(),
    enabled: !!user,
  });

  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{ background: '#050810' }}><div className="w-8 h-8 rounded-full border-2 border-green-500 border-t-transparent animate-spin" /></div>;

  const donations: any[] = donationsData?.data || donationsData || [];
  const stats = analytics || {};
  const active = donations.filter(d => ['posted', 'recommended', 'accepted', 'volunteer_assigned', 'pickup_complete'].includes(d.status));
  const delivered = donations.filter(d => d.status === 'delivered');

  return (
    <DashboardLayout navItems={navItems} user={user} onLogout={logout}>
      <div className="p-8">
        {/* Welcome Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white mb-1">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.fullName?.split(' ')[0]}! 👋
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.4)' }}>Your donations are making a real difference</p>
          </div>
          <Link href="/donor/new"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white"
            style={{ background: 'linear-gradient(135deg, #16a34a, #22c55e)', boxShadow: '0 4px 20px rgba(34,197,94,0.35)' }}>
            <Plus className="w-4 h-4" /> Donate Food
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Package} label="Total Donations" value={donations.length || stats.total || 0} color="text-green-400" />
          <StatCard icon={Clock} label="Active" value={active.length} color="text-blue-400" sub="In progress" />
          <StatCard icon={CheckCircle2} label="Delivered" value={delivered.length || stats.delivered || 0} color="text-purple-400" />
          <StatCard icon={Star} label="Impact Score" value={stats.impactScore || (delivered.length * 50)} color="text-yellow-400" sub="meals enabled" />
        </div>

        {/* Quick action */}
        {donations.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-8 rounded-2xl text-center"
            style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(34,197,94,0.02))', border: '1px solid rgba(34,197,94,0.15)' }}>
            <div className="text-5xl mb-4">🌱</div>
            <h2 className="text-xl font-bold text-white mb-2">Start Your First Donation</h2>
            <p className="mb-6" style={{ color: 'rgba(255,255,255,0.4)' }}>Connect surplus food to verified NGOs in Mumbai in minutes</p>
            <Link href="/donor/new"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #16a34a, #22c55e)', boxShadow: '0 4px 20px rgba(34,197,94,0.3)' }}>
              <Plus className="w-4 h-4" /> Post Your First Donation
            </Link>
          </motion.div>
        )}

        {/* Recent Donations */}
        {donations.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-white text-lg">Recent Donations</h2>
              <Link href="/donor/donations" className="text-sm text-green-400 hover:text-green-300">View all →</Link>
            </div>
            <div className="space-y-3">
              {donations.slice(0, 5).map((d: any, i) => (
                <motion.div key={d._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link href={`/donor/donations/${d._id}`}>
                    <div className="p-4 rounded-2xl flex items-center gap-4 cursor-pointer transition-all"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                        style={{ background: 'rgba(34,197,94,0.1)' }}>
                        {getDonationTypeIcon(d.donationType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white capitalize">{d.donationType?.replace(/_/g, ' ')} — {d.quantity} {d.quantityUnit}</div>
                        <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                          {d.donorAddress?.city || 'Mumbai'} · {formatRelative(d.createdAt)}
                        </div>
                      </div>
                      <span className={`badge ${getStatusColor(d.status)} text-xs capitalize flex-shrink-0`}>
                        {d.status?.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* NGO Directory Promo */}
        <div className="mt-8 p-5 rounded-2xl flex items-center justify-between"
          style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}>
          <div>
            <p className="font-semibold text-white mb-1">Find NGOs near you</p>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Browse 6+ verified NGOs in Mumbai ready to receive your donations</p>
          </div>
          <Link href="/ngos" className="px-4 py-2 rounded-xl text-sm font-semibold text-white flex-shrink-0 ml-4"
            style={{ background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.3)' }}>
            Browse NGOs →
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
