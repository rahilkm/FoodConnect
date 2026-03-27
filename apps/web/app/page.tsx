'use client';
import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  ChevronRight, Utensils, MapPin, Heart, Shield,
  Zap, Users, TrendingUp, Star, ArrowRight,
} from 'lucide-react';
import { PublicNav } from '@/components/nav/public-nav';

const HeroGlobe = dynamic(
  () => import('@/components/hero-globe').then((m) => m.HeroGlobe),
  { ssr: false, loading: () => <div className="w-full h-full" /> }
);

function CountUp({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end, duration]);

  return <span ref={ref}>{count.toLocaleString('en-IN')}{suffix}</span>;
}

const stats = [
  { value: 75000, suffix: '+', label: 'Meals Delivered', icon: Utensils, color: 'text-brand-400' },
  { value: 6, suffix: '', label: 'Verified NGOs', icon: Shield, color: 'text-gold-400' },
  { value: 10, suffix: '', label: 'Active Hotspots', icon: MapPin, color: 'text-blue-400' },
  { value: 98, suffix: '%', label: 'Delivery Rate', icon: TrendingUp, color: 'text-purple-400' },
];

const features = [
  {
    icon: Zap,
    title: 'Instant Matching',
    description: 'AI-powered engine matches your food with the best-fit NGO in seconds based on distance, capacity, and need.',
    gradient: 'from-brand-500/20 to-brand-700/10',
    glow: 'rgba(34,197,94,0.15)',
  },
  {
    icon: MapPin,
    title: 'Live Hotspot Network',
    description: 'Dynamic hotspot system tracks real need in real-time. When one area gets served, the network reroutes instantly.',
    gradient: 'from-blue-500/20 to-blue-700/10',
    glow: 'rgba(59,130,246,0.15)',
  },
  {
    icon: Shield,
    title: 'Verified Trust Chain',
    description: 'NGO badges, reliability scores, and proof-of-delivery create full transparency from donor to beneficiary.',
    gradient: 'from-gold-500/20 to-gold-700/10',
    glow: 'rgba(251,191,36,0.15)',
  },
  {
    icon: Heart,
    title: 'Recurring Impact',
    description: "Set up weekly or monthly food plans. Your generosity runs on autopilot while we handle the logistics.",
    gradient: 'from-purple-500/20 to-purple-700/10',
    glow: 'rgba(168,85,247,0.15)',
  },
];

const steps = [
  { number: '01', title: 'Register & Post', desc: 'Create your account and post what food you have — type, quantity, expiry time.' },
  { number: '02', title: 'Get Matched', desc: 'Our engine scores and ranks the best NGOs for your donation in under 2 seconds.' },
  { number: '03', title: 'NGO Accepts', desc: 'The NGO reviews and accepts. A volunteer gets assigned for pickup if needed.' },
  { number: '04', title: 'Track & Impact', desc: 'Follow your food from pickup to delivery. See your real-world impact report.' },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface-900 overflow-x-hidden">
      <PublicNav />

      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-hero-gradient opacity-60" />
        <div className="absolute top-1/3 left-0 w-[400px] h-[400px] rounded-full bg-glow-green opacity-20 blur-3xl" />
        <div className="absolute top-1/2 right-0 w-[300px] h-[300px] rounded-full bg-glow-gold opacity-15 blur-3xl" />
      </div>

      {/* ─── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="page-container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-5rem)]">
            {/* Left copy */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <span className="badge badge-green text-xs mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
                  Zero Hunger Mission — Mumbai
                </span>
              </motion.div>

              <h1 className="text-5xl lg:text-7xl font-black leading-[1.05] tracking-tight">
                <span className="text-white">Your food.</span>
                <br />
                <span className="gradient-text-green glow-text-green">Their hope.</span>
                <br />
                <span className="text-white/70">Connected.</span>
              </h1>

              <p className="text-lg text-white/55 max-w-lg leading-relaxed">
                FoodConnect routes surplus food from donors to verified NGOs with real-time volunteer coordination.
                Every meal tracked. Every impact visible. Zero waste, zero guesswork.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/register" className="btn-primary text-base px-8 py-4">
                  Start Donating Free
                  <ChevronRight className="w-5 h-5" />
                </Link>
                <Link href="/ngos" className="btn-ghost text-base px-8 py-4">
                  Browse NGOs
                </Link>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-9 h-9 rounded-full border-2 border-surface-900 bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center text-xs font-bold text-white">
                      {['R', 'P', 'A', 'K'][i - 1]}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-0.5">
                    {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />)}
                  </div>
                  <p className="text-sm text-white/50">Trusted by 200+ donors in Mumbai</p>
                </div>
              </div>
            </motion.div>

            {/* Right: 3D Globe */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              className="relative h-[500px] lg:h-[600px]"
            >
              <div className="absolute inset-0 bg-glow-green opacity-30 rounded-full blur-xl" />
              <HeroGlobe />

              {/* Floating stat cards */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute top-12 left-0 glass-card p-4 min-w-[140px]"
              >
                <p className="text-2xl font-bold text-brand-400">75K+</p>
                <p className="text-xs text-white/50">Meals Delivered</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="absolute bottom-20 right-0 glass-card p-4 min-w-[140px]"
              >
                <p className="text-2xl font-bold text-gold-400">6 NGOs</p>
                <p className="text-xs text-white/50">Verified Partners</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.5 }}
                className="absolute bottom-4 left-1/4 glass-card p-3"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
                  <span className="text-xs text-white/70">Live tracking active</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── STATS ────────────────────────────────────────────────────── */}
      <section className="py-20 relative">
        <div className="page-container">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {stats.map((stat) => (
              <motion.div key={stat.label} variants={item}>
                <div className="stat-card text-center group">
                  <div className="flex justify-center mb-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                  </div>
                  <p className={`text-3xl font-black mb-1 ${stat.color}`}>
                    <CountUp end={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-sm text-white/50">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── FEATURES ─────────────────────────────────────────────────── */}
      <section className="py-24 relative">
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="badge badge-green mb-4">Platform Features</span>
            <h2 className="section-title text-4xl lg:text-5xl font-black">
              Built for <span className="gradient-text-green">operational excellence</span>
            </h2>
            <p className="section-subtitle max-w-2xl mx-auto mt-4">
              Every feature designed to reduce waste, speed up delivery, and maximize trust across the supply chain.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-6"
          >
            {features.map((f) => (
              <motion.div key={f.title} variants={item}>
                <div
                  className="glass-card p-8 group cursor-default card-3d-container"
                  style={{ '--glow-color': f.glow } as React.CSSProperties}
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <f.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                  <p className="text-white/50 leading-relaxed">{f.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section className="py-24 relative">
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="badge badge-blue mb-4">Simple Process</span>
            <h2 className="section-title text-4xl font-black">
              Donate in <span className="gradient-text-multi">4 steps</span>
            </h2>
          </motion.div>

          <div className="relative">
            <div className="hidden lg:block absolute left-1/2 top-8 bottom-8 w-px bg-gradient-to-b from-brand-500/30 via-brand-500/10 to-transparent" />
            <div className="space-y-8">
              {steps.map((step, i) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`flex items-center gap-8 ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
                >
                  <div className="hidden lg:block flex-1" />
                  <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center flex-shrink-0 glow-green border border-brand-500/20">
                    <span className="font-black text-brand-400 text-sm">{step.number}</span>
                  </div>
                  <div className="flex-1 glass-card p-6">
                    <h4 className="font-bold text-white text-lg mb-2">{step.title}</h4>
                    <p className="text-white/50 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-glow-green opacity-10 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-4xl font-black text-white mb-4">
                Ready to make a <span className="gradient-text-green">difference?</span>
              </h2>
              <p className="text-white/50 mb-8 max-w-xl mx-auto">
                Join hundreds of donors across Mumbai. Post your first donation today — it takes less than 2 minutes.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/register" className="btn-primary text-base px-10 py-4">
                  Get Started Free <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/ngos" className="btn-ghost text-base px-10 py-4">
                  Explore NGOs
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="page-container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Utensils className="w-5 h-5 text-brand-400" />
            <span className="font-bold gradient-text-green">FoodConnect</span>
          </div>
          <p className="text-white/30 text-sm">© 2024 FoodConnect. Zero hunger. Zero waste.</p>
          <div className="flex gap-4">
            <Link href="/about" className="text-sm text-white/40 hover:text-white/70 transition-colors">About</Link>
            <Link href="/privacy" className="text-sm text-white/40 hover:text-white/70 transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
