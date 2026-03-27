'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { api, setTokens } from '@/lib/api';
import { UtensilsCrossed, Eye, EyeOff, LogIn } from 'lucide-react';
import { toast } from 'sonner';

const DEMO_ACCOUNTS = [
  { role: 'Admin', email: 'admin@foodconnect.local', color: '#a855f7' },
  { role: 'Donor', email: 'donor1@foodconnect.local', color: '#22c55e' },
  { role: 'NGO Manager', email: 'ngo1@foodconnect.local', color: '#3b82f6' },
  { role: 'Volunteer', email: 'volunteer1@foodconnect.local', color: '#f59e0b' },
];

const ROLE_ROUTES: Record<string, string> = {
  admin: '/admin', donor: '/donor', ngo_manager: '/ngo', volunteer: '/volunteer'
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Please enter email and password'); return; }
    setLoading(true);
    try {
      const data = await api.login(email, password);
      setTokens(data.accessToken, data.refreshToken);
      toast.success(`Welcome back, ${data.user?.fullName?.split(' ')[0] || 'there'}!`);
      router.push(ROLE_ROUTES[data.user?.role] || '/donor');
    } catch (e: any) {
      toast.error(e.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Password123!');
    setLoading(true);
    try {
      const data = await api.login(demoEmail, 'Password123!');
      setTokens(data.accessToken, data.refreshToken);
      toast.success(`Logged in as ${data.user?.fullName}!`);
      router.push(ROLE_ROUTES[data.user?.role] || '/donor');
    } catch (e: any) {
      toast.error(e.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#050810' }}>
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full blur-3xl" style={{ background: 'rgba(34,197,94,0.05)' }} />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full blur-3xl" style={{ background: 'rgba(59,130,246,0.04)' }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #16a34a, #22c55e)', boxShadow: '0 4px 20px rgba(34,197,94,0.35)' }}>
              <UtensilsCrossed className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black" style={{ background: 'linear-gradient(135deg, #22c55e, #4ade80)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>FoodConnect</span>
          </Link>
          <h1 className="text-3xl font-black text-white">Welcome back</h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Sign in to continue making an impact</p>
        </motion.div>

        {/* Form card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="p-8 rounded-3xl mb-6"
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)' }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.7)' }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" required autoComplete="email"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.9)' }}
                onFocus={e => e.target.style.border = '1px solid rgba(34,197,94,0.4)'}
                onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.1)'} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.7)' }}>Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" required autoComplete="current-password"
                  className="w-full px-4 py-3 pr-11 rounded-xl text-sm outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.9)' }}
                  onFocus={e => e.target.style.border = '1px solid rgba(34,197,94,0.4)'}
                  onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.1)'} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white transition-all mt-2"
              style={{ background: loading ? 'rgba(34,197,94,0.5)' : 'linear-gradient(135deg, #16a34a, #22c55e)', boxShadow: loading ? 'none' : '0 4px 20px rgba(34,197,94,0.35)', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <LogIn className="w-4 h-4" />}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-sm mt-4" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Don't have an account? <Link href="/register" className="font-semibold" style={{ color: '#4ade80' }}>Create one free</Link>
          </p>
        </motion.div>

        {/* Demo Accounts */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="p-5 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.3)' }}>Quick Demo Access · password: Password123!</p>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_ACCOUNTS.map(d => (
              <button key={d.role} onClick={() => quickLogin(d.email)} disabled={loading}
                className="p-3 rounded-xl text-left transition-all"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                onMouseEnter={e => { e.currentTarget.style.background = `${d.color}15`; e.currentTarget.style.borderColor = `${d.color}40`; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}>
                <div className="text-xs font-bold" style={{ color: d.color }}>{d.role}</div>
                <div className="text-xs mt-0.5 truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>{d.email}</div>
              </button>
            ))}
          </div>
        </motion.div>

        <p className="text-center text-sm mt-6" style={{ color: 'rgba(255,255,255,0.25)' }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.3)' }}>← Back to home</Link>
        </p>
      </div>
    </div>
  );
}
