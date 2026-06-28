'use client';
import { useState, useEffect } from 'react';
import { supabase, ASHTECHPAY_COUNTRIES } from '@/lib/supabase';
import { useAppStore } from '@/lib/store';
import { UserIcon, StoreIcon, GlobeIcon, PaletteIcon, ShieldIcon, BellIcon, PackageIcon, FileTextIcon, SupportIcon, MailIcon, TrashIcon, DownloadIcon, CodeIcon } from '@/components/icons';

export default function SellerSettings() {
  const [tab, setTab] = useState('profile');
  const { toggleTheme, theme } = useAppStore();
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', whatsapp: '', bio: '', username: '', country: '', avatar_url: '' });
  const [storeName, setStoreName] = useState('');
  const [storeCurrency, setStoreCurrency] = useState('XAF');
  const [storeSlug, setStoreSlug] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [socialLinks, setSocialLinks] = useState({ twitter: '', instagram: '', facebook: '', tiktok: '' });
  const [notifOrders, setNotifOrders] = useState(true);
  const [notifPriceDrops, setNotifPriceDrops] = useState(true);
  const [notifPromos, setNotifPromos] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) {
        setProfile({ name: data.name || '', email: data.email || '', phone: data.phone || '', whatsapp: data.whatsapp || '', bio: data.bio || '', username: data.username || '', country: data.country || '', avatar_url: data.avatar_url || '' });
        setNotifOrders(data.notif_orders);
        setNotifPriceDrops(data.notif_price_drops);
        setNotifPromos(data.notif_promos);
      }
      const { data: store } = await supabase.from('store_settings').select('*').eq('seller_id', user.id).single();
      if (store) {
        setStoreName(store.name || '');
        setStoreCurrency(store.currency || 'XAF');
        setStoreSlug(store.slug || '');
        setCustomDomain(store.custom_domain || '');
        setSocialLinks(store.social_links as typeof socialLinks || { twitter: '', instagram: '', facebook: '', tiktok: '' });
      }
    }
    load();
  }, []);

  const saveProfile = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('profiles').update({ name: profile.name, phone: profile.phone, whatsapp: profile.whatsapp, bio: profile.bio, username: profile.username, notif_orders: notifOrders, notif_price_drops: notifPriceDrops, notif_promos: notifPromos }).eq('id', user.id);
    setMsg('Profile saved');
    setTimeout(() => setMsg(''), 2000);
    setLoading(false);
  };

  const changePassword = async () => {
    if (!newPassword) return;
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) { setMsg(error.message); return; }
    setMsg('Password updated');
    setCurrentPassword('');
    setNewPassword('');
    setTimeout(() => setMsg(''), 2000);
  };

  const deleteAccount = async () => {
    if (!confirm('Are you sure? This will deactivate your account.')) return;
    if (!confirm('This action cannot be undone. Confirm deletion?')) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('profiles').update({ deleted_at: new Date().toISOString() }).eq('id', user.id);
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'store', label: 'Store', icon: StoreIcon },
    { id: 'design', label: 'Design', icon: PaletteIcon },
    { id: 'domain', label: 'Domain', icon: GlobeIcon },
    { id: 'currencies', label: 'Currencies', icon: StoreIcon },
    { id: 'delivery', label: 'Delivery', icon: PackageIcon },
    { id: 'legal', label: 'Legal', icon: FileTextIcon },
    { id: 'support-channels', label: 'Support', icon: SupportIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
    { id: 'security', label: 'Security', icon: ShieldIcon },
    { id: 'export', label: 'Export', icon: DownloadIcon },
    { id: 'webhooks', label: 'Webhooks', icon: CodeIcon },
  ];

  return (
    <div className="page-wrapper animate-fade-in">
      <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Settings</h1>

      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 20, paddingBottom: 4 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`tab-item ${tab === t.id ? 'active' : ''}`}>{t.label}</button>
        ))}
      </div>

      {msg && <div style={{ padding: 12, borderRadius: 8, background: 'rgba(16,185,129,0.1)', color: 'var(--success)', fontSize: 13, marginBottom: 12 }}>{msg}</div>}

      {tab === 'profile' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ textAlign: 'center', marginBottom: 8 }}>
            <div style={{ width: 72, height: 72, borderRadius: 36, background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
              <span style={{ color: 'var(--accent)' }}><UserIcon className="w-8 h-8" /></span>
            </div>
            <button className="btn-ghost" style={{ fontSize: 12 }}>Change Avatar</button>
          </div>
          <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Display Name</label><input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="input-field" /></div>
          <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Username / Store Handle</label><input type="text" value={profile.username} onChange={(e) => setProfile({ ...profile, username: e.target.value })} className="input-field" placeholder="@handle" /></div>
          <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Email (read-only)</label><input type="email" value={profile.email} className="input-field" readOnly style={{ opacity: 0.6 }} /></div>
          <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Phone</label><input type="tel" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="input-field" /></div>
          <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>WhatsApp</label><input type="tel" value={profile.whatsapp} onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })} className="input-field" /></div>
          <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Bio</label><textarea value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} className="input-field" style={{ minHeight: 80 }} /></div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
            <span style={{ fontSize: 14, color: 'var(--text-primary)' }}>Dark Mode</span>
            <button onClick={toggleTheme} className={`toggle-switch ${theme === 'dark' ? 'active' : ''}`} />
          </div>
          <button onClick={saveProfile} className="btn-primary" disabled={loading} style={{ width: '100%' }}>{loading ? 'Saving...' : 'Save Profile'}</button>
        </div>
      )}

      {tab === 'store' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Store Name</label><input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} className="input-field" /></div>
          <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Store Slug</label><input type="text" value={storeSlug} onChange={(e) => setStoreSlug(e.target.value)} className="input-field" placeholder="my-store" /></div>
          <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Currency</label>
            <select value={storeCurrency} onChange={(e) => setStoreCurrency(e.target.value)} className="select-field">
              {ASHTECHPAY_COUNTRIES.map(c => <option key={c.code} value={c.currency}>{c.currency} - {c.name}</option>)}
              <option value="USD">USD</option>
            </select>
          </div>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginTop: 8 }}>Social Links</h3>
          {Object.entries(socialLinks).map(([key, val]) => (
            <div key={key}><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block', textTransform: 'capitalize' }}>{key}</label><input type="url" value={val} onChange={(e) => setSocialLinks({ ...socialLinks, [key]: e.target.value })} className="input-field" placeholder={`https://${key}.com/...`} /></div>
          ))}
          <button onClick={saveProfile} className="btn-primary" style={{ width: '100%' }}>Save Store Settings</button>
        </div>
      )}

      {tab === 'design' && (
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Store Design & Templates</h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>Customize your store appearance with themes and colors.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {['Dark Minimal', 'Light Clean', 'Gradient Bold', 'Neon Cyber'].map((t, i) => (
              <div key={i} className="card" style={{ padding: 16, textAlign: 'center', cursor: 'pointer' }}>
                <div style={{ height: 40, borderRadius: 8, background: i === 0 ? '#0a0e1a' : i === 1 ? '#f8fafc' : i === 2 ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'linear-gradient(135deg, #0ff, #f0f)', marginBottom: 8 }} />
                <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'domain' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Custom Domain</label><input type="text" value={customDomain} onChange={(e) => setCustomDomain(e.target.value)} className="input-field" placeholder="store.yourdomain.com" /></div>
          <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Store Slug URL</label><div style={{ padding: 12, background: 'var(--bg-secondary)', borderRadius: 8, fontSize: 13, color: 'var(--text-primary)' }}>sellizi.vercel.app/s/{storeSlug || 'your-slug'}</div></div>
          <button onClick={saveProfile} className="btn-primary" style={{ width: '100%' }}>Save Domain</button>
        </div>
      )}

      {tab === 'currencies' && (
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Store Currencies</h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>Set which currencies your store accepts for payments.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {['XAF', 'XOF', 'GNF', 'CDF', 'USD'].map(c => (
              <label key={c} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 8, background: 'var(--bg-secondary)', cursor: 'pointer', fontSize: 13 }}>
                <input type="checkbox" defaultChecked={c === storeCurrency} /> {c}
              </label>
            ))}
          </div>
        </div>
      )}

      {tab === 'delivery' && (
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Delivery Settings</h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>Configure how digital products are delivered to buyers after purchase.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: 13, color: 'var(--text-primary)' }}>Auto-delivery on payment</span><button className="toggle-switch active" /></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: 13, color: 'var(--text-primary)' }}>Email delivery confirmation</span><button className="toggle-switch active" /></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: 13, color: 'var(--text-primary)' }}>Require buyer PIN for access</span><button className="toggle-switch active" /></div>
          </div>
        </div>
      )}

      {tab === 'legal' && (
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Legal Pages</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <a href="/terms" style={{ fontSize: 13, color: 'var(--accent)', textDecoration: 'none' }}>Terms of Service</a>
            <a href="/privacy" style={{ fontSize: 13, color: 'var(--accent)', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="/refund-policy" style={{ fontSize: 13, color: 'var(--accent)', textDecoration: 'none' }}>Refund Policy</a>
          </div>
        </div>
      )}

      {tab === 'support-channels' && (
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Support Channels</h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>Contact: honestansah@gmail.com</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <a href="/seller/support" className="btn-secondary" style={{ textDecoration: 'none' }}>Open Support Ticket</a>
            <a href="mailto:honestansah@gmail.com" className="btn-ghost">Email Support</a>
          </div>
        </div>
      )}

      {tab === 'notifications' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Notification Preferences</h3>
          {[
            { label: 'Order notifications', value: notifOrders, set: setNotifOrders },
            { label: 'Price drop alerts', value: notifPriceDrops, set: setNotifPriceDrops },
            { label: 'Promotions & news', value: notifPromos, set: setNotifPromos },
          ].map((n, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 14, color: 'var(--text-primary)' }}>{n.label}</span>
              <button onClick={() => n.set(!n.value)} className={`toggle-switch ${n.value ? 'active' : ''}`} />
            </div>
          ))}
          <button onClick={saveProfile} className="btn-primary" style={{ width: '100%', marginTop: 8 }}>Save Preferences</button>
        </div>
      )}

      {tab === 'security' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Security</h3>
          <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>New Password</label><input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input-field" placeholder="Enter new password" /></div>
          <button onClick={changePassword} className="btn-primary" style={{ width: '100%' }}>Change Password</button>
          <div style={{ padding: 16, borderRadius: 8, background: 'var(--bg-secondary)', marginTop: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Two-Factor Authentication</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>2FA coming soon for enhanced security</div>
          </div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, marginTop: 12 }}>
            <button onClick={deleteAccount} className="btn-danger" style={{ width: '100%' }}><TrashIcon className="w-4 h-4" /> Delete Account</button>
          </div>
        </div>
      )}

      {tab === 'export' && (
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Export Data</h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>Download your store data in various formats.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {['Products (CSV)', 'Orders (CSV)', 'Customers (CSV)', 'Analytics (CSV)'].map((f, i) => (
              <button key={i} className="btn-secondary" style={{ width: '100%', justifyContent: 'space-between' }}>
                <span>{f}</span><DownloadIcon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>
      )}

      {tab === 'webhooks' && (
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Webhooks</h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>Configure webhook endpoints for real-time event notifications.</p>
          <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Payment Webhook URL</label><input type="url" className="input-field" placeholder="https://your-server.com/webhook" /></div>
          <button className="btn-primary" style={{ width: '100%', marginTop: 12 }}>Save Webhook</button>
        </div>
      )}
    </div>
  );
}
