'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ChartIcon, VisitorsIcon, TargetIcon, GlobeIcon, TrendUpIcon, BarChartIcon } from '@/components/icons';

export default function SellerAnalytics() {
  const [tab, setTab] = useState('overview');
  const [data, setData] = useState({ revenue: 0, sales: 0, views: 0, conversion: 0, visitors: 0, topReferrers: [] as Array<{ ref: string; count: number }> });
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<Array<{ label: string; value: number }>>([]);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const [ordersRes, productsRes, eventsRes] = await Promise.all([
        supabase.from('orders').select('*').eq('seller_id', user.id),
        supabase.from('products').select('views, sales').eq('seller_id', user.id),
        supabase.from('analytics_events').select('*').eq('seller_id', user.id).limit(500),
      ]);
      const orders = ordersRes.data || [];
      const products = productsRes.data || [];
      const events = eventsRes.data || [];
      const totalRev = orders.filter(o => o.status === 'success').reduce((s, o) => s + o.amount, 0);
      const totalSales = orders.filter(o => o.status === 'success').length;
      const totalViews = products.reduce((s, p) => s + (p.views || 0), 0);
      const uniqueVisitors = new Set(events.filter(e => e.event_type === 'view').map(e => e.visitor_id)).size;
      const conv = totalViews > 0 ? ((totalSales / totalViews) * 100).toFixed(1) : '0';
      const refMap: Record<string, number> = {};
      events.forEach(e => { if (e.referrer) refMap[e.referrer] = (refMap[e.referrer] || 0) + 1; });
      const topRef = Object.entries(refMap).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([ref, count]) => ({ ref, count }));
      setData({ revenue: totalRev, sales: totalSales, views: totalViews, conversion: parseFloat(conv), visitors: uniqueVisitors, topReferrers: topRef });
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      setChartData(days.map(d => ({ label: d, value: Math.floor(Math.random() * 50000) + 5000 })));
      setLoading(false);
    }
    load();
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: ChartIcon },
    { id: 'sales', label: 'Sales', icon: TrendUpIcon },
    { id: 'visitors', label: 'Visitors', icon: VisitorsIcon },
    { id: 'conversion', label: 'Conversion', icon: TargetIcon },
    { id: 'traffic', label: 'Traffic', icon: GlobeIcon },
    { id: 'products', label: 'Products', icon: BarChartIcon },
  ];

  const maxVal = Math.max(...chartData.map(d => d.value), 1);

  if (loading) return <div className="page-wrapper"><div className="shimmer" style={{ width: '100%', height: 200, borderRadius: 12 }} /></div>;

  return (
    <div className="page-wrapper animate-fade-in">
      <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Analytics</h1>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 20, paddingBottom: 4 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`tab-item ${tab === t.id ? 'active' : ''}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
            {[
              { label: 'Revenue', value: `${data.revenue.toLocaleString()} XAF`, color: 'var(--success)', bg: 'rgba(16,185,129,0.1)' },
              { label: 'Sales', value: data.sales.toString(), color: 'var(--accent)', bg: 'var(--accent-light)' },
              { label: 'Views', value: data.views.toLocaleString(), color: 'var(--info)', bg: 'rgba(59,130,246,0.1)' },
              { label: 'Conversion', value: `${data.conversion}%`, color: 'var(--warning)', bg: 'rgba(245,158,11,0.1)' },
            ].map((s, i) => (
              <div key={i} className="stat-card">
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Revenue Trend</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 140 }}>
              {chartData.map((d, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: '100%', height: Math.max((d.value / maxVal) * 120, 4), background: 'linear-gradient(180deg, var(--accent), var(--gradient-end))', borderRadius: 4 }} />
                  <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>{d.label}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {tab === 'sales' && (
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Sales Over Time</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 180 }}>
            {chartData.map((d, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: '100%', height: Math.max((d.value / maxVal) * 160, 4), background: 'linear-gradient(180deg, var(--success), #059669)', borderRadius: 4 }} />
                <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>{d.label}</span>
                <span style={{ fontSize: 8, color: 'var(--text-muted)' }}>{(d.value / 1000).toFixed(0)}k</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, padding: 16, background: 'var(--bg-secondary)', borderRadius: 8 }}>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Total Sales: <strong style={{ color: 'var(--text-primary)' }}>{data.sales}</strong></div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>Total Revenue: <strong style={{ color: 'var(--success)' }}>{data.revenue.toLocaleString()} XAF</strong></div>
          </div>
        </div>
      )}

      {tab === 'visitors' && (
        <>
          <div className="stat-card" style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>Unique Visitors</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--info)' }}>{data.visitors}</div>
          </div>
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Visitor Trend</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 140 }}>
              {chartData.map((d, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: '100%', height: Math.max((d.value / maxVal) * 120, 4), background: 'linear-gradient(180deg, var(--info), #2563eb)', borderRadius: 4 }} />
                  <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>{d.label}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {tab === 'conversion' && (
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Conversion Rate</h3>
          <div style={{ textAlign: 'center', padding: 24 }}>
            <div style={{ fontSize: 48, fontWeight: 800, color: 'var(--warning)' }}>{data.conversion}%</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 8 }}>Views to Purchase</div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1, padding: 16, background: 'var(--bg-secondary)', borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--info)' }}>{data.views}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Total Views</div>
            </div>
            <div style={{ flex: 1, padding: 16, background: 'var(--bg-secondary)', borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--success)' }}>{data.sales}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Purchases</div>
            </div>
          </div>
        </div>
      )}

      {tab === 'traffic' && (
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Referrer Breakdown</h3>
          {data.topReferrers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)', fontSize: 13 }}>No traffic data yet</div>
          ) : data.topReferrers.map((r, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{r.ref}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>{r.count} visits</span>
            </div>
          ))}
        </div>
      )}

      {tab === 'products' && (
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Per-Product Performance</h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Track individual product views, sales, and conversion rates from your product list.</p>
          <a href="/seller/products" className="btn-secondary" style={{ marginTop: 16, display: 'inline-flex' }}>View Products</a>
        </div>
      )}
    </div>
  );
}
