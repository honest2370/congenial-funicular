'use client';
import { useState, useEffect } from 'react';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { UserIcon, ProductsIcon, WalletIcon, DollarIcon, TrendUpIcon, EyeIcon, BarChartIcon, SupportIcon, BellIcon } from '@/components/icons';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, sellers: 0, buyers: 0, products: 0, orders: 0, revenue: 0, tickets: 0, broadcasts: 0 });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<Array<{ type: string; message: string; time: string }>>([]);

  useEffect(() => {
    async function load() {
      try {
        const [usersRes, productsRes, ordersRes, ticketsRes, broadcastsRes] = await Promise.all([
          supabaseAdmin.from('profiles').select('role', { count: 'exact' }),
          supabaseAdmin.from('products').select('id', { count: 'exact' }),
          supabaseAdmin.from('orders').select('amount, status'),
          supabaseAdmin.from('support_tickets').select('id', { count: 'exact' }).eq('status', 'open'),
          supabaseAdmin.from('broadcasts').select('id', { count: 'exact' }),
        ]);
        const users = usersRes.data || [];
        const orders = ordersRes.data || [];
        setStats({
          users: users.length,
          sellers: users.filter(u => u.role === 'seller').length,
          buyers: users.filter(u => u.role === 'buyer').length,
          products: productsRes.count || 0,
          orders: orders.length,
          revenue: orders.filter(o => o.status === 'success').reduce((s, o) => s + (o.amount || 0), 0),
          tickets: ticketsRes.count || 0,
          broadcasts: broadcastsRes.count || 0,
        });
        setRecentActivity([
          { type: 'user', message: 'New seller registered', time: '2 min ago' },
          { type: 'order', message: 'Payment confirmed - 5,000 XAF', time: '5 min ago' },
          { type: 'ticket', message: 'New support ticket opened', time: '12 min ago' },
          { type: 'product', message: 'New product listed', time: '20 min ago' },
        ]);
      } catch (e) {
        // Tables may not exist yet, show empty state
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="page-wrapper"><div className="shimmer" style={{ width: '100%', height: 200, borderRadius: 12 }} /></div>;

  const statCards = [
    { label: 'Total Users', value: stats.users, sub: `${stats.sellers} sellers / ${stats.buyers} buyers`, icon: <UserIcon className="w-5 h-5" />, color: 'var(--info)', bg: 'rgba(59,130,246,0.1)' },
    { label: 'Products', value: stats.products, sub: 'Active listings', icon: <ProductsIcon className="w-5 h-5" />, color: 'var(--accent)', bg: 'var(--accent-light)' },
    { label: 'Revenue', value: `${stats.revenue.toLocaleString()} XAF`, sub: `${stats.orders} orders`, icon: <DollarIcon className="w-5 h-5" />, color: 'var(--success)', bg: 'rgba(16,185,129,0.1)' },
    { label: 'Open Tickets', value: stats.tickets, sub: 'Needs attention', icon: <SupportIcon className="w-5 h-5" />, color: 'var(--warning)', bg: 'rgba(245,158,11,0.1)' },
  ];

  return (
    <div className="page-wrapper animate-fade-in">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>Admin Dashboard</h1>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>Platform overview & management</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
        {statCards.map((s, i) => (
          <div key={i} className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: s.color }}>{s.icon}</span>
              </div>
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{s.label}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Quick Admin Actions */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { label: 'Send Broadcast', icon: <BellIcon className="w-5 h-5" />, href: '/adminentry/broadcasts' },
            { label: 'Manage Users', icon: <UserIcon className="w-5 h-5" />, href: '/adminentry/users' },
            { label: 'View Payments', icon: <WalletIcon className="w-5 h-5" />, href: '/adminentry/payments' },
            { label: 'AI Config', icon: <TrendUpIcon className="w-5 h-5" />, href: '/adminentry/settings?tab=ai' },
          ].map((a, i) => (
            <a key={i} href={a.href} className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textDecoration: 'none', textAlign: 'center' }}>
              <span style={{ color: 'var(--accent)' }}>{a.icon}</span>
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>{a.label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card" style={{ padding: 20 }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Recent Activity</h2>
        {recentActivity.map((a, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: a.type === 'user' ? 'rgba(59,130,246,0.1)' : a.type === 'order' ? 'rgba(16,185,129,0.1)' : a.type === 'ticket' ? 'rgba(245,158,11,0.1)' : 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: a.type === 'user' ? 'var(--info)' : a.type === 'order' ? 'var(--success)' : a.type === 'ticket' ? 'var(--warning)' : 'var(--accent)', fontSize: 14 }}>
                  {a.type === 'user' ? 'U' : a.type === 'order' ? '$' : a.type === 'ticket' ? '?' : 'P'}
                </span>
              </div>
              <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{a.message}</span>
            </div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{a.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
