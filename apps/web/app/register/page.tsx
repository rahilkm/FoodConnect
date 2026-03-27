'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  UtensilsCrossed, Mail, Lock, Eye, EyeOff, User,
  ArrowRight, Loader2, Building2, Bike, ChevronRight,
} from 'lucide-react';
import { api, setTokens } from '@/lib/api';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const ROLES = [
  { value: 'donor', label: 'Donor', desc: 'I want to donate food', icon: User },
  { value: 'ngo_manager', label: 'NGO Manager', desc: 'I represent an NGO', icon: Building2 },
  { value: 'volunteer', label: 'Volunteer', desc: 'I want to help deliver', icon: Bike },
];

const schema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters').regex(/[A-Z]/, 'Must have uppercase').regex(/[0-9]/, 'Must have a number'),
  role: z.enum(['donor', 'ngo_manager', 'volunteer']),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'donor' | 'ngo_manager' | 'volunteer'>('donor');

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'donor' },
  });

  const selectRole = (role: 'donor' | 'ngo_manager' | 'volunteer') => {
    setSelectedRole(role);
    setValue('role', role);
  };

  async function onSubmit(data: FormData) {
    try {
      const res = await api.register(data);
      setTokens(res.accessToken, res.refreshToken);
      toast.success('Account created! Welcome to FoodConnect 🎉');
      const redirectMap: Record<string, string> = {
        donor: '/donor',
        ngo_manager: '/ngo',
        volunteer: '/volunteer',
      };
      router.push(redirectMap[data.role] || '/');
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
    }
  }

  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center p-4 py-16 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-hero-gradient opacity-50" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-card p-8"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 mb-4 glow-green">
              <UtensilsCrossed className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Create account</h1>
            <p className="text-white/50 text-sm">Join FoodConnect and start making an impact</p>
          </div>

          {/* Role selector */}
          <div className="mb-6">
            <p className="text-sm font-medium text-white/70 mb-3">I am a…</p>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => selectRole(r.value as any)}
                  className={cn(
                    'p-3 rounded-xl border text-left transition-all duration-200',
                    selectedRole === r.value
                      ? 'border-brand-500/40 bg-brand-500/10 text-brand-400'
                      : 'border-white/8 bg-white/3 text-white/50 hover:border-white/15'
                  )}
                >
                  <r.icon className="w-4 h-4 mb-1" />
                  <div className="text-xs font-semibold">{r.label}</div>
                  <div className="text-xs opacity-60 leading-tight mt-0.5">{r.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" {...register('role')} />

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input {...register('fullName')} type="text" placeholder="Your name" className={cn('input-glass pl-10', errors.fullName && 'border-red-500/40')} />
              </div>
              {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input {...register('email')} type="email" placeholder="you@example.com" className={cn('input-glass pl-10', errors.email && 'border-red-500/40')} />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 8 chars, 1 uppercase, 1 number"
                  className={cn('input-glass pl-10 pr-10', errors.password && 'border-red-500/40')}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3.5 justify-center mt-2">
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Creating account…</>
              ) : (
                <>Create Free Account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-white/40">
              Already have an account?{' '}
              <Link href="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>

        <p className="text-center mt-6 text-sm text-white/30">
          <Link href="/" className="hover:text-white/50 transition-colors">← Back to home</Link>
        </p>
      </div>
    </div>
  );
}
