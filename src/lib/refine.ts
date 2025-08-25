import { DataProvider, LiveProvider, NotificationProvider } from '@refinedev/core';
import { toast } from '@/components/ui/use-toast';

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'https://web-production-47673.up.railway.app';

async function http(path: string, init?: RequestInit) {
  const url = `${API_BASE.replace(/\/$/, '')}${path.startsWith('/') ? '' : '/'}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export const dataProvider: DataProvider = {
  getList: async ({ resource, pagination }) => {
    const page = pagination?.current || 1;
    const perPage = pagination?.pageSize || 50;
    const data = await http(`/api/${resource}`);
    const arr = Array.isArray(data) ? data : (data?.[resource] || []);
    return { data: arr, total: arr.length, pageSize: perPage, current: page };
  },
  getOne: async ({ resource, id }) => {
    const data = await http(`/api/${resource}/${id}`);
    return { data } as any;
  },
  create: async ({ resource, variables }) => {
    const data = await http(`/api/${resource}`, { method: 'POST', body: JSON.stringify(variables) });
    return { data } as any;
  },
  update: async ({ resource, id, variables }) => {
    const data = await http(`/api/${resource}/${id}`, { method: 'PUT', body: JSON.stringify(variables) });
    return { data } as any;
  },
  deleteOne: async ({ resource, id }) => {
    const data = await http(`/api/${resource}/${id}`, { method: 'DELETE' });
    return { data } as any;
  },
  getApiUrl: () => API_BASE,
} as unknown as DataProvider;

export const liveProvider: LiveProvider = {
  subscribe: ({ channel, types, callback }) => {
    const interval = setInterval(async () => {
      try {
        const data = await http(channel.startsWith('/api') ? channel : `/api/${channel}`);
        callback?.({ type: 'updated', payload: data });
      } catch (_) {}
    }, 5000);
    return { unsubscribe: () => clearInterval(interval) };
  },
  publish: () => undefined,
};

export const notificationProvider: NotificationProvider = {
  open: ({ message, description, type }) => {
    toast({ title: message, description, variant: type === 'error' ? 'destructive' : undefined });
  },
  close: () => undefined,
};


