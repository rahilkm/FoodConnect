'use client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { useAuth } from '@/hooks/use-auth';
import { BarChart3, Package, MapPin, TrendingUp, Users } from 'lucide-react';

const navItems = [
  { href: '/ngo', label: 'Dashboard', icon: BarChart3 },
  { href: '/ngo/donations', label: 'Donations', icon: Package },
  { href: '/ngo/hotspots', label: 'Hotspots', icon: MapPin },
  { href: '/ngo/volunteers', label: 'Volunteers', icon: Users },
  { href: '/ngo/analytics', label: 'Analytics', icon: TrendingUp },
];

export default function NgoAnalyticsPage() {
  const { user, loading, logout } = useAuth('ngo_manager');

  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{ background: '#050810' }}><div className="w-8 h-8 rounded-full border-2 border-green-500 border-t-transparent animate-spin" /></div>;

  return (
    <DashboardLayout navItems={navItems} user={user} onLogout={logout} accentColor="from-blue-500 to-blue-700">
      <div className="p-8">
        <h1 className="text-3xl font-black text-white mb-1">Analytics</h1>
        <p className="mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>NGO performance metrics and impact reports</p>
        <div className="text-center py-24" style={{ color: 'rgba(255,255,255,0.3)' }}>
          <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-lg font-semibold mb-2 text-white opacity-50">Detailed analytics coming soon</p>
          <p className="text-sm">Accept donations to start generating reports</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
