'use client';
import { useState, useEffect } from 'react';
import { supabase, ASHTECHPAY_COUNTRIES } from '@/lib/supabase';
import { WalletIcon, AwardIcon, DollarIcon, SupportIcon, ZapIcon, CheckIcon } from '@/components/icons';

function AlertIcon(p: { className?: string }) { return <svg className={p.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>; }

export default function SellerPayouts() {
  const [tab, setTab] = useState<'payouts' | 'subscription'>('payouts');
  const [payoutPhone, setPayoutPhone] = useState('');
  const [payoutCountry, setPayoutCountry] = useState('CM');
  const [payoutOperator, setPayoutOperator] = useState('');
  const [payoutAmount, setPayoutAmount] = useState('');
  const [currentPlan, setCurrentPlan] = useState('free');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const selectedCountry = ASHTECHPAY_COUNTRIES.find(c => c.code === payoutCountry);

  const plans = [
    { id: 'free', name: 'Free', price: 0, features: ['5 products', 'Basic analytics', 'Email support'], color: 'var(--text-secondary)' },
    { id: 'starter', name: 'Starter', price: 5000, features: ['25 products', 'Advanced analytics', 'Marketing tools', 'Priority support'], color: 'var(--info)' },
    { id: 'pro', name: 'Pro', price: 15000, features: ['Unlimited products', 'Full analytics suite', 'AI tools', 'Custom domain', 'Affiliate system'], color: 'var(--accent)' },
    { id: 'enterprise', name: 'Enterprise', price: 50000, features: ['Everything in Pro', 'White label', 'API access', 'Dedicated support', 'Custom integrations'], color: 'var(--success)' },
  ];

  const requestPayout = async () => {
    if (!payoutPhone || !payoutAmount) return;
    setLoading(true);
    // Simulate payout request
    await new Promise(r => setTimeout(r, 1000));
    setMsg('Payout request submitted. You will receive your funds shortly.');
    setTimeout(() => setMsg(''), 3000);
    setLoading(false);
  };

  const subscribe = async (planId: string) => {
    if (planId === 'free') return;
    setLoading(true);
    setMsg('Initiating Ashtechpay payment for subscription...');
    // In production, this would call the Ashtechpay collect endpoint via the API route
    setTimeout(() => {
      setMsg('Subscription payment initiated. Complete payment on your phone.');
      setTimeout(() => setMsg(''), 3000);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <button onClick={() => setTab('payouts')} className={`tab-item ${tab === 'payouts' ? 'active' : ''}`}>Payouts</button>
        <button onClick={() => setTab('subscription')} className={`tab-item ${tab === 'subscription' ? 'active' : ''}`}>Subscription</button>
      </div>

      {msg && <div style={{ padding: 12, borderRadius: 8, background: 'rgba(59,130,246,0.1)', color: 'var(--info)', fontSize: 13, marginBottom: 12 }}>{msg}</div>}

      {tab === 'payouts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Request Payout</h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Withdraw your earnings via Mobile Money</p>
          <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Country</label>
            <select value={payoutCountry} onChange={(e) => { setPayoutCountry(e.target.value); setPayoutOperator(''); }} className="select-field">
              {ASHTECHPAY_COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name} ({c.currency})</option>)}
            </select>
          </div>
          <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Operator</label>
            <select value={payoutOperator} onChange={(e) => setPayoutOperator(e.target.value)} className="select-field">
              <option value="">Select operator</option>
              {selectedCountry?.operators.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Phone Number</label><input type="tel" value={payoutPhone} onChange={(e) => setPayoutPhone(e.target.value)} className="input-field" placeholder="670000000" /></div>
          <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Amount</label><input type="number" value={payoutAmount} onChange={(e) => setPayoutAmount(e.target.value)} className="input-field" placeholder="0" /></div>
          <button onClick={requestPayout} className="btn-primary" disabled={loading} style={{ width: '100%' }}>
            <WalletIcon className="w-4 h-4" /> {loading ? 'Processing...' : 'Request Payout'}
          </button>
          <div style={{ padding: 12, background: 'rgba(245,158,11,0.1)', borderRadius: 8, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <span style={{ color: 'var(--warning)', marginTop: 2 }}><AlertIcon className="w-4 h-4" /></span>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>Payout processing typically takes 1-24 hours. Fees apply based on your country. If you experience issues, <a href="/seller/support" style={{ color: 'var(--accent)' }}>create a support ticket</a>.</span>
          </div>
        </div>
      )}

      {tab === 'subscription' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Subscription Plans</h2>
          {plans.map(p => (
            <div key={p.id} className="card" style={{ padding: 16, border: currentPlan === p.id ? '2px solid var(--accent)' : undefined }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: p.color }}><AwardIcon className="w-5 h-5" /></span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{p.name}</span>
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: p.color }}>{p.price === 0 ? 'Free' : `${p.price.toLocaleString()} XAF/mo`}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
                {p.features.map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--success)' }}><CheckIcon className="w-3 h-3" /></span> {f}
                  </div>
                ))}
              </div>
              {currentPlan === p.id ? (
                <button className="btn-secondary" style={{ width: '100%', fontSize: 12 }} disabled>Current Plan</button>
              ) : (
                <button onClick={() => subscribe(p.id)} className="btn-primary" style={{ width: '100%', fontSize: 12 }} disabled={loading}>
                  {p.price === 0 ? 'Downgrade' : 'Subscribe'}
                </button>
              )}
            </div>
          ))}
          <div style={{ padding: 12, background: 'rgba(59,130,246,0.1)', borderRadius: 8, marginTop: 4 }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Subscription payments are processed via Ashtechpay. If you encounter issues, please <a href="/seller/support" style={{ color: 'var(--accent)' }}>contact support</a>.</span>
          </div>
        </div>
      )}
    </div>
  );
}
