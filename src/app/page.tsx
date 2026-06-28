'use client';
import { useState } from 'react';
import { LogoIcon, ArrowRightIcon, StoreIcon, ShieldIcon, ZapIcon, GlobeIcon, ChartIcon, ChevronRightIcon } from '@/components/icons';

const features = [
  { icon: <StoreIcon />, title: 'Digital Storefront', desc: 'Sell ebooks, courses, accounts, software & more' },
  { icon: <ShieldIcon />, title: 'Ashtechpay Payments', desc: 'Mobile Money across 16 African countries' },
  { icon: <ZapIcon />, title: 'Instant Delivery', desc: 'Products delivered automatically after purchase' },
  { icon: <GlobeIcon />, title: 'Pan-African Reach', desc: 'Accept payments from Cameroon to Senegal' },
  { icon: <ChartIcon />, title: 'Advanced Analytics', desc: 'Track sales, visitors, conversions in real-time' },
  { icon: <ZapIcon />, title: 'Marketing Tools', desc: '40+ tools to grow your digital business' },
];

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { title: 'Sell Digital Products', subtitle: 'Ebooks, courses, accounts, software, and 15+ product types' },
    { title: 'Accept Mobile Money', subtitle: 'Ashtechpay powers payments across 16 African countries' },
    { title: 'Powerful Analytics', subtitle: 'Track revenue, conversions, visitors & affiliate performance' },
  ];

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', position: 'sticky', top: 0, zIndex: 40, background: 'var(--bg-primary)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <LogoIcon className="w-8 h-8" />
          <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>SELLIZI</span>
        </div>
        <a href="/login" style={{ color: 'var(--accent)', fontWeight: 600, fontSize: 14, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
          Sign in <ChevronRightIcon className="w-4 h-4" />
        </a>
      </header>

      {/* Hero */}
      <section style={{ padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 20, background: 'var(--accent-light)', color: 'var(--accent)', fontSize: 12, fontWeight: 600, marginBottom: 16 }}>
          Built for Africa
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.2, color: 'var(--text-primary)', marginBottom: 12, letterSpacing: '-1px' }}>
          Your Digital<br />
          <span style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Commerce Platform</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.6, maxWidth: 340, margin: '0 auto 32px' }}>
          Sell digital products across Africa. Accept Mobile Money payments. Built for sellers who mean business.
        </p>

        {/* Slide indicators */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 32 }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrentSlide(i)} style={{ width: i === currentSlide ? 24 : 8, height: 8, borderRadius: 4, background: i === currentSlide ? 'var(--accent)' : 'var(--border)', border: 'none', cursor: 'pointer', transition: 'all 0.3s' }} />
          ))}
        </div>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320, margin: '0 auto' }}>
          <a href="/signup" className="btn-primary" style={{ textDecoration: 'none', width: '100%', padding: '16px 24px', fontSize: 16 }}>
            Start Selling <ArrowRightIcon className="w-5 h-5" />
          </a>
          <a href="/buyer-auth" className="btn-secondary" style={{ textDecoration: 'none', width: '100%', padding: '16px 24px', fontSize: 16 }}>
            Access Your Purchases
          </a>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '0 20px 40px' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: 'var(--text-primary)' }}>Everything you need</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {features.map((f, i) => (
            <div key={i} className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ color: 'var(--accent)' }}>{f.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{f.title}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Product Types */}
      <section style={{ padding: '0 20px 40px' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)' }}>15+ Product Types</h2>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8 }}>
          {['Ebooks', 'Proxy Accounts', 'Video Courses', 'Software', 'Templates', 'Music', 'Graphics', 'API Keys', 'Memberships', 'Coupons', 'Digital Art', 'Subscriptions'].map((t, i) => (
            <div key={i} style={{ whiteSpace: 'nowrap', padding: '8px 16px', borderRadius: 20, background: 'var(--bg-card)', border: '1px solid var(--border)', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>{t}</div>
          ))}
        </div>
      </section>

      {/* Payment Countries */}
      <section style={{ padding: '0 20px 40px' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)' }}>Payments across Africa</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {['CM', 'SN', 'CI', 'ML', 'BF', 'BJ', 'TG', 'GN', 'CG', 'GA', 'CD', 'NE', 'TD', 'CF', 'GQ', 'GW'].map((c) => (
            <div key={c} style={{ padding: '10px 8px', borderRadius: 8, background: 'var(--bg-card)', border: '1px solid var(--border)', textAlign: 'center', fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500 }}>{c}</div>
          ))}
        </div>
      </section>

      {/* Admin Entry */}
      <section style={{ padding: '0 20px 60px', textAlign: 'center' }}>
        <a href="/adminentry" style={{ color: 'var(--text-muted)', fontSize: 12, textDecoration: 'none' }}>Admin Access</a>
      </section>

      {/* Footer */}
      <footer style={{ padding: '20px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
          <LogoIcon className="w-5 h-5" />
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>SELLIZI</span>
        </div>
        <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Powered by Ashtechpay</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 12 }}>
          <a href="/terms" style={{ fontSize: 11, color: 'var(--text-muted)', textDecoration: 'none' }}>Terms</a>
          <a href="/privacy" style={{ fontSize: 11, color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy</a>
          <a href="/help" style={{ fontSize: 11, color: 'var(--text-muted)', textDecoration: 'none' }}>Help</a>
        </div>
      </footer>

      {/* Service Worker Registration */}
      <script dangerouslySetInnerHTML={{ __html: `
        if ('serviceWorker' in navigator) {
          window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js');
          });
        }
      `}} />
    </div>
  );
}
