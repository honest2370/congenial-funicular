'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { BookIcon, PlayIcon, KeyIcon, ShieldIcon, DownloadIcon, EyeIcon, ProductsIcon, LinkIcon } from '@/components/icons';

export default function BuyerDashboard() {
  const [tab, setTab] = useState('all');
  const [products, setProducts] = useState<Array<{ id: string; name: string; type: string; price: number; currency: string; delivery_data: Record<string, unknown>; product_id: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [buyerEmail, setBuyerEmail] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const email = localStorage.getItem('buyer_email') || '';
    setBuyerEmail(email);
    async function load() {
      if (!email) { setLoading(false); return; }
      const { data: accessData } = await supabase.from('product_access').select('*, products(*)').eq('buyer_email', email);
      if (accessData) {
        setProducts(accessData.map((a: Record<string, unknown>) => ({
          id: a.id as string,
          name: (a.products as Record<string, unknown>)?.name as string || 'Product',
          type: (a.products as Record<string, unknown>)?.type as string || 'other',
          price: (a.products as Record<string, unknown>)?.price as number || 0,
          currency: (a.products as Record<string, unknown>)?.currency as string || 'XAF',
          delivery_data: ((a.products as Record<string, unknown>)?.delivery_data || {}) as Record<string, unknown>,
          product_id: a.product_id as string,
        })));
      }
      setLoading(false);
    }
    load();
  }, []);

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'ebook', label: 'Ebooks', icon: BookIcon },
    { id: 'video_course', label: 'Courses', icon: PlayIcon },
    { id: 'account_proxy', label: 'Proxies', icon: ShieldIcon },
    { id: 'account_generic', label: 'Accounts', icon: KeyIcon },
    { id: 'software_license', label: 'Software', icon: KeyIcon },
  ];

  const filtered = tab === 'all' ? products : products.filter(p => p.type === tab);

  const typeIcon = (type: string) => {
    switch (type) {
      case 'ebook': return <BookIcon className="w-5 h-5" />;
      case 'video_course': case 'text_course': return <PlayIcon className="w-5 h-5" />;
      case 'account_proxy': return <ShieldIcon className="w-5 h-5" />;
      case 'account_generic': return <KeyIcon className="w-5 h-5" />;
      case 'software_license': return <KeyIcon className="w-5 h-5" />;
      case 'custom_link': return <LinkIcon className="w-5 h-5" />;
      default: return <ProductsIcon className="w-5 h-5" />;
    }
  };

  const accessProduct = (product: typeof products[0]) => {
    const dd = product.delivery_data;
    if (product.type === 'video_course' && dd.chapters) {
      const firstVideo = (dd.chapters as Array<Record<string, unknown>>)?.[0]?.modules && ((dd.chapters as Array<Record<string, unknown>>)[0].modules as Array<Record<string, unknown>>)[0]?.videoUrl;
      if (firstVideo) { setPreviewUrl(firstVideo as string); return; }
    }
    if (product.type === 'custom_link' && dd.url) { window.open(dd.url as string, '_blank'); return; }
    if (product.type === 'ebook' && dd.fileUrl) { window.open(dd.fileUrl as string, '_blank'); return; }
    if (product.type === 'software_license' && dd.downloadUrl) { window.open(dd.downloadUrl as string, '_blank'); return; }
    // Show delivery data in a modal/alert for other types
    alert(JSON.stringify(dd, null, 2));
  };

  // Video preview
  if (previewUrl) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid var(--border)' }}>
          <button onClick={() => setPreviewUrl(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 14 }}>Back</button>
        </div>
        <div style={{ width: '100%', maxWidth: '100%' }}>
          {previewUrl.includes('youtube.com') || previewUrl.includes('youtu.be') ? (
            <iframe src={previewUrl.replace('watch?v=', 'embed/')} style={{ width: '100%', height: '56.25vw', maxHeight: '60vh', border: 'none' }} allowFullScreen />
          ) : previewUrl.includes('vimeo.com') ? (
            <iframe src={previewUrl.replace('vimeo.com', 'player.vimeo.com/video')} style={{ width: '100%', height: '56.25vw', maxHeight: '60vh', border: 'none' }} allowFullScreen />
          ) : (
            <video src={previewUrl} controls style={{ width: '100%', maxHeight: '60vh' }} />
          )}
        </div>
      </div>
    );
  }

  if (!buyerEmail) {
    return (
      <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>Sign in to access your purchases</p>
        <a href="/buyer-auth" className="btn-primary" style={{ textDecoration: 'none' }}>Access Library</a>
      </div>
    );
  }

  return (
    <div className="page-wrapper animate-fade-in">
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>My Library</h1>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>{buyerEmail}</p>
      </div>

      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 16, paddingBottom: 4 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`tab-item ${tab === t.id ? 'active' : ''}`}>{t.label}</button>
        ))}
      </div>

      {loading ? (
        <div className="shimmer" style={{ width: '100%', height: 200, borderRadius: 12 }} />
      ) : filtered.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <span style={{ color: 'var(--text-muted)' }}><ProductsIcon className="w-12 h-12" /></span>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 12 }}>No products yet</p>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Your purchased products will appear here</p>
        </div>
      ) : filtered.map(p => (
        <div key={p.id} className="card" style={{ padding: 16, marginBottom: 10, cursor: 'pointer' }} onClick={() => accessProduct(p)}>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 10, background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: 'var(--accent)' }}>{typeIcon(p.type)}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2, textTransform: 'capitalize' }}>{p.type.replace('_', ' ')}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {(p.type === 'video_course' || p.type === 'ebook' || p.type === 'custom_link' || p.type === 'software_license') && (
                <span style={{ color: 'var(--accent)' }}><PlayIcon className="w-5 h-5" /></span>
              )}
              {p.type === 'account_proxy' && <span style={{ color: 'var(--success)' }}><EyeIcon className="w-5 h-5" /></span>}
            </div>
          </div>
          {/* Show delivery info for accounts */}
          {(p.type === 'account_proxy' || p.type === 'account_generic') && p.delivery_data && (
            <div style={{ marginTop: 10, padding: 10, background: 'var(--bg-secondary)', borderRadius: 8, fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {p.type === 'account_proxy' && (
                <>
                  {p.delivery_data.protocol && <div>Protocol: {String(p.delivery_data.protocol)}</div>}
                  {p.delivery_data.server && <div>Server: {String(p.delivery_data.server)}:{String(p.delivery_data.port)}</div>}
                  {p.delivery_data.username && <div>Username: {String(p.delivery_data.username)}</div>}
                  {p.delivery_data.password && <div>Password: {String(p.delivery_data.password)}</div>}
                </>
              )}
              {p.type === 'account_generic' && Array.isArray(p.delivery_data.slots) && (() => {
                const slots = p.delivery_data.slots as Array<Record<string, string>>;
                return slots.map((s, i) => <div key={i}>{String(s.label)}: {String(s.value)}</div>);
              })()}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
