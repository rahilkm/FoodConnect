'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { api, clearTokens } from '@/lib/api';

export function useAuth(requiredRole?: string) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('fc_access_token');
    if (!token) {
      router.replace('/login');
      return;
    }
    api.me()
      .then((u) => {
        setUser(u);
        if (requiredRole && u.role !== requiredRole) {
          const map: Record<string, string> = {
            donor: '/donor', ngo_manager: '/ngo',
            volunteer: '/volunteer', admin: '/admin',
          };
          router.replace(map[u.role] || '/login');
        }
      })
      .catch(() => {
        clearTokens();
        router.replace('/login');
      })
      .finally(() => setLoading(false));
  }, []);

  const logout = async () => {
    await api.logout().catch(() => {});
    clearTokens();
    router.push('/login');
  };

  return { user, loading, logout };
}
