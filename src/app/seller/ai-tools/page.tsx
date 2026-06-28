'use client';
import { useState } from 'react';
import { ZapIcon, BookIcon, ProductsIcon, MailIcon, ChartIcon, TrendUpIcon, FileTextIcon, CopyIcon } from '@/components/icons';

const aiTools = [
  { id: 'desc', label: 'Product Description', icon: FileTextIcon, desc: 'Generate compelling product descriptions using AI' },
  { id: 'email', label: 'Email Writer', icon: MailIcon, desc: 'Craft marketing emails that convert' },
  { id: 'seo', label: 'SEO Optimizer', icon: ChartIcon, desc: 'Optimize product titles and meta descriptions' },
  { id: 'pricing', label: 'Price Advisor', icon: TrendUpIcon, desc: 'AI-powered pricing recommendations' },
  { id: 'ad', label: 'Ad Copy', icon: ZapIcon, desc: 'Create social media ad copy' },
  { id: 'blog', label: 'Blog Writer', icon: BookIcon, desc: 'Generate blog posts for your store' },
];

export default function SellerAITools() {
  const [active, setActive] = useState('desc');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!input) return;
    setLoading(true);
    // Simulate AI generation
    await new Promise(r => setTimeout(r, 1500));
    const outputs: Record<string, string> = {
      desc: `Introducing "${input}" - the ultimate solution for your digital needs. This premium product delivers exceptional value with instant delivery and 24/7 access. Perfect for professionals and enthusiasts alike. Get yours today and experience the difference!`,
      email: `Subject: Exciting News - ${input} is Here!\n\nHi [Name],\n\nWe're thrilled to announce the launch of ${input}. This is your chance to get early access at a special price.\n\nDon't miss out - click below to learn more!\n\nBest regards,\nYour SELLIZI Store`,
      seo: `Title: ${input} | Premium Digital Product\nMeta Description: Get ${input} at the best price. Instant delivery, secure payment via Ashtechpay. Shop now!\nKeywords: ${input.toLowerCase()}, digital product, buy online, africa`,
      pricing: `Based on market analysis for "${input}":\n\nRecommended Price Range: 2,000 - 5,000 XAF\nOptimal Price Point: 3,500 XAF\nThis price maximizes both conversion rate and revenue per sale.`,
      ad: `Stop scrolling! ${input} is now available.\n\nGet instant access to this premium digital product. Secure payment with Mobile Money.\n\nShop now >>`,
      blog: `# Why ${input} is a Game-Changer\n\nIn today's digital landscape, having the right tools matters. ${input} provides everything you need to succeed...\n\n## Key Benefits\n- Instant delivery\n- Affordable pricing\n- Secure payment via Mobile Money\n\n## Get Started\nVisit our store to purchase ${input} today.`,
    };
    setOutput(outputs[active] || `AI-generated content for: ${input}`);
    setLoading(false);
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>AI Tools</h1>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>Powered by AI to supercharge your sales</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
        {aiTools.map(t => (
          <button key={t.id} onClick={() => { setActive(t.id); setOutput(''); }} style={{ padding: 14, borderRadius: 10, border: active === t.id ? '2px solid var(--accent)' : '1px solid var(--border)', background: active === t.id ? 'var(--accent-light)' : 'var(--bg-card)', cursor: 'pointer', textAlign: 'left' }}>
            <span style={{ color: active === t.id ? 'var(--accent)' : 'var(--text-secondary)' }}><t.icon className="w-5 h-5" /></span>
            <div style={{ fontSize: 12, fontWeight: 600, color: active === t.id ? 'var(--accent)' : 'var(--text-primary)', marginTop: 6 }}>{t.label}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2, lineHeight: 1.3 }}>{t.desc}</div>
          </button>
        ))}
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Product / Topic</label>
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} className="input-field" placeholder="Enter product name or topic..." />
      </div>

      <button onClick={generate} className="btn-primary" disabled={loading} style={{ width: '100%', marginBottom: 16 }}>
        {loading ? 'Generating...' : <><ZapIcon className="w-4 h-4" /> Generate</>}
      </button>

      {output && (
        <div className="card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Result</span>
            <button onClick={() => navigator.clipboard.writeText(output)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><CopyIcon className="w-4 h-4" /></button>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{output}</div>
        </div>
      )}
    </div>
  );
}
