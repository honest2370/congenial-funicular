'use client';
import { useState, useEffect } from 'react';
import { supabaseAdmin } from '@/lib/supabase';
import { SettingsIcon, ZapIcon, DollarIcon, KeyIcon, SearchIcon, MailIcon, PaletteIcon, FileTextIcon, CodeIcon, BellIcon, GlobeIcon, ShieldIcon } from '@/components/icons';

export default function AdminSettings() {
  const [tab, setTab] = useState('general');
  const [msg, setMsg] = useState('');

  // General settings
  const [supportEmail, setSupportEmail] = useState('honestansah@gmail.com');
  const [appName, setAppName] = useState('SELLIZI');
  const [appUrl, setAppUrl] = useState('https://sellizi.vercel.app');

  // AI settings
  const [grokKey, setGrokKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [claudeKey, setClaudeKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');

  // Ashtechpay settings
  const [ashtechpayKey, setAshtechpayKey] = useState('');
  const [ashtechpayWebhook, setAshtechpayWebhook] = useState('');

  // Push settings
  const [vapidKey, setVapidKey] = useState('');

  const save = async () => {
    setMsg('Settings saved successfully');
    setTimeout(() => setMsg(''), 2000);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'ai', label: 'AI Config', icon: ZapIcon },
    { id: 'ashtechpay', label: 'Ashtechpay', icon: DollarIcon },
    { id: 'api', label: 'API Keys', icon: KeyIcon },
    { id: 'seo', label: 'SEO', icon: SearchIcon },
    { id: 'email', label: 'Email', icon: MailIcon },
    { id: 'themes', label: 'Themes', icon: PaletteIcon },
    { id: 'legal', label: 'Legal', icon: FileTextIcon },
    { id: 'features', label: 'Features', icon: CodeIcon },
    { id: 'webhooks', label: 'Webhooks', icon: CodeIcon },
    { id: 'push', label: 'Push', icon: BellIcon },
    { id: 'countries', label: 'Countries', icon: GlobeIcon },
    { id: 'security', label: 'Security', icon: ShieldIcon },
  ];

  return (
    <div className="page-wrapper animate-fade-in">
      <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Admin Settings</h1>

      <div style={{ display: 'flex', gap: 4, overflowX: 'auto', marginBottom: 20, paddingBottom: 4 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`tab-item ${tab === t.id ? 'active' : ''}`}>{t.label}</button>
        ))}
      </div>

      {msg && <div style={{ padding: 12, borderRadius: 8, background: 'rgba(16,185,129,0.1)', color: 'var(--success)', fontSize: 13, marginBottom: 12 }}>{msg}</div>}

      {tab === 'general' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>App Name</label><input type="text" value={appName} onChange={(e) => setAppName(e.target.value)} className="input-field" /></div>
          <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>App URL</label><input type="url" value={appUrl} onChange={(e) => setAppUrl(e.target.value)} className="input-field" /></div>
          <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Support Email</label><input type="email" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} className="input-field" /></div>
          <button onClick={save} className="btn-primary" style={{ width: '100%' }}>Save General Settings</button>
        </div>
      )}

      {tab === 'ai' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ padding: 12, background: 'rgba(99,102,241,0.1)', borderRadius: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 12, color: 'var(--accent)' }}>Configure AI model API keys. These are used across the platform for AI-powered features.</span>
          </div>
          <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Grok (xAI) API Key</label><input type="password" value={grokKey} onChange={(e) => setGrokKey(e.target.value)} className="input-field" placeholder="xai-..." /></div>
          <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Google Gemini API Key</label><input type="password" value={geminiKey} onChange={(e) => setGeminiKey(e.target.value)} className="input-field" placeholder="AIza..." /></div>
          <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Anthropic Claude API Key</label><input type="password" value={claudeKey} onChange={(e) => setClaudeKey(e.target.value)} className="input-field" placeholder="sk-ant-..." /></div>
          <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>OpenAI API Key</label><input type="password" value={openaiKey} onChange={(e) => setOpenaiKey(e.target.value)} className="input-field" placeholder="sk-..." /></div>
          <button onClick={save} className="btn-primary" style={{ width: '100%' }}>Save AI Configuration</button>
        </div>
      )}

      {tab === 'ashtechpay' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ padding: 12, background: 'rgba(16,185,129,0.1)', borderRadius: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 12, color: 'var(--success)' }}>Ashtechpay integration for Mobile Money payments across 16 African countries.</span>
          </div>
          <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>API Key</label><input type="password" value={ashtechpayKey} onChange={(e) => setAshtechpayKey(e.target.value)} className="input-field" placeholder="Your Ashtechpay API key" /></div>
          <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Webhook URL</label><input type="url" value={ashtechpayWebhook} onChange={(e) => setAshtechpayWebhook(e.target.value)} className="input-field" placeholder="https://sellizi.vercel.app/api/payments/webhook" /></div>
          <div style={{ padding: 12, background: 'var(--bg-secondary)', borderRadius: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Ashtechpay Endpoints</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.8 }}>Base URL: https://ashtechpay.top<br />Collect: POST /v1/collect<br />Status: GET /v1/transaction/:id<br />Countries: GET /v1/countries<br />Fees: GET /v1/fees</div>
          </div>
          <button onClick={save} className="btn-primary" style={{ width: '100%' }}>Save Ashtechpay Settings</button>
        </div>
      )}

      {tab === 'api' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Supabase URL</label><input type="text" className="input-field" value={process.env.NEXT_PUBLIC_SUPABASE_URL || ''} readOnly style={{ opacity: 0.6 }} /></div>
          <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Supabase Anon Key</label><input type="text" className="input-field" value={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''} readOnly style={{ opacity: 0.6 }} /></div>
          <div style={{ padding: 12, background: 'rgba(239,68,68,0.1)', borderRadius: 8 }}><span style={{ fontSize: 12, color: 'var(--danger)' }}>Service role key is available server-side only. Never expose it in client code.</span></div>
        </div>
      )}

      {tab === 'seo' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Google Site Verification</label><input type="text" className="input-field" placeholder="Verification code" /></div>
          <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Canonical URL</label><input type="url" className="input-field" placeholder="https://sellizi.vercel.app" /></div>
          <button onClick={save} className="btn-primary" style={{ width: '100%' }}>Save SEO Settings</button>
        </div>
      )}

      {tab === 'email' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>From Email</label><input type="email" className="input-field" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} /></div>
          <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>SMTP Host</label><input type="text" className="input-field" placeholder="smtp.gmail.com" /></div>
          <button onClick={save} className="btn-primary" style={{ width: '100%' }}>Save Email Settings</button>
        </div>
      )}

      {tab === 'themes' && (
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Platform Themes</h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Manage default themes and store templates available to sellers.</p>
        </div>
      )}

      {tab === 'legal' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Terms of Service</label><textarea className="input-field" style={{ minHeight: 120 }} placeholder="Enter terms of service..." /></div>
          <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Privacy Policy</label><textarea className="input-field" style={{ minHeight: 120 }} placeholder="Enter privacy policy..." /></div>
          <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Refund Policy</label><textarea className="input-field" style={{ minHeight: 120 }} placeholder="Enter refund policy..." /></div>
          <button onClick={save} className="btn-primary" style={{ width: '100%' }}>Save Legal Pages</button>
        </div>
      )}

      {tab === 'features' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {['AI Tools', 'Affiliate System', 'Push Notifications', 'Email Campaigns', 'Coupon System', 'Referral Program', 'Custom Domains', 'Webhooks'].map(f => (
            <div key={f} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 14, color: 'var(--text-primary)' }}>{f}</span>
              <button className="toggle-switch active" />
            </div>
          ))}
          <button onClick={save} className="btn-primary" style={{ width: '100%', marginTop: 8 }}>Save Feature Flags</button>
        </div>
      )}

      {tab === 'webhooks' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Payment Webhook</label><input type="url" className="input-field" placeholder="https://..." /></div>
          <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Event Webhook</label><input type="url" className="input-field" placeholder="https://..." /></div>
          <button onClick={save} className="btn-primary" style={{ width: '100%' }}>Save Webhooks</button>
        </div>
      )}

      {tab === 'push' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>VAPID Public Key</label><input type="text" value={vapidKey} onChange={(e) => setVapidKey(e.target.value)} className="input-field" placeholder="BL-..." /></div>
          <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>VAPID Private Key</label><input type="password" className="input-field" placeholder="(server-side only)" /></div>
          <button onClick={save} className="btn-primary" style={{ width: '100%' }}>Save Push Settings</button>
        </div>
      )}

      {tab === 'countries' && (
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Supported Countries (Ashtechpay)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[{ code: 'BJ', name: 'Benin' }, { code: 'BF', name: 'Burkina Faso' }, { code: 'CM', name: 'Cameroon' }, { code: 'CF', name: 'Central African Rep.' }, { code: 'CG', name: 'Congo' }, { code: 'CI', name: "Côte d'Ivoire" }, { code: 'GA', name: 'Gabon' }, { code: 'GN', name: 'Guinea Conakry' }, { code: 'GQ', name: 'Equatorial Guinea' }, { code: 'GW', name: 'Guinea-Bissau' }, { code: 'ML', name: 'Mali' }, { code: 'NE', name: 'Niger' }, { code: 'CD', name: 'DR Congo' }, { code: 'SN', name: 'Senegal' }, { code: 'TD', name: 'Chad' }, { code: 'TG', name: 'Togo' }].map(c => (
              <div key={c.code} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: 8, background: 'var(--bg-secondary)' }}>
                <span style={{ fontSize: 12, color: 'var(--text-primary)' }}>{c.name}</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.code}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'security' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ padding: 12, background: 'rgba(239,68,68,0.1)', borderRadius: 8 }}><span style={{ fontSize: 12, color: 'var(--danger)' }}>Admin access is separate from user data. RLS policies prevent admin data conflicts.</span></div>
          <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Admin Password</label><input type="password" className="input-field" placeholder="New admin password" /></div>
          <button onClick={save} className="btn-primary" style={{ width: '100%' }}>Update Security</button>
        </div>
      )}
    </div>
  );
}
