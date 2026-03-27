'use client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard-layout';
import { useAuth } from '@/hooks/use-auth';
import { api } from '@/lib/api';
import { getStatusColor, formatRelative } from '@/lib/utils';
import { LayoutDashboard, MapPin, Package, Route, Clock, CheckCircle2, ArrowUpRight } from 'lucide-react';

const navItems = [
  { href: '/volunteer', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/volunteer/routes', label: 'My Routes', icon: Route },
  { href: '/volunteer/pickups', label: 'Pickups', icon: Package },
];

export default function VolunteerDashboard() {
  const { user, loading, logout } = useAuth('volunteer');
  const { data: routesData } = useQuery({ queryKey: ['my-routes'], queryFn: () => api.getVolunteerRoutes(), enabled: !!user });
  const { data: volData } = useQuery({ queryKey: ['my-volunteer'], queryFn: () => api.getMyVolunteer(), enabled: !!user });

  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{ background: '#050810' }}><div className="w-8 h-8 rounded-full border-2 border-green-500 border-t-transparent animate-spin" /></div>;

  const routes: any[] = routesData?.data || routesData || [];
  const vol = volData?.data || volData;
  const activeRoutes = routes.filter((r: any) => r.status === 'active' || r.status === 'in_progress');
  const completedRoutes = routes.filter((r: any) => r.status === 'completed');

  return (
    <DashboardLayout navItems={navItems} user={user} onLogout={logout} accentColor="from-orange-500 to-orange-600">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-1">Volunteer Dashboard</h1>
          <div className="flex items-center gap-3 mt-1">
            <span className={`badge ${getStatusColor(vol?.availabilityStatus || 'available')}`}>
              {vol?.availabilityStatus || 'available'}
            </span>
            {vol?.vehicleType && <span className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>🚗 {vol.vehicleType}</span>}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Active Routes', value: activeRoutes.length, icon: Route, color: 'text-orange-400' },
            { label: 'Completed', value: completedRoutes.length, icon: CheckCircle2, color: 'text-green-400' },
            { label: 'Total Routes', value: routes.length, icon: MapPin, color: 'text-blue-400' },
          ].map(s => (
            <motion.div key={s.label} whileHover={{ y: -3 }} className="p-5 rounded-2xl relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.3), transparent)' }} />
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div className="text-3xl font-black text-white">{s.value}</div>
              <div className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Active Routes */}
        <h2 className="font-bold text-white text-lg mb-4">
          {activeRoutes.length > 0 ? `🚛 Active Routes (${activeRoutes.length})` : 'No active routes'}
        </h2>
        {routes.length === 0 ? (
          <div className="text-center py-16 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <Route className="w-12 h-12 mx-auto mb-4" style={{ color: 'rgba(255,255,255,0.15)' }} />
            <p className="font-semibold text-lg mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>No routes assigned yet</p>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.25)' }}>When an NGO accepts a donation and assigns you, your route will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {routes.map((route: any) => (
              <div key={route._id} className="p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-bold text-white">{route.name || `Route #${route._id?.slice(-6)}`}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                      {formatRelative(route.createdAt)} · {route.stops?.length || 0} stops
                    </div>
                  </div>
                  <span className={`badge ${getStatusColor(route.status)} text-xs capitalize`}>{route.status}</span>
                </div>
                {route.stops?.map((stop: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 mt-2">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                      style={{ background: stop.completed ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: stop.completed ? '#4ade80' : 'rgba(255,255,255,0.5)' }}>
                      {stop.completed ? '✓' : i + 1}
                    </div>
                    <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{stop.address?.street || `Stop ${i + 1}`}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
