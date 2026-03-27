'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '@/components/dashboard-layout';
import { useAuth } from '@/hooks/use-auth';
import { api } from '@/lib/api';
import { LayoutDashboard, Plus, List, TrendingUp, ChevronRight, ChevronLeft, Package, MapPin, Clock, Info } from 'lucide-react';
import { toast } from 'sonner';

const navItems = [
  { href: '/donor', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/donor/new', label: 'Donate Food', icon: Plus },
  { href: '/donor/donations', label: 'My Donations', icon: List },
  { href: '/donor/analytics', label: 'My Impact', icon: TrendingUp },
];

const DONATION_TYPES = [
  { value: 'cooked_meal', label: 'Cooked Meal', icon: '🍛', desc: 'Freshly prepared food' },
  { value: 'dry_food', label: 'Dry Food', icon: '🌾', desc: 'Rice, dal, flour, etc.' },
  { value: 'fresh_produce', label: 'Fresh Produce', icon: '🥬', desc: 'Vegetables & fruits' },
  { value: 'ration_kit', label: 'Ration Kit', icon: '📦', desc: 'Monthly ration package' },
  { value: 'packaged_food', label: 'Packaged Food', icon: '📪', desc: 'Sealed/manufactured food' },
  { value: 'mixed_pack', label: 'Mixed Pack', icon: '🎁', desc: 'Combination of items' },
];

const FOOD_TYPES = ['vegetarian', 'vegan', 'non-vegetarian', 'mixed'];
const UNITS = ['kg', 'litres', 'packets', 'boxes', 'servings', 'pieces'];

const initialForm = {
  donationType: '', foodType: 'vegetarian', quantity: '', quantityUnit: 'kg',
  notes: '', pickupRequired: false,
  street: '', city: 'Mumbai', pincode: '', state: 'Maharashtra',
  lat: '', lng: '', expiresInHours: '24',
};

export default function NewDonationPage() {
  const { user, loading, logout } = useAuth('donor');
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));

  const createDonation = useMutation({
    mutationFn: () => {
      const body: any = {
        donationType: form.donationType, foodType: form.foodType,
        quantity: parseFloat(form.quantity), quantityUnit: form.quantityUnit,
        notes: form.notes, pickupRequired: form.pickupRequired,
        donorAddress: { street: form.street, city: form.city, pincode: form.pincode, state: form.state },
        donorGeoPoint: form.lat && form.lng ? { type: 'Point', coordinates: [parseFloat(form.lng), parseFloat(form.lat)] } : undefined,
      };
      if (form.expiresInHours) {
        body.expiresAt = new Date(Date.now() + parseInt(form.expiresInHours) * 3600000).toISOString();
      }
      return api.createDonation(body);
    },
    onSuccess: (data: any) => {
      toast.success('Donation posted! 🎉');
      router.push(`/donor/donations/${data?._id || data?.id || ''}`);
    },
    onError: (e: any) => toast.error(e.message || 'Failed to post donation'),
  });

  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{ background: '#050810' }}><div className="w-8 h-8 rounded-full border-2 border-green-500 border-t-transparent animate-spin" /></div>;

  const steps = ['Food Type', 'Details', 'Location', 'Review'];
  const canNext = [
    !!form.donationType,
    !!form.quantity && !!form.quantityUnit,
    !!form.street && !!form.city,
    true,
  ];

  return (
    <DashboardLayout navItems={navItems} user={user} onLogout={logout}>
      <div className="p-8 max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-1">Post a Donation</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)' }}>Connect your surplusfood to verified NGOs in Mumbai</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <button onClick={() => i < step && setStep(i)}
                className="flex items-center gap-2 text-sm font-medium transition-all"
                style={{ color: i <= step ? '#4ade80' : 'rgba(255,255,255,0.3)' }}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all`}
                  style={{
                    background: i < step ? '#22c55e' : i === step ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.05)',
                    border: i <= step ? '1px solid rgba(34,197,94,0.5)' : '1px solid rgba(255,255,255,0.1)',
                    color: i <= step ? (i < step ? '#fff' : '#4ade80') : 'rgba(255,255,255,0.3)',
                  }}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className="hidden sm:block">{s}</span>
              </button>
              {i < steps.length - 1 && <div className="w-8 h-px" style={{ background: i < step ? 'rgba(34,197,94,0.5)' : 'rgba(255,255,255,0.1)' }} />}
            </div>
          ))}
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.2 }}>

            {/* Step 0: Type */}
            {step === 0 && (
              <div>
                <h2 className="font-semibold text-white mb-5">What type of food are you donating?</h2>
                <div className="grid grid-cols-2 gap-3">
                  {DONATION_TYPES.map(t => (
                    <button key={t.value} onClick={() => set('donationType', t.value)}
                      className="p-4 rounded-2xl text-left transition-all"
                      style={{
                        background: form.donationType === t.value ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.03)',
                        border: form.donationType === t.value ? '1px solid rgba(34,197,94,0.4)' : '1px solid rgba(255,255,255,0.07)',
                      }}>
                      <div className="text-2xl mb-2">{t.icon}</div>
                      <div className="font-semibold text-white text-sm">{t.label}</div>
                      <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1: Details */}
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="font-semibold text-white mb-5">Food details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.6)' }}>Quantity *</label>
                    <input type="number" value={form.quantity} onChange={e => set('quantity', e.target.value)} placeholder="e.g. 10"
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.9)' }} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.6)' }}>Unit *</label>
                    <select value={form.quantityUnit} onChange={e => set('quantityUnit', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.9)' }}>
                      {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.6)' }}>Food type</label>
                  <div className="flex gap-2">
                    {FOOD_TYPES.map(t => (
                      <button key={t} onClick={() => set('foodType', t)}
                        className="px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all"
                        style={form.foodType === t
                          ? { background: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.4)', color: '#4ade80' }
                          : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }
                        }>{t}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.6)' }}>Additional notes</label>
                  <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3}
                    placeholder="e.g. Prepared this morning, no nuts, already packed in containers..."
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.9)' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.6)' }}>Expires in</label>
                  <select value={form.expiresInHours} onChange={e => set('expiresInHours', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.9)' }}>
                    <option value="4">4 hours</option>
                    <option value="12">12 hours</option>
                    <option value="24">24 hours</option>
                    <option value="48">48 hours</option>
                    <option value="72">3 days</option>
                  </select>
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className={`w-11 h-6 rounded-full transition-colors ${form.pickupRequired ? 'bg-green-500' : 'bg-gray-700'} relative`}
                    onClick={() => set('pickupRequired', !form.pickupRequired)}>
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${form.pickupRequired ? 'left-5' : 'left-0.5'}`} />
                  </div>
                  <span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>Pickup required (NGO needs to collect)</span>
                </label>
              </div>
            )}

            {/* Step 2: Location */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="font-semibold text-white mb-5">Pickup location</h2>
                {[
                  { label: 'Street address *', key: 'street', placeholder: '123 Main St, Building Name' },
                  { label: 'City *', key: 'city', placeholder: 'Mumbai' },
                  { label: 'Pincode', key: 'pincode', placeholder: '400001' },
                  { label: 'Latitude (optional)', key: 'lat', placeholder: '19.0760' },
                  { label: 'Longitude (optional)', key: 'lng', placeholder: '72.8777' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.6)' }}>{f.label}</label>
                    <input value={(form as any)[f.key]} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.9)' }} />
                  </div>
                ))}
                <p className="text-xs flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  <Info className="w-3.5 h-3.5" /> Coordinates improve NGO matching accuracy
                </p>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div>
                <h2 className="font-semibold text-white mb-5">Review your donation</h2>
                <div className="p-5 rounded-2xl space-y-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {[
                    { label: 'Type', value: DONATION_TYPES.find(t => t.value === form.donationType)?.label + ' ' + DONATION_TYPES.find(t => t.value === form.donationType)?.icon },
                    { label: 'Quantity', value: `${form.quantity} ${form.quantityUnit}` },
                    { label: 'Food type', value: form.foodType },
                    { label: 'Location', value: `${form.street}, ${form.city}` },
                    { label: 'Expires in', value: `${form.expiresInHours} hours` },
                    { label: 'Pickup required', value: form.pickupRequired ? 'Yes' : 'No' },
                    ...(form.notes ? [{ label: 'Notes', value: form.notes }] : []),
                  ].map(r => (
                    <div key={r.label} className="flex justify-between gap-4">
                      <span className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>{r.label}</span>
                      <span className="text-sm text-white font-medium text-right">{r.value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 p-4 rounded-xl" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)' }}>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    🤖 After posting, our AI engine will match your donation with the best-suited NGOs based on proximity, capacity, and need level. You'll receive status updates as it progresses.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button onClick={() => step > 0 ? setStep(s => s - 1) : router.back()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm"
            style={{ color: 'rgba(255,255,255,0.5)' }}>
            <ChevronLeft className="w-4 h-4" /> {step > 0 ? 'Back' : 'Cancel'}
          </button>
          {step < steps.length - 1 ? (
            <button onClick={() => canNext[step] && setStep(s => s + 1)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{
                background: canNext[step] ? 'linear-gradient(135deg, #16a34a, #22c55e)' : 'rgba(255,255,255,0.05)',
                boxShadow: canNext[step] ? '0 4px 15px rgba(34,197,94,0.3)' : 'none',
                color: canNext[step] ? '#fff' : 'rgba(255,255,255,0.3)',
                cursor: canNext[step] ? 'pointer' : 'not-allowed',
              }}>
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={() => createDonation.mutate()}
              disabled={createDonation.isPending}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #16a34a, #22c55e)', boxShadow: '0 4px 15px rgba(34,197,94,0.3)', opacity: createDonation.isPending ? 0.7 : 1 }}>
              {createDonation.isPending ? 'Posting...' : '🚀 Post Donation'}
            </button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
