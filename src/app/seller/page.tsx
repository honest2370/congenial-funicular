'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { TrendUpIcon, VisitorsIcon, SalesIcon, EyeIcon, DollarIcon, ArrowRightIcon, ProductsIcon, ChartIcon, WalletIcon, ZapIcon } from '@/components/icons';

export default function SellerDashboard() {
  const [stats, setStats] = useState({ revenue: 0, sales: 0, views: 0, conversion: 0 });
  const [recentOrders, setRecentOrders] = useState<Array<{ id: string; buyer_email: string; amount: number; status: string; created_at: string }>>([]);
  const [topProducts, setTopProducts] = useState<Array<{ name: string; sales: number; revenue: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<Array<{ day: string; revenue: number; sales: number }>>([]);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const [ordersRes, productsRes] = await Promise.all([
        supabase.from('orders').select('*').eq('seller_id', user.id).order('created_at', { ascending: false }).limit(50),
        supabase.from('products').select('*').eq('seller_id', user.id),
      ]);

      const orders = ordersRes.data || [];
      const products = productsRes.data || [];

      const totalRevenue = orders.filter(o => o.status === 'success').reduce((s, o) => s + o.amount, 0);
      const totalSales = orders.filter(o => o.status === 'success').length;
      const totalViews = products.reduce((s, p) => s + (p.views || 0), 0);
      const conv = totalViews > 0 ? ((totalSales / totalViews) * 100).toFixed(1) : '0';

      setStats({ revenue: totalRevenue, sales: totalSales, views: totalViews, conversion: parseFloat(conv) });
      setRecentOrders(orders.slice(0, 5));

      const prodMap: Record<string, { name: string; sales: number; revenue: number }> = {};
      orders.filter(o => o.status === 'success').forEach(o => {
        const p = products.find(pr => pr.id === o.product_id);
        if (p) {
          if (!prodMap[p.id]) prodMap[p.id] = { name: p.name, sales: 0, revenue: 0 };
          prodMap[p.id].sales++;
          prodMap[p.id].revenue += o.amount;
        }
      });
      setTopProducts(Object.values(prodMap).sort((a, b) => b.revenue - a.revenue).slice(0, 5));

      // Generate chart data for last 7 days
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const dayData = days.map((day, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        const dayOrders = orders.filter(o => {
          const d = new Date(o.created_at);
          return d.toDateString() === date.toDateString() && o.status === 'success';
        });
        return { day, revenue: dayOrders.reduce((s, o) => s + o.amount, 0), sales: dayOrders.length };
      });
      setChartData(dayData);
      setLoading(false);
    }
    load();
  }, []);

  const maxRevenue = Math.max(...chartData.map(d => d.revenue), 1);

  if (loading) return <div className="page-wrapper"><div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="shimmer" style={{ width: '100%', height: 200, borderRadius: 12 }} /></div></div>;

  const statCards = [
    { label: 'Revenue', value: `${stats.revenue.toLocaleString()} XAF`, icon: <DollarIcon className="w-5 h-5" />, color: 'var(--success)', bg: 'rgba(16,185,129,0.1)' },
    { label: 'Sales', value: stats.sales.toString(), icon: <SalesIcon className="w-5 h-5" />, color: 'var(--accent)', bg: 'var(--accent-light)' },
    { label: 'Views', value: stats.views.toLocaleString(), icon: <EyeIcon className="w-5 h-5" />, color: 'var(--info)', bg: 'rgba(59,130,246,0.1)' },
    { label: 'Conversion', value: `${stats.conversion}%`, icon: <TrendUpIcon className="w-5 h-5" />, color: 'var(--warning)', bg: 'rgba(245,158,11,0.1)' },
  ];

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Greeting */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>Dashboard</h1>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>Your store at a glance</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
        {statCards.map((s, i) => (
          <div key={i} className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: s.color }}>{s.icon}</span>
              </div>
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="card" style={{ padding: 20, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Revenue Overview</h2>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Last 7 days</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 140 }}>
          {chartData.map((d, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ width: '100%', height: Math.max((d.revenue / maxRevenue) * 120, 4), background: 'linear-gradient(180deg, var(--accent), var(--gradient-end))', borderRadius: 4, transition: 'height 0.5s ease' }} />
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            { label: 'New Product', icon: <ProductsIcon className="w-5 h-5" />, href: '/seller/products/new' },
            { label: 'View Sales', icon: <WalletIcon className="w-5 h-5" />, href: '/seller/sales' },
            { label: 'AI Tools', icon: <ZapIcon className="w-5 h-5" />, href: '/seller/ai-tools' },
          ].map((a, i) => (
            <a key={i} href={a.href} className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textDecoration: 'none', textAlign: 'center' }}>
              <span style={{ color: 'var(--accent)' }}>{a.icon}</span>
              <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)' }}>{a.label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card" style={{ padding: 20, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Recent Orders</h2>
          <a href="/seller/sales" style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>View all <ArrowRightIcon className="w-3 h-3" /></a>
        </div>
        {recentOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)', fontSize: 13 }}>No orders yet</div>
        ) : recentOrders.map((o) => (
          <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{o.buyer_email}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{new Date(o.created_at).toLocaleDateString()}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{o.amount} XAF</div>
              <span className={`badge ${o.status === 'success' ? 'badge-success' : o.status === 'pending' ? 'badge-warning' : 'badge-danger'}`}>{o.status}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Top Products */}
      <div className="card" style={{ padding: 20 }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Top Products</h2>
        {topProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)', fontSize: 13 }}>No product data yet</div>
        ) : topProducts.map((p, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{p.name}</div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>{p.sales} sales</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.revenue} XAF</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
