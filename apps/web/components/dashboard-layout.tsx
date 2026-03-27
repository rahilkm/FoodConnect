'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { UtensilsCrossed, LogOut, ChevronRight } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  user: any;
  onLogout: () => void;
  accentColor?: string;
}

export function DashboardLayout({ children, navItems, user, onLogout, accentColor = 'from-brand-500 to-brand-700' }: DashboardLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex" style={{ background: '#050810' }}>
      {/* Sidebar */}
      <aside className="w-60 fixed top-0 left-0 bottom-0 z-40 flex flex-col border-r" style={{ background: 'rgba(10,15,30,0.98)', borderColor: 'rgba(255,255,255,0.06)' }}>
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${accentColor} flex items-center justify-center`} style={{ boxShadow: '0 4px 15px rgba(34,197,94,0.3)' }}>
            <UtensilsCrossed className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-bold text-sm" style={{ background: 'linear-gradient(135deg, #22c55e, #4ade80)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>FoodConnect</div>
            <div className="text-xs capitalize" style={{ color: 'rgba(255,255,255,0.35)' }}>{user?.role?.replace('_', ' ')}</div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}
                className={cn('flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  active ? 'text-white' : 'hover:text-white'
                )}
                style={active
                  ? { background: 'rgba(34,197,94,0.12)', color: '#4ade80', boxShadow: '0 0 0 1px rgba(34,197,94,0.2)' }
                  : { color: 'rgba(255,255,255,0.5)' }
                }
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
                {active && <ChevronRight className="w-3 h-3 ml-auto opacity-60" />}
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="px-3 py-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.3), rgba(34,197,94,0.1))', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)' }}>
              {user?.fullName?.[0] || '?'}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate" style={{ color: 'rgba(255,255,255,0.85)' }}>{user?.fullName || '...'}</div>
              <div className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>{user?.email}</div>
            </div>
          </div>
          <button onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-200"
            style={{ color: 'rgba(255,255,255,0.4)' }}
            onMouseEnter={e => { (e.currentTarget as any).style.color = '#f87171'; (e.currentTarget as any).style.background = 'rgba(239,68,68,0.08)'; }}
            onMouseLeave={e => { (e.currentTarget as any).style.color = 'rgba(255,255,255,0.4)'; (e.currentTarget as any).style.background = 'transparent'; }}
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-60 min-h-screen">
        {children}
      </main>
    </div>
  );
}
