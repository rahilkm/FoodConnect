import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';
import { Providers } from '@/components/providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-geist-sans' });

export const metadata: Metadata = {
  title: 'FoodConnect — Zero Hunger Platform',
  description: 'Connecting food donors to verified NGOs with real-time volunteer coordination and hotspot-based distribution across Mumbai.',
  keywords: ['food donation', 'NGO', 'zero hunger', 'volunteer', 'food waste'],
  authors: [{ name: 'FoodConnect' }],
  openGraph: {
    title: 'FoodConnect — Zero Hunger Platform',
    description: 'Connect your surplus food to people who need it most.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans bg-surface-900 text-white antialiased`}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'rgba(10,15,30,0.95)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(16px)',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
