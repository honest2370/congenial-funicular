'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { LogoIcon, MailIcon, ChevronLeftIcon, CheckIcon } from '@/components/icons';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error: authError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/login` });
    if (authError) { setError(authError.message); setLoading(false); return; }
    setSent(true);
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '20px', display: 'flex', flexDirection: 'column' }}>
      <a href="/login" style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 14, marginBottom: 32 }}>
        <ChevronLeftIcon className="w-4 h-4" /> Back to login
      </a>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
        <LogoIcon className="w-12 h-12" />
        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginTop: 16 }}>Reset password</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4, textAlign: 'center' }}>
          {sent ? 'Check your email for the reset link' : 'Enter your email to receive a reset link'}
        </p>
      </div>
      {sent ? (
        <div style={{ textAlign: 'center', padding: 24 }} className="card">
          <div style={{ width: 56, height: 56, borderRadius: 28, background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <span style={{ color: 'var(--success)' }}><CheckIcon className="w-6 h-6" /></span>
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>We sent a password reset link to <strong style={{ color: 'var(--text-primary)' }}>{email}</strong></p>
        </div>
      ) : (
        <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400, width: '100%', margin: '0 auto' }}>
          {error && <div style={{ padding: 12, borderRadius: 8, background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', fontSize: 13 }}>{error}</div>}
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Email</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><MailIcon className="w-4 h-4" /></span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="input-field" style={{ paddingLeft: 40 }} required />
            </div>
          </div>
          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: 8 }}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      )}
    </div>
  );
}
