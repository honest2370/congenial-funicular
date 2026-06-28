'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ASHTECHPAY_COUNTRIES } from '@/lib/supabase';
import { LogoIcon, MailIcon, LockIcon, EyeIcon, UserIcon, PhoneIcon, GlobeIcon, ChevronLeftIcon, GoogleIcon } from '@/components/icons';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [role, setRole] = useState<'seller' | 'buyer'>('seller');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { data, error: authError } = await supabase.auth.signUp({ email, password, options: { data: { name, phone, country, role } } });
    if (authError) { setError(authError.message); setLoading(false); return; }
    if (data.user) {
      await supabase.from('profiles').insert({ id: data.user.id, email, name, phone, country, role, notif_orders: true, notif_price_drops: true, notif_promos: true, dark_mode: true });
      window.location.href = role === 'buyer' ? '/buyer' : '/seller';
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/seller` } });
    if (error) setError(error.message);
  };

  const allCountries = [...ASHTECHPAY_COUNTRIES.map(c => ({ value: c.code, label: c.name })), { value: 'OTHER', label: 'Other' }];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '20px', display: 'flex', flexDirection: 'column' }}>
      <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 14, marginBottom: 24 }}>
        <ChevronLeftIcon className="w-4 h-4" /> Back
      </a>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
        <LogoIcon className="w-12 h-12" />
        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginTop: 12 }}>Create account</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>Join SELLIZI today</p>
      </div>

      {/* Role toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, maxWidth: 400, width: '100%', margin: '0 auto 20px' }}>
        {(['seller', 'buyer'] as const).map((r) => (
          <button key={r} onClick={() => setRole(r)} style={{ flex: 1, padding: 14, borderRadius: 10, border: role === r ? '2px solid var(--accent)' : '1px solid var(--border)', background: role === r ? 'var(--accent-light)' : 'var(--bg-card)', cursor: 'pointer', textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: role === r ? 'var(--accent)' : 'var(--text-secondary)', textTransform: 'capitalize' }}>{r}</div>
          </button>
        ))}
      </div>

      <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 400, width: '100%', margin: '0 auto' }}>
        {error && <div style={{ padding: 12, borderRadius: 8, background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', fontSize: 13 }}>{error}</div>}
        <div>
          <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Full Name</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><UserIcon className="w-4 h-4" /></span>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="input-field" style={{ paddingLeft: 40 }} required />
          </div>
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Email</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><MailIcon className="w-4 h-4" /></span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="input-field" style={{ paddingLeft: 40 }} required />
          </div>
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Password</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><LockIcon className="w-4 h-4" /></span>
            <input type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" className="input-field" style={{ paddingLeft: 40, paddingRight: 40 }} required minLength={6} />
            <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><EyeIcon className="w-4 h-4" /></button>
          </div>
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Phone Number</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><PhoneIcon className="w-4 h-4" /></span>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+237 6XX XXX XXX" className="input-field" style={{ paddingLeft: 40 }} />
          </div>
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Country</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><GlobeIcon className="w-4 h-4" /></span>
            <select value={country} onChange={(e) => setCountry(e.target.value)} className="select-field" style={{ paddingLeft: 40 }} required>
              <option value="">Select country</option>
              {allCountries.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
        </div>
        <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: 8 }}>
          {loading ? 'Creating account...' : `Sign up as ${role}`}
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '8px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>or</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>
        <button type="button" onClick={handleGoogle} className="btn-secondary" style={{ width: '100%', gap: 10 }}>
          <GoogleIcon className="w-4 h-4" /> Continue with Google
        </button>
      </form>
      <div style={{ textAlign: 'center', marginTop: 20, maxWidth: 400, width: '100%', margin: '20px auto 0' }}>
        <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Already have an account? </span>
        <a href="/login" style={{ fontSize: 14, color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>Sign in</a>
      </div>
    </div>
  );
}
