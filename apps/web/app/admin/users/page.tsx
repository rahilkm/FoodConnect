'use client';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/dashboard-layout';
import { useAuth } from '@/hooks/use-auth';
import { api } from '@/lib/api';
import { getStatusColor, formatRelative } from '@/lib/utils';
import { Building2, BarChart3, Package, TrendingUp, Users, Search } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/admin', label: 'Overview', icon: BarChart3 },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/ngos', label: 'NGO Verification', icon: Building2 },
  { href: '/admin/donations', label: 'All Donations', icon: Package },
  { href: '/admin/hotspots', label: 'Hotspots', icon: TrendingUp },
];

export default function AdminUsersPage() {
  const { user, loading, logout } = useAuth('admin');
  const [search, setSearch] = useState('');
  // In a real app we'd call /admin/users, for now we'll use the mock
  const { data } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => api.get<any>('/admin/users'),
    enabled: !!user
  });

  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{ background: '#050810' }}><div className="w-8 h-8 rounded-full border-2 border-green-500 border-t-transparent animate-spin" /></div>;

  const users: any[] = data?.data || data || [];
  const filtered = users.filter((u: any) =>
    u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );
  const roleColors: Record<string, string> = {
    admin: 'badge-purple', donor: 'badge-blue', ngo_manager: 'badge-green', volunteer: 'badge-gold'
  };

  return (
    <DashboardLayout navItems={navItems} user={user} onLogout={logout}>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-1">User Management</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)' }}>All registered users on the platform</p>
        </div>

        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(255,255,255,0.3)' }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.85)' }}
          />
        </div>

        {/* Table */}
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="grid grid-cols-4 px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <span>Name</span><span>Email</span><span>Role</span><span>Status</span>
          </div>
          {filtered.length === 0 ? (
            <div className="text-center py-16" style={{ color: 'rgba(255,255,255,0.3)', background: 'rgba(10,15,30,0.5)' }}>
              {users.length === 0 ? 'No users found (API may not have /admin/users endpoint yet)' : 'No matching users'}
            </div>
          ) : (
            filtered.map((u: any, i) => (
              <div key={u._id || i} className="grid grid-cols-4 px-5 py-3.5 items-center text-sm transition-colors"
                style={{ background: i % 2 === 0 ? 'rgba(10,15,30,0.5)' : 'rgba(15,20,35,0.5)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span className="font-medium text-white">{u.fullName}</span>
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>{u.email}</span>
                <span className={`badge ${roleColors[u.role] || 'badge-gray'} w-fit capitalize`}>{u.role?.replace('_', ' ')}</span>
                <span className={`badge ${u.isActive ? 'badge-green' : 'badge-red'} w-fit`}>{u.isActive ? 'Active' : 'Inactive'}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
