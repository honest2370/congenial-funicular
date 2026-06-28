'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { LogoIcon, MailIcon, LockIcon, EyeIcon, GoogleIcon, ChevronLeftIcon } from '@/components/icons';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) { setError(authError.message); setLoading(false); return; }
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', (await supabase.auth.getUser()).data.user?.id).single();
    if (profile?.role === 'admin') window.location.href = '/adminentry';
    else if (profile?.role === 'buyer') window.location.href = '/buyer';
    else window.location.href = '/seller';
  };

  const handleGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/seller` } });
    if (error) setError(error.message);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '20px', display: 'flex', flexDirection: 'column' }}>
      <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 14, marginBottom: 32 }}>
        <ChevronLeftIcon className="w-4 h-4" /> Back
      </a>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 40 }}>
        <LogoIcon className="w-12 h-12" />
        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginTop: 16 }}>Welcome back</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>Sign in to your SELLIZI account</p>
      </div>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400, width: '100%', margin: '0 auto' }}>
        {error && <div style={{ padding: 12, borderRadius: 8, background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', fontSize: 13 }}>{error}</div>}
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
            <input type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" className="input-field" style={{ paddingLeft: 40, paddingRight: 40 }} required />
            <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><EyeIcon className="w-4 h-4" /></button>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <a href="/forgot-password" style={{ fontSize: 13, color: 'var(--accent)', textDecoration: 'none' }}>Forgot password?</a>
        </div>
        <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: 8 }}>
          {loading ? 'Signing in...' : 'Sign In'}
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
      <div style={{ textAlign: 'center', marginTop: 24, maxWidth: 400, width: '100%', margin: '24px auto 0' }}>
        <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Don&apos;t have an account? </span>
        <a href="/signup" style={{ fontSize: 14, color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>Sign up</a>
      </div>
    </div>
  );
}
