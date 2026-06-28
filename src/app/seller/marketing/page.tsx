'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { AffiliateIcon, TagIcon, MailIcon, ShareIcon, SearchIcon, ZapIcon, TrendUpIcon, TargetIcon, CopyIcon, PlusIcon, LinkIcon } from '@/components/icons';

export default function SellerMarketing() {
  const [tab, setTab] = useState('affiliate');
  const [affiliateLinks, setAffiliateLinks] = useState<Array<{ id: string; code: string; product_id: string; clicks: number; earnings: number }>>([]);
  const [coupons, setCoupons] = useState<Array<{ id: string; code: string; value: string; status: string }>>([]);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponValue, setNewCouponValue] = useState('');
  const [newAffCode, setNewAffCode] = useState('');
  const [newAffProduct, setNewAffProduct] = useState('');
  const [products, setProducts] = useState<Array<{ id: string; name: string }>>([]);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDesc, setSeoDesc] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const [affRes, prodRes] = await Promise.all([
        supabase.from('affiliate_links').select('*').eq('seller_id', user.id),
        supabase.from('products').select('id, name').eq('seller_id', user.id),
      ]);
      setAffiliateLinks(affRes.data || []);
      setProducts(prodRes.data || []);
    }
    load();
  }, []);

  const createAffiliateLink = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !newAffCode || !newAffProduct) return;
    const { data } = await supabase.from('affiliate_links').insert({ seller_id: user.id, product_id: newAffProduct, code: newAffCode }).select();
    if (data) { setAffiliateLinks([...affiliateLinks, ...data]); setNewAffCode(''); setNewAffProduct(''); }
  };

  const createCoupon = async () => {
    if (!newCouponCode || !newCouponValue) return;
    setCoupons([...coupons, { id: Date.now().toString(), code: newCouponCode, value: newCouponValue, status: 'active' }]);
    setNewCouponCode('');
    setNewCouponValue('');
  };

  const tabs = [
    { id: 'affiliate', label: 'Affiliate', icon: AffiliateIcon },
    { id: 'coupons', label: 'Coupons', icon: TagIcon },
    { id: 'email', label: 'Email', icon: MailIcon },
    { id: 'social', label: 'Social', icon: ShareIcon },
    { id: 'seo', label: 'SEO', icon: SearchIcon },
    { id: 'referral', label: 'Referral', icon: ShareIcon },
    { id: 'pricing', label: 'Pricing', icon: TrendUpIcon },
    { id: 'cart', label: 'Cart Recovery', icon: TargetIcon },
  ];

  const copyToClipboard = (text: string) => { navigator.clipboard.writeText(text); };

  return (
    <div className="page-wrapper animate-fade-in">
      <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Marketing Hub</h1>

      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 20, paddingBottom: 4 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`tab-item ${tab === t.id ? 'active' : ''}`}>{t.label}</button>
        ))}
      </div>

      {tab === 'affiliate' && (
        <>
          <div className="card" style={{ padding: 16, marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Create Affiliate Link</h3>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <select value={newAffProduct} onChange={(e) => setNewAffProduct(e.target.value)} className="select-field" style={{ flex: 1 }}>
                <option value="">Select product</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input type="text" value={newAffCode} onChange={(e) => setNewAffCode(e.target.value)} className="input-field" placeholder="Affiliate code" style={{ flex: 1 }} />
              <button onClick={createAffiliateLink} className="btn-primary" style={{ padding: '10px 16px' }}><PlusIcon className="w-4 h-4" /></button>
            </div>
          </div>
          {affiliateLinks.map(l => (
            <div key={l.id} className="card" style={{ padding: 16, marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{l.code}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{l.clicks} clicks</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--success)' }}>{l.earnings} XAF</span>
                  <button onClick={() => copyToClipboard(`${window.location.origin}/p/${l.code}`)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><CopyIcon className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </>
      )}

      {tab === 'coupons' && (
        <>
          <div className="card" style={{ padding: 16, marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Create Coupon</h3>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input type="text" value={newCouponCode} onChange={(e) => setNewCouponCode(e.target.value)} className="input-field" placeholder="Code (e.g. SAVE20)" style={{ flex: 1 }} />
              <input type="text" value={newCouponValue} onChange={(e) => setNewCouponValue(e.target.value)} className="input-field" placeholder="Value (e.g. 20%)" style={{ flex: 1 }} />
            </div>
            <button onClick={createCoupon} className="btn-primary" style={{ width: '100%' }}>Create Coupon</button>
          </div>
          {coupons.map(c => (
            <div key={c.id} className="card" style={{ padding: 16, marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)', letterSpacing: 1 }}>{c.code}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{c.value}</div>
                </div>
                <span className={`badge ${c.status === 'active' ? 'badge-success' : 'badge-danger'}`}>{c.status}</span>
              </div>
            </div>
          ))}
        </>
      )}

      {tab === 'email' && (
        <div className="card" style={{ padding: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Email Campaign</h3>
          <div style={{ marginBottom: 12 }}><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Subject</label><input type="text" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} className="input-field" placeholder="Campaign subject" /></div>
          <div style={{ marginBottom: 12 }}><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Body</label><textarea value={emailBody} onChange={(e) => setEmailBody(e.target.value)} className="input-field" placeholder="Write your email content..." style={{ minHeight: 150 }} /></div>
          <button className="btn-primary" style={{ width: '100%' }}>Send Campaign</button>
        </div>
      )}

      {tab === 'social' && (
        <div className="card" style={{ padding: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Social Sharing</h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>Share your products on social media to increase visibility.</p>
          {products.slice(0, 5).map(p => (
            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{p.name}</span>
              <button onClick={() => copyToClipboard(`${window.location.origin}/p/${p.id}`)} className="btn-ghost" style={{ fontSize: 12 }}><ShareIcon className="w-4 h-4" /> Share</button>
            </div>
          ))}
        </div>
      )}

      {tab === 'seo' && (
        <div className="card" style={{ padding: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>SEO Settings</h3>
          <div style={{ marginBottom: 12 }}><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Meta Title</label><input type="text" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className="input-field" placeholder="Store meta title" /></div>
          <div style={{ marginBottom: 12 }}><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Meta Description</label><textarea value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} className="input-field" placeholder="Store description for search engines" style={{ minHeight: 80 }} /></div>
          <div style={{ marginBottom: 12 }}><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Keywords</label><input type="text" value={seoKeywords} onChange={(e) => setSeoKeywords(e.target.value)} className="input-field" placeholder="digital products, ebooks, courses..." /></div>
          <button className="btn-primary" style={{ width: '100%' }}>Save SEO Settings</button>
        </div>
      )}

      {tab === 'referral' && (
        <div className="card" style={{ padding: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Referral Program</h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>Create a referral program to reward customers who bring new buyers.</p>
          <div style={{ marginBottom: 12 }}><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Referral Reward (%)</label><input type="number" className="input-field" placeholder="10" defaultValue={10} /></div>
          <div style={{ marginBottom: 12 }}><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Minimum Payout</label><input type="number" className="input-field" placeholder="5000" defaultValue={5000} /></div>
          <button className="btn-primary" style={{ width: '100%' }}>Enable Referral Program</button>
        </div>
      )}

      {tab === 'pricing' && (
        <div className="card" style={{ padding: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Price Optimization</h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>Get AI-powered pricing recommendations based on market data.</p>
          <div style={{ padding: 16, background: 'var(--bg-secondary)', borderRadius: 8, marginBottom: 12 }}>
            <div style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>AI Suggestion</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>Based on your niche, products priced between 2,000-5,000 XAF perform best.</div>
          </div>
          <button className="btn-primary" style={{ width: '100%' }}><ZapIcon className="w-4 h-4" /> Analyze Prices</button>
        </div>
      )}

      {tab === 'cart' && (
        <div className="card" style={{ padding: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Abandoned Cart Recovery</h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>Automatically follow up with buyers who started but didn&apos;t complete a purchase.</p>
          <div style={{ marginBottom: 12 }}><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Follow-up Delay (hours)</label><input type="number" className="input-field" placeholder="24" defaultValue={24} /></div>
          <div style={{ marginBottom: 12 }}><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Discount Offer (%)</label><input type="number" className="input-field" placeholder="5" defaultValue={5} /></div>
          <button className="btn-primary" style={{ width: '100%' }}>Enable Cart Recovery</button>
        </div>
      )}
    </div>
  );
}
