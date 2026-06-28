'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { LogoIcon, MailIcon, LockIcon, ChevronLeftIcon } from '@/components/icons';

export default function BuyerAuthPage() {
  const [step, setStep] = useState<'email' | 'pin' | 'new_pin'>('email');
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [buyerExists, setBuyerExists] = useState(false);

  const checkEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { data } = await supabase.from('buyer_accounts').select('id').eq('email', email).single();
    if (data) { setBuyerExists(true); setStep('pin'); }
    else { setStep('new_pin'); }
    setLoading(false);
  };

  const loginWithPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { data } = await supabase.from('buyer_accounts').select('id, pin_hash').eq('email', email).single();
    if (!data) { setError('Account not found'); setLoading(false); return; }
    if (pin !== data.pin_hash) { setError('Incorrect PIN'); setLoading(false); return; }
    localStorage.setItem('buyer_email', email);
    window.location.href = '/buyer';
  };

  const createPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length !== 5 || !/^\d{5}$/.test(newPin)) { setError('PIN must be exactly 5 digits'); return; }
    if (newPin !== confirmPin) { setError('PINs do not match'); return; }
    setLoading(true);
    setError('');
    await supabase.from('buyer_accounts').insert({ email, pin_hash: newPin });
    localStorage.setItem('buyer_email', email);
    window.location.href = '/buyer';
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '20px', display: 'flex', flexDirection: 'column' }}>
      <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 14, marginBottom: 32 }}>
        <ChevronLeftIcon className="w-4 h-4" /> Back
      </a>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
        <LogoIcon className="w-12 h-12" />
        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginTop: 16 }}>Access Purchases</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>
          {step === 'email' ? 'Enter the email you used to purchase' : step === 'pin' ? 'Enter your 5-digit PIN' : 'Create a 5-digit PIN'}
        </p>
      </div>

      {step === 'email' && (
        <form onSubmit={checkEmail} style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400, width: '100%', margin: '0 auto' }}>
          {error && <div style={{ padding: 12, borderRadius: 8, background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', fontSize: 13 }}>{error}</div>}
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><MailIcon className="w-4 h-4" /></span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="input-field" style={{ paddingLeft: 40 }} required />
            </div>
          </div>
          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Checking...' : 'Continue'}
          </button>
        </form>
      )}

      {step === 'pin' && (
        <form onSubmit={loginWithPin} style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400, width: '100%', margin: '0 auto' }}>
          {error && <div style={{ padding: 12, borderRadius: 8, background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', fontSize: 13 }}>{error}</div>}
          <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>{email}</div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>5-Digit PIN</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><LockIcon className="w-4 h-4" /></span>
              <input type="password" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 5))} placeholder="Enter PIN" className="input-field" style={{ paddingLeft: 40, letterSpacing: 8, fontSize: 20, textAlign: 'center' }} maxLength={5} required />
            </div>
          </div>
          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Verifying...' : 'Access Library'}
          </button>
          <button type="button" onClick={() => setStep('email')} className="btn-ghost">Use different email</button>
        </form>
      )}

      {step === 'new_pin' && (
        <form onSubmit={createPin} style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400, width: '100%', margin: '0 auto' }}>
          {error && <div style={{ padding: 12, borderRadius: 8, background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', fontSize: 13 }}>{error}</div>}
          <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
            First time? Create a PIN for <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Create 5-Digit PIN</label>
            <input type="password" value={newPin} onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 5))} placeholder="Enter new PIN" className="input-field" style={{ letterSpacing: 8, fontSize: 20, textAlign: 'center' }} maxLength={5} required />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Confirm PIN</label>
            <input type="password" value={confirmPin} onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 5))} placeholder="Confirm PIN" className="input-field" style={{ letterSpacing: 8, fontSize: 20, textAlign: 'center' }} maxLength={5} required />
          </div>
          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Creating...' : 'Create & Access'}
          </button>
          <button type="button" onClick={() => setStep('email')} className="btn-ghost">Use different email</button>
        </form>
      )}
    </div>
  );
}
