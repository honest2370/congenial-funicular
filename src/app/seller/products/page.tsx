'use client';
import { useState, useEffect } from 'react';
import { supabase, PRODUCT_TYPES, ProductType } from '@/lib/supabase';
import { PlusIcon, SearchIcon, FilterIcon, EditIcon, TrashIcon, EyeIcon, ProductsIcon } from '@/components/icons';

export default function SellerProducts() {
  const [products, setProducts] = useState<Array<{ id: string; name: string; type: ProductType; price: number; currency: string; status: string; views: number; sales: number; image_url: string | null }>>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { data } = await supabase.from('products').select('*').eq('seller_id', user.id).order('created_at', { ascending: false });
      setProducts(data || []);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = products.filter(p => {
    if (filter !== 'all' && p.type !== filter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await supabase.from('products').delete().eq('id', id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const toggleStatus = async (id: string, status: string) => {
    const newStatus = status === 'active' ? 'paused' : 'active';
    await supabase.from('products').update({ status: newStatus }).eq('id', id);
    setProducts(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
  };

  const typeLabel = (t: string) => PRODUCT_TYPES.find(pt => pt.value === t)?.label || t;

  if (loading) return <div className="page-wrapper"><div className="shimmer" style={{ width: '100%', height: 200, borderRadius: 12 }} /></div>;

  return (
    <div className="page-wrapper animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>Products</h1>
        <a href="/seller/products/new" className="btn-primary" style={{ padding: '8px 16px', fontSize: 13 }}>
          <PlusIcon className="w-4 h-4" /> New
        </a>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 12 }}>
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><SearchIcon className="w-4 h-4" /></span>
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="input-field" style={{ paddingLeft: 40 }} />
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 16, paddingBottom: 4 }}>
        <button onClick={() => setFilter('all')} className={`tab-item ${filter === 'all' ? 'active' : ''}`}>All</button>
        {PRODUCT_TYPES.slice(0, 8).map(t => (
          <button key={t.value} onClick={() => setFilter(t.value)} className={`tab-item ${filter === t.value ? 'active' : ''}`}>{t.label}</button>
        ))}
      </div>

      {/* Products List */}
      {filtered.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <span style={{ color: 'var(--text-muted)', display: 'block', margin: '0 auto 12px' }}><ProductsIcon className="w-12 h-12" /></span>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>No products yet</p>
          <a href="/seller/products/new" className="btn-primary" style={{ display: 'inline-flex' }}>Create your first product</a>
        </div>
      ) : filtered.map((p) => (
        <div key={p.id} className="card" style={{ padding: 16, marginBottom: 10, display: 'flex', gap: 12 }}>
          <div style={{ width: 56, height: 56, borderRadius: 10, background: 'var(--bg-secondary)', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {p.image_url ? <img src={p.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ color: 'var(--text-muted)' }}><ProductsIcon className="w-6 h-6" /></span>}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 8 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{typeLabel(p.type)}</div>
              </div>
              <span className={`badge ${p.status === 'active' ? 'badge-success' : p.status === 'paused' ? 'badge-warning' : 'badge-info'}`}>{p.status}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
              <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--text-muted)' }}>
                <span>{p.price} {p.currency}</span>
                <span><EyeIcon className="w-3 h-3" /> {p.views}</span>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <button onClick={() => toggleStatus(p.id, p.status)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, borderRadius: 6 }} title={p.status === 'active' ? 'Pause' : 'Activate'}>
                  <EyeIcon className="w-4 h-4" />
                </button>
                <a href={`/seller/products/${p.id}/edit`} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, borderRadius: 6, display: 'flex' }} title="Edit">
                  <EditIcon className="w-4 h-4" />
                </a>
                <button onClick={() => deleteProduct(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', padding: 4, borderRadius: 6 }} title="Delete">
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
