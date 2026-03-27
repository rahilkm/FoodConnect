'use client';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/dashboard-layout';
import { useAuth } from '@/hooks/use-auth';
import { api } from '@/lib/api';
import { getStatusColor, formatRelative, formatDate, getDonationTypeIcon } from '@/lib/utils';
import { LayoutDashboard, Plus, List, TrendingUp, ChevronLeft, MapPin, Star, Zap, Shield, Clock } from 'lucide-react';

const navItems = [
  { href: '/donor', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/donor/new', label: 'Donate Food', icon: Plus },
  { href: '/donor/donations', label: 'My Donations', icon: List },
  { href: '/donor/analytics', label: 'My Impact', icon: TrendingUp },
];

const TAG_ICONS: Record<string, string> = {
  best_match: '🏆', fastest_pickup: '⚡', trusted_partner: '🛡️', underserved: '🌱', backup_option: '🔄'
};

export default function DonationDetailPage() {
  const { user, loading, logout } = useAuth('donor');
  const { id } = useParams<{ id: string }>();

  const { data: donation } = useQuery({ queryKey: ['donation', id], queryFn: () => api.getDonation(id), enabled: !!user && !!id });
  const { data: matches } = useQuery({ queryKey: ['matches', id], queryFn: () => api.getRecommendations(id), enabled: !!user && !!id && donation?.status === 'posted' });

  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{ background: '#050810' }}><div className="w-8 h-8 rounded-full border-2 border-green-500 border-t-transparent animate-spin" /></div>;
  if (!donation && !loading) return (
    <DashboardLayout navItems={navItems} user={user} onLogout={logout}>
      <div className="p-8 text-center">
        <p className="text-2xl mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>Donation not found</p>
        <Link href="/donor/donations" className="text-green-400">← Back to donations</Link>
      </div>
    </DashboardLayout>
  );

  const statusSteps = ['posted', 'recommended', 'accepted', 'volunteer_assigned', 'pickup_complete', 'delivered'];
  const currentIdx = statusSteps.indexOf(donation?.status);
  const recommendations: any[] = Array.isArray(matches) ? matches : matches?.data || [];

  return (
    <DashboardLayout navItems={navItems} user={user} onLogout={logout}>
      <div className="p-8">
        <div className="mb-6">
          <Link href="/donor/donations" className="flex items-center gap-2 text-sm mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>
            <ChevronLeft className="w-4 h-4" /> Back to donations
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-4xl">{getDonationTypeIcon(donation?.donationType)}</div>
            <div>
              <h1 className="text-3xl font-black text-white capitalize">{donation?.donationType?.replace(/_/g, ' ')} — {donation?.quantity} {donation?.quantityUnit}</h1>
              <div className="flex items-center gap-3 mt-1">
                <span className={`badge ${donation ? getStatusColor(donation.status) : ''} capitalize`}>{donation?.status?.replace(/_/g, ' ')}</span>
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>{formatDate(donation?.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Timeline */}
        {!['cancelled', 'expired'].includes(donation?.status) && (
          <div className="mb-8 p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <h2 className="font-semibold text-white mb-5">Donation Progress</h2>
            <div className="flex items-center">
              {statusSteps.map((s, i) => (
                <div key={s} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all`}
                      style={{
                        background: i <= currentIdx ? '#22c55e' : 'rgba(255,255,255,0.06)',
                        border: i <= currentIdx ? 'none' : '1px solid rgba(255,255,255,0.1)',
                        color: i <= currentIdx ? '#fff' : 'rgba(255,255,255,0.3)',
                      }}>
                      {i < currentIdx ? '✓' : i + 1}
                    </div>
                    <span className="text-xs mt-1.5 text-center capitalize hidden sm:block" style={{ color: i <= currentIdx ? '#4ade80' : 'rgba(255,255,255,0.3)', maxWidth: 70 }}>
                      {s.replace(/_/g, ' ')}
                    </span>
                  </div>
                  {i < statusSteps.length - 1 && (
                    <div className="flex-1 h-0.5 mx-2 mb-6" style={{ background: i < currentIdx ? '#22c55e' : 'rgba(255,255,255,0.08)' }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Donation details */}
          <div className="p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <h2 className="font-semibold text-white mb-4">Details</h2>
            <dl className="space-y-3">
              {[
                { label: 'Food type', value: donation?.foodType },
                { label: 'Location', value: `${donation?.donorAddress?.street}, ${donation?.donorAddress?.city}` },
                { label: 'Pickup required', value: donation?.pickupRequired ? 'Yes' : 'No' },
                { label: 'Expires', value: donation?.expiresAt ? formatDate(donation.expiresAt) : 'No expiry set' },
                ...(donation?.notes ? [{ label: 'Notes', value: donation.notes }] : []),
              ].map(r => (
                <div key={r.label} className="flex gap-4 justify-between">
                  <dt className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>{r.label}</dt>
                  <dd className="text-sm text-right text-white font-medium max-w-xs">{r.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* AI Recommendations */}
          <div>
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" /> AI-Matched NGOs
            </h2>
            {recommendations.length === 0 ? (
              <div className="text-center py-10 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                {donation?.status === 'posted'
                  ? <p style={{ color: 'rgba(255,255,255,0.3)' }}>Matching engine is finding the best NGOs...</p>
                  : <p style={{ color: 'rgba(255,255,255,0.3)' }}>NGO already matched for this donation</p>
                }
              </div>
            ) : (
              <div className="space-y-3">
                {recommendations.map((rec: any, i: number) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                    className="p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${i === 0 ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.07)'}` }}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{TAG_ICONS[rec.tag] || '🏢'}</span>
                          <span className="font-semibold text-white">{(rec.ngo as any)?.name}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-bold" style={{ color: '#4ade80' }}>{rec.score.toFixed(0)}% match</span>
                          {rec.distanceKm && <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>· 📍 {rec.distanceKm.toFixed(1)}km away</span>}
                        </div>
                      </div>
                    </div>
                    {rec.reasons?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {rec.reasons.slice(0, 3).map((r: string) => (
                          <span key={r} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(34,197,94,0.1)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)' }}>✓ {r}</span>
                        ))}
                      </div>
                    )}
                    {rec.warnings?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {rec.warnings.slice(0, 2).map((w: string) => (
                          <span key={w} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(251,191,36,0.08)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.2)' }}>⚠ {w}</span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
