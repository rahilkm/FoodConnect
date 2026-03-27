'use client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { api } from '@/lib/api';
import { getStatusColor } from '@/lib/utils';
import { Building2, MapPin, Star, Zap, ChevronRight, Search, UtensilsCrossed } from 'lucide-react';
import { useState } from 'react';

export default function NgosPage() {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useQuery({ queryKey: ['public-ngos'], queryFn: () => api.getNgos() });

  const ngos: any[] = (data?.data || data || []).filter((n: any) =>
    !search || n.name?.toLowerCase().includes(search.toLowerCase()) || n.address?.city?.toLowerCase().includes(search.toLowerCase())
  );

  const verifiedNgos = ngos.filter(n => ['verified', 'trusted'].includes(n.verificationStatus));
  const trustColors: Record<string, string> = { trusted: '#fbbf24', verified: '#22c55e', unverified: 'rgba(255,255,255,0.3)', rejected: '#ef4444' };

  return (
    <div className="min-h-screen" style={{ background: '#050810' }}>
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 w-[600px] h-[400px] -translate-x-1/2 rounded-full blur-3xl" style={{ background: 'rgba(34,197,94,0.04)' }} />
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between" style={{ background: 'rgba(5,8,16,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #16a34a, #22c55e)' }}>
            <UtensilsCrossed className="w-4 h-4 text-white" />
          </div>
          <span className="font-black" style={{ background: 'linear-gradient(135deg, #22c55e, #4ade80)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>FoodConnect</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/login" className="px-4 py-2 rounded-xl text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>Sign In</Link>
          <Link href="/register" className="px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #16a34a, #22c55e)' }}>Join Free</Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black text-white mb-4">
            Find NGOs Near You
          </motion.h1>
          <p className="text-lg mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {verifiedNgos.length} verified NGOs ready to receive your donations across Mumbai
          </p>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'rgba(255,255,255,0.3)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or area..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.9)' }} />
          </div>
        </div>

        {/* Stats banner */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { value: verifiedNgos.length, label: 'Verified Partners' },
            { value: '75K+', label: 'Meals Delivered' },
            { value: '10+', label: 'Active Hotspots' },
          ].map(s => (
            <div key={s.label} className="text-center p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="text-2xl font-black text-white">{s.value}</div>
              <div className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* NGO Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="h-48 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />)}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ngos.map((ngo: any, i) => (
              <motion.div key={ngo._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="p-6 rounded-2xl cursor-pointer"
                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}>
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${trustColors[ngo.verificationStatus]}40, transparent)` }} />
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.15)' }}>
                    🏢
                  </div>
                  <span className={`badge ${getStatusColor(ngo.verificationStatus)} text-xs`}>{ngo.verificationStatus}</span>
                </div>
                <h3 className="font-bold text-white mb-1">{ngo.name}</h3>
                <p className="text-sm mb-4 line-clamp-2" style={{ color: 'rgba(255,255,255,0.4)' }}>{ngo.description}</p>
                {/* Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    <MapPin className="w-3.5 h-3.5" /> {ngo.address?.city}, {ngo.address?.state}
                  </div>
                  <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    <Star className="w-3.5 h-3.5 text-yellow-400" /> {(ngo.reliabilityScore * 100).toFixed(0)}% reliability · {ngo.mealsServedCount?.toLocaleString()} meals served
                  </div>
                  <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    <Zap className="w-3.5 h-3.5 text-blue-400" /> Avg response: {ngo.averageResponseMinutes}min
                  </div>
                </div>
                {/* Capacity bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    <span>Capacity available</span>
                    <span>{ngo.currentAvailableCapacity}/{ngo.dailyCapacity}</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <div className="h-full rounded-full" style={{ width: `${Math.min((ngo.currentAvailableCapacity / ngo.dailyCapacity) * 100, 100)}%`, background: 'linear-gradient(135deg, #22c55e, #4ade80)' }} />
                  </div>
                </div>
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(ngo.acceptedDonationTypes || []).slice(0, 3).map((t: string) => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>
                      {t.replace(/_/g, ' ')}
                    </span>
                  ))}
                  {(ngo.acceptedDonationTypes?.length || 0) > 3 && (
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.35)' }}>
                      +{ngo.acceptedDonationTypes.length - 3} more
                    </span>
                  )}
                  {ngo.coldStorage && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa' }}>❄️ Cold storage</span>}
                  {ngo.pickupSupported && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(34,197,94,0.1)', color: '#4ade80' }}>🚗 Pickup</span>}
                </div>
                <Link href="/login"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                  style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(34,197,94,0.2)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(34,197,94,0.1)'; }}>
                  Donate to this NGO <ChevronRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {ngos.length === 0 && !isLoading && (
          <div className="text-center py-20">
            <Building2 className="w-16 h-16 mx-auto mb-4" style={{ color: 'rgba(255,255,255,0.1)' }} />
            <p className="text-lg font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>No NGOs found</p>
            <p style={{ color: 'rgba(255,255,255,0.25)' }}>Try a different search term</p>
          </div>
        )}
      </div>
    </div>
  );
}
