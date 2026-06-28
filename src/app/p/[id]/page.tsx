'use client';
import { useState, useEffect } from 'react';
import { supabase, ASHTECHPAY_COUNTRIES } from '@/lib/supabase';
import { LogoIcon, LockIcon, MailIcon, PhoneIcon, ChevronLeftIcon, CheckIcon } from '@/components/icons';

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const [product, setProduct] = useState<{ id: string; name: string; description: string | null; price: number; currency: string; image_url: string | null; type: string; seller_id: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<'details' | 'payment'>('details');
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [country, setCountry] = useState('CM');
  const [operator, setOperator] = useState('');
  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState('');
  const [otpRequired, setOtpRequired] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpMessage, setOtpMessage] = useState('');
  const [ussdCode, setUssdCode] = useState('');
  const [waveUrl, setWaveUrl] = useState('');
  const [success, setSuccess] = useState(false);
  const [resolvedId, setResolvedId] = useState('');

  useEffect(() => {
    params.then(p => setResolvedId(p.id));
  }, [params]);

  useEffect(() => {
    if (!resolvedId) return;
    async function load() {
      // Try to load by product id or affiliate code
      let { data } = await supabase.from('products').select('*').eq('id', resolvedId).eq('status', 'active').single();
      if (!data) {
        // Try affiliate code
        const { data: aff } = await supabase.from('affiliate_links').select('product_id').eq('code', resolvedId).single();
        if (aff) {
          const res = await supabase.from('products').select('*').eq('id', aff.product_id).eq('status', 'active').single();
          data = res.data;
        }
      }
      if (data) {
        setProduct(data);
        // Track view
        await supabase.from('products').update({ views: (data.views || 0) + 1 }).eq('id', data.id);
      }
      setLoading(false);
    }
    load();
  }, [resolvedId]);

  const selectedCountry = ASHTECHPAY_COUNTRIES.find(c => c.code === country);

  const handlePayment = async () => {
    if (!buyerEmail || !buyerPhone || !country || !operator) {
      setPayError('Please fill all fields');
      return;
    }
    setPayLoading(true);
    setPayError('');

    try {
      const res = await fetch('/api/payments/collect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: product!.price,
          currency: product!.currency,
          phone: buyerPhone,
          operator,
          country_code: country,
          reference: `SELLIZI-${Date.now()}`,
          notify_url: `${window.location.origin}/api/payments/webhook`,
          buyer_email: buyerEmail,
          buyer_name: buyerName,
          product_id: product!.id,
          seller_id: product!.seller_id,
        }),
      });

      const data = await res.json();

      if (data.requires_otp) {
        setOtpRequired(true);
        setOtpMessage(data.message || 'OTP required');
        setUssdCode(data.ussd_code || '');
      } else if (data.success) {
        // Create order in database
        await supabase.from('orders').insert({
          buyer_email: buyerEmail,
          product_id: product!.id,
          seller_id: product!.seller_id,
          amount: product!.price,
          currency: product!.currency,
          status: 'pending',
          payment_ref: data.reference,
          ashtechpay_ref: data.transaction_id,
        });

        // Save buyer email
        await supabase.from('buyer_accounts').upsert({ email: buyerEmail, pin_hash: '', name: buyerName }, { onConflict: 'email' });

        if (data.flow === 'wave' && data.wave_url) {
          setWaveUrl(data.wave_url);
        }

        // Track analytics
        await supabase.from('analytics_events').insert({
          product_id: product!.id,
          seller_id: product!.seller_id,
          event_type: 'purchase',
          referrer: document.referrer || null,
          visitor_id: buyerEmail,
        });

        setSuccess(true);
      } else {
        setPayError(data.message || 'Payment failed');
      }
    } catch (err) {
      setPayError('Network error. Please try again.');
    }
    setPayLoading(false);
  };

  const handleOtpSubmit = async () => {
    setPayLoading(true);
    try {
      const res = await fetch('/api/payments/collect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: product!.price,
          currency: product!.currency,
          phone: buyerPhone,
          operator,
          country_code: country,
          reference: `SELLIZI-${Date.now()}`,
          otp,
          buyer_email: buyerEmail,
          buyer_name: buyerName,
          product_id: product!.id,
          seller_id: product!.seller_id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setPayError(data.message || 'OTP verification failed');
      }
    } catch (err) {
      setPayError('Network error');
    }
    setPayLoading(false);
  };

  if (loading) return <div className="page-wrapper"><div className="shimmer" style={{ width: '100%', height: 300, borderRadius: 12 }} /></div>;

  if (!product) return <div className="page-wrapper" style={{ textAlign: 'center', paddingTop: 60 }}><h2 style={{ color: 'var(--text-primary)' }}>Product not found</h2><a href="/" className="btn-primary" style={{ marginTop: 16, display: 'inline-flex', textDecoration: 'none' }}>Go Home</a></div>;

  if (success) return (
    <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <div style={{ width: 72, height: 72, borderRadius: 36, background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
        <span style={{ color: 'var(--success)' }}><CheckIcon className="w-10 h-10" /></span>
      </div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Payment Initiated!</h2>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', textAlign: 'center', marginBottom: 8 }}>Complete the payment on your phone.</p>
      {waveUrl && <a href={waveUrl} className="btn-primary" style={{ marginTop: 12, textDecoration: 'none' }}>Open Wave to Pay</a>}
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center', marginTop: 16 }}>After payment, access your product at:</p>
      <a href="/buyer-auth" className="btn-secondary" style={{ marginTop: 8, textDecoration: 'none' }}>Access Your Library</a>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--border)' }}>
        <LogoIcon className="w-6 h-6" />
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>SELLIZI</span>
      </div>

      <div className="page-wrapper" style={{ paddingTop: 20 }}>
        {/* Product Info */}
        <div style={{ marginBottom: 20 }}>
          {product.image_url && <img src={product.image_url} alt="" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 12, marginBottom: 12 }} />}
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>{product.name}</h1>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--accent)', marginTop: 8 }}>{product.price.toLocaleString()} {product.currency}</div>
          {product.description && <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 8, lineHeight: 1.6 }}>{product.description}</p>}
          <div style={{ marginTop: 8 }}>
            <span className="badge badge-info" style={{ textTransform: 'capitalize' }}>{product.type.replace('_', ' ')}</span>
          </div>
        </div>

        {/* Payment Form */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Complete Purchase</h2>

          {payError && <div style={{ padding: 12, borderRadius: 8, background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', fontSize: 13, marginBottom: 12 }}>{payError}</div>}

          {otpRequired ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ padding: 12, background: 'rgba(245,158,11,0.1)', borderRadius: 8 }}>
                <span style={{ fontSize: 12, color: 'var(--warning)' }}>{otpMessage}</span>
                {ussdCode && <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginTop: 4 }}>Dial: {ussdCode}</div>}
              </div>
              <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>OTP Code</label><input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} className="input-field" placeholder="Enter OTP" maxLength={6} /></div>
              <button onClick={handleOtpSubmit} className="btn-primary" disabled={payLoading} style={{ width: '100%' }}>{payLoading ? 'Verifying...' : 'Verify & Pay'}</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Your Name</label><input type="text" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} className="input-field" placeholder="John Doe" /></div>
              <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Email</label><input type="email" value={buyerEmail} onChange={(e) => setBuyerEmail(e.target.value)} className="input-field" placeholder="your@email.com" required /></div>
              <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Country</label>
                <select value={country} onChange={(e) => { setCountry(e.target.value); setOperator(''); }} className="select-field">
                  {ASHTECHPAY_COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name} ({c.currency})</option>)}
                </select>
              </div>
              <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Mobile Money Operator</label>
                <select value={operator} onChange={(e) => setOperator(e.target.value)} className="select-field" required>
                  <option value="">Select operator</option>
                  {selectedCountry?.operators.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Phone Number</label><input type="tel" value={buyerPhone} onChange={(e) => setBuyerPhone(e.target.value)} className="input-field" placeholder="670000000" required /></div>
              <button onClick={handlePayment} className="btn-primary" disabled={payLoading} style={{ width: '100%', padding: '16px 24px', fontSize: 16 }}>
                <LockIcon className="w-4 h-4" /> {payLoading ? 'Processing...' : `Pay ${product.price.toLocaleString()} ${product.currency}`}
              </button>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>Secure payment powered by Ashtechpay</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
