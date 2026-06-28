'use client';
import { useState, useEffect } from 'react';
import { supabase, ASHTECHPAY_COUNTRIES } from '@/lib/supabase';
import { SalesIcon, FilterIcon, SearchIcon, EyeIcon, DollarIcon } from '@/components/icons';

export default function SellerSales() {
  const [orders, setOrders] = useState<Array<{ id: string; buyer_email: string; product_id: string; amount: number; currency: string; status: string; created_at: string; ashtechpay_txn_id: string | null }>>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { data } = await supabase.from('orders').select('*').eq('seller_id', user.id).order('created_at', { ascending: false });
      setOrders(data || []);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = orders.filter(o => {
    if (filter !== 'all' && o.status !== filter) return false;
    if (search && !o.buyer_email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalRevenue = orders.filter(o => o.status === 'success').reduce((s, o) => s + o.amount, 0);
  const pendingRevenue = orders.filter(o => o.status === 'pending').reduce((s, o) => s + o.amount, 0);

  if (loading) return <div className="page-wrapper"><div className="shimmer" style={{ width: '100%', height: 200, borderRadius: 12 }} /></div>;

  return (
    <div className="page-wrapper animate-fade-in">
      <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Sales & Orders</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div className="stat-card">
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>Confirmed Revenue</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--success)' }}>{totalRevenue.toLocaleString()} XAF</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>Pending</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--warning)' }}>{pendingRevenue.toLocaleString()} XAF</div>
        </div>
      </div>

      <div style={{ position: 'relative', marginBottom: 12 }}>
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><SearchIcon className="w-4 h-4" /></span>
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by email..." className="input-field" style={{ paddingLeft: 40 }} />
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {['all', 'success', 'pending', 'failed'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`tab-item ${filter === f ? 'active' : ''}`} style={{ textTransform: 'capitalize' }}>{f}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ padding: 32, textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>No orders found</p>
        </div>
      ) : filtered.map(o => (
        <div key={o.id} className="card" style={{ padding: 14, marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{o.buyer_email}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{new Date(o.created_at).toLocaleDateString()}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{o.amount} {o.currency}</div>
              <span className={`badge ${o.status === 'success' ? 'badge-success' : o.status === 'pending' ? 'badge-warning' : 'badge-danger'}`}>{o.status}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
