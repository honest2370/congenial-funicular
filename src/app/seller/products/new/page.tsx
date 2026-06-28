'use client';
import { useState } from 'react';
import { supabase, PRODUCT_TYPES, ASHTECHPAY_COUNTRIES, ProductType } from '@/lib/supabase';
import { ChevronLeftIcon, UploadIcon, PlusIcon, TrashIcon, CheckIcon } from '@/components/icons';

interface SlotItem { label: string; value: string }

export default function NewProductPage() {
  const [productType, setProductType] = useState<ProductType>('ebook');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('XAF');
  const [status, setStatus] = useState<'active' | 'draft'>('draft');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Ebook fields
  const [ebookFileUrl, setEbookFileUrl] = useState('');
  const [ebookPages, setEbookPages] = useState('');
  const [ebookFormat, setEbookFormat] = useState('pdf');

  // Proxy account fields
  const [proxyProtocol, setProxyProtocol] = useState('HTTP');
  const [proxyServer, setProxyServer] = useState('');
  const [proxyPort, setProxyPort] = useState('');
  const [proxyUsername, setProxyUsername] = useState('');
  const [proxyPassword, setProxyPassword] = useState('');
  const [proxyRequiresAuth, setProxyRequiresAuth] = useState(true);

  // Generic account fields
  const [accountName, setAccountName] = useState('');
  const [accountSlots, setAccountSlots] = useState<SlotItem[]>([{ label: 'email', value: '' }, { label: 'password', value: '' }]);
  const [customFields, setCustomFields] = useState<SlotItem[]>([]);

  // Video course fields
  const [courseChapters, setCourseChapters] = useState<Array<{ title: string; modules: Array<{ title: string; videoUrl: string; description: string }> }>>([{ title: '', modules: [{ title: '', videoUrl: '', description: '' }] }]);

  // Software license fields
  const [licenseKey, setLicenseKey] = useState('');
  const [licenseType, setLicenseType] = useState('single');
  const [softwareVersion, setSoftwareVersion] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');

  // Template fields
  const [templateFramework, setTemplateFramework] = useState('');
  const [templateDemoUrl, setTemplateDemoUrl] = useState('');
  const [templateFiles, setTemplateFiles] = useState('');

  // Music/Audio fields
  const [audioUrl, setAudioUrl] = useState('');
  const [audioFormat, setAudioFormat] = useState('mp3');
  const [audioDuration, setAudioDuration] = useState('');

  // Graphic/Design fields
  const [designFormat, setDesignFormat] = useState('png');
  const [designDimensions, setDesignDimensions] = useState('');
  const [designFiles, setDesignFiles] = useState('');

  // Text course fields
  const [textChapters, setTextChapters] = useState<Array<{ title: string; content: string }>>([{ title: '', content: '' }]);

  // Membership fields
  const [membershipDuration, setMembershipDuration] = useState('30');
  const [membershipAccessUrl, setMembershipAccessUrl] = useState('');

  // Coupon/Voucher fields
  const [couponCode, setCouponCode] = useState('');
  const [couponValue, setCouponValue] = useState('');
  const [couponExpiry, setCouponExpiry] = useState('');

  // API Key fields
  const [apiKeyValue, setApiKeyValue] = useState('');
  const [apiEndpoint, setApiEndpoint] = useState('');
  const [apiDocs, setApiDocs] = useState('');

  // Digital art fields
  const [artStyle, setArtStyle] = useState('');
  const [artResolution, setArtResolution] = useState('');

  // Subscription fields
  const [subInterval, setSubInterval] = useState('monthly');
  const [subAccessUrl, setSubAccessUrl] = useState('');

  // Custom link fields
  const [customLinkUrl, setCustomLinkUrl] = useState('');
  const [customLinkInstructions, setCustomLinkInstructions] = useState('');

  // Other fields
  const [otherDelivery, setOtherDelivery] = useState('');
  const [otherInstructions, setOtherInstructions] = useState('');

  const addSlot = () => setAccountSlots([...accountSlots, { label: '', value: '' }]);
  const removeSlot = (i: number) => setAccountSlots(accountSlots.filter((_, idx) => idx !== i));
  const updateSlot = (i: number, field: 'label' | 'value', val: string) => {
    const updated = [...accountSlots];
    updated[i] = { ...updated[i], [field]: val };
    setAccountSlots(updated);
  };

  const addCustomField = () => setCustomFields([...customFields, { label: '', value: '' }]);
  const removeCustomField = (i: number) => setCustomFields(customFields.filter((_, idx) => idx !== i));

  const addChapter = () => setCourseChapters([...courseChapters, { title: '', modules: [{ title: '', videoUrl: '', description: '' }] }]);
  const addModule = (ci: number) => {
    const updated = [...courseChapters];
    updated[ci].modules.push({ title: '', videoUrl: '', description: '' });
    setCourseChapters(updated);
  };

  const addTextChapter = () => setTextChapters([...textChapters, { title: '', content: '' }]);

  const getMetadata = () => {
    switch (productType) {
      case 'ebook': return { fileUrl: ebookFileUrl, pages: ebookPages, format: ebookFormat };
      case 'account_proxy': return { protocol: proxyProtocol, server: proxyServer, port: proxyPort, username: proxyUsername, password: proxyPassword, requiresAuth: proxyRequiresAuth };
      case 'account_generic': return { accountName, slots: accountSlots, customFields };
      case 'video_course': return { chapters: courseChapters };
      case 'software_license': return { licenseKey, licenseType, version: softwareVersion, downloadUrl };
      case 'template': return { framework: templateFramework, demoUrl: templateDemoUrl, files: templateFiles };
      case 'music_audio': return { audioUrl, format: audioFormat, duration: audioDuration };
      case 'graphic_design': return { format: designFormat, dimensions: designDimensions, files: designFiles };
      case 'text_course': return { chapters: textChapters };
      case 'membership': return { duration: membershipDuration, accessUrl: membershipAccessUrl };
      case 'coupon_voucher': return { code: couponCode, value: couponValue, expiry: couponExpiry };
      case 'api_key': return { key: apiKeyValue, endpoint: apiEndpoint, docs: apiDocs };
      case 'digital_art': return { style: artStyle, resolution: artResolution };
      case 'subscription': return { interval: subInterval, accessUrl: subAccessUrl };
      case 'custom_link': return { url: customLinkUrl, instructions: customLinkInstructions };
      default: return { delivery: otherDelivery, instructions: otherInstructions };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError('Not authenticated'); setLoading(false); return; }
    const { error: dbError } = await supabase.from('products').insert({
      seller_id: user.id, name, type: productType, description, price: parseFloat(price) || 0, currency, status, image_url: imageUrl, metadata: getMetadata(), delivery_data: getMetadata(), views: 0, sales: 0,
    });
    if (dbError) { setError(dbError.message); setLoading(false); return; }
    setSuccess(true);
    setLoading(false);
  };

  if (success) return (
    <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ width: 64, height: 64, borderRadius: 32, background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
        <span style={{ color: 'var(--success)' }}><CheckIcon className="w-8 h-8" /></span>
      </div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Product Created!</h2>
      <a href="/seller/products" className="btn-primary" style={{ marginTop: 16 }}>View Products</a>
    </div>
  );

  return (
    <div className="page-wrapper animate-fade-in">
      <a href="/seller/products" style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 14, marginBottom: 16 }}>
        <ChevronLeftIcon className="w-4 h-4" /> Products
      </a>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>New Product</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {error && <div style={{ padding: 12, borderRadius: 8, background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', fontSize: 13 }}>{error}</div>}

        {/* Product Type Selection */}
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, display: 'block' }}>Product Type</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {PRODUCT_TYPES.map(t => (
              <button key={t.value} type="button" onClick={() => setProductType(t.value)} style={{ padding: '10px 8px', borderRadius: 8, border: productType === t.value ? '2px solid var(--accent)' : '1px solid var(--border)', background: productType === t.value ? 'var(--accent-light)' : 'var(--bg-card)', cursor: 'pointer', textAlign: 'center', fontSize: 11, fontWeight: 500, color: productType === t.value ? 'var(--accent)' : 'var(--text-secondary)' }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Common Fields */}
        <div>
          <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Product Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="Enter product name" required />
        </div>

        <div>
          <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="input-field" placeholder="Describe your product..." />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Price</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="input-field" placeholder="0" min="0" required />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Currency</label>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="select-field">
              {ASHTECHPAY_COUNTRIES.map(c => <option key={c.code} value={c.currency}>{c.currency} ({c.code})</option>)}
              <option value="USD">USD</option>
            </select>
          </div>
        </div>

        <div>
          <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Product Image URL</label>
          <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="input-field" placeholder="https://..." />
        </div>

        {/* Type-specific fields */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginTop: 8 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--accent)', marginBottom: 12 }}>
            {PRODUCT_TYPES.find(t => t.value === productType)?.label} Details
          </h3>

          {productType === 'ebook' && (
            <>
              <div style={{ marginBottom: 12 }}><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>File URL</label><input type="url" value={ebookFileUrl} onChange={(e) => setEbookFileUrl(e.target.value)} className="input-field" placeholder="https://...pdf" /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Pages</label><input type="number" value={ebookPages} onChange={(e) => setEbookPages(e.target.value)} className="input-field" placeholder="0" /></div>
                <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Format</label><select value={ebookFormat} onChange={(e) => setEbookFormat(e.target.value)} className="select-field"><option value="pdf">PDF</option><option value="epub">EPUB</option><option value="mobi">MOBI</option></select></div>
              </div>
            </>
          )}

          {productType === 'account_proxy' && (
            <>
              <div style={{ marginBottom: 12 }}><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Protocol</label><select value={proxyProtocol} onChange={(e) => setProxyProtocol(e.target.value)} className="select-field"><option value="HTTP">HTTP</option><option value="HTTPS">HTTPS</option><option value="SOCKS4">SOCKS4</option><option value="SOCKS5">SOCKS5</option></select></div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, marginBottom: 12 }}>
                <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Server</label><input type="text" value={proxyServer} onChange={(e) => setProxyServer(e.target.value)} className="input-field" placeholder="proxy.example.com" /></div>
                <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Port</label><input type="number" value={proxyPort} onChange={(e) => setProxyPort(e.target.value)} className="input-field" placeholder="8080" /></div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <button type="button" onClick={() => setProxyRequiresAuth(!proxyRequiresAuth)} className={`toggle-switch ${proxyRequiresAuth ? 'active' : ''}`} />
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Requires Authentication</span>
              </div>
              {proxyRequiresAuth && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Username</label><input type="text" value={proxyUsername} onChange={(e) => setProxyUsername(e.target.value)} className="input-field" placeholder="username" /></div>
                  <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Password</label><input type="text" value={proxyPassword} onChange={(e) => setProxyPassword(e.target.value)} className="input-field" placeholder="password" /></div>
                </div>
              )}
            </>
          )}

          {productType === 'account_generic' && (
            <>
              <div style={{ marginBottom: 12 }}><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Account Name</label><input type="text" value={accountName} onChange={(e) => setAccountName(e.target.value)} className="input-field" placeholder="Netflix, Spotify, etc." /></div>
              <div style={{ marginBottom: 8 }}><label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, display: 'block' }}>Account Slots (credentials)</label></div>
              {accountSlots.map((slot, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input type="text" value={slot.label} onChange={(e) => updateSlot(i, 'label', e.target.value)} className="input-field" placeholder="Label (email, phone, id...)" style={{ flex: 1 }} />
                  <input type="text" value={slot.value} onChange={(e) => updateSlot(i, 'value', e.target.value)} className="input-field" placeholder="Value" style={{ flex: 1.5 }} />
                  {accountSlots.length > 1 && <button type="button" onClick={() => removeSlot(i)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}><TrashIcon className="w-4 h-4" /></button>}
                </div>
              ))}
              <button type="button" onClick={addSlot} className="btn-ghost" style={{ fontSize: 12 }}><PlusIcon className="w-3 h-3" /> Add Slot</button>
              <div style={{ marginTop: 16, marginBottom: 8 }}><label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block' }}>Custom Fields</label></div>
              {customFields.map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input type="text" value={f.label} onChange={(e) => { const u = [...customFields]; u[i] = { ...u[i], label: e.target.value }; setCustomFields(u); }} className="input-field" placeholder="Field name" style={{ flex: 1 }} />
                  <input type="text" value={f.value} onChange={(e) => { const u = [...customFields]; u[i] = { ...u[i], value: e.target.value }; setCustomFields(u); }} className="input-field" placeholder="Field value" style={{ flex: 1.5 }} />
                  <button type="button" onClick={() => removeCustomField(i)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}><TrashIcon className="w-4 h-4" /></button>
                </div>
              ))}
              <button type="button" onClick={addCustomField} className="btn-ghost" style={{ fontSize: 12 }}><PlusIcon className="w-3 h-3" /> Add Field</button>
            </>
          )}

          {productType === 'video_course' && (
            <>
              {courseChapters.map((ch, ci) => (
                <div key={ci} className="card" style={{ padding: 12, marginBottom: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)', marginBottom: 8 }}>Chapter {ci + 1}</div>
                  <input type="text" value={ch.title} onChange={(e) => { const u = [...courseChapters]; u[ci].title = e.target.value; setCourseChapters(u); }} className="input-field" placeholder="Chapter title" style={{ marginBottom: 8 }} />
                  {ch.modules.map((m, mi) => (
                    <div key={mi} style={{ background: 'var(--bg-secondary)', padding: 10, borderRadius: 8, marginBottom: 6 }}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Module {mi + 1}</div>
                      <input type="text" value={m.title} onChange={(e) => { const u = [...courseChapters]; u[ci].modules[mi].title = e.target.value; setCourseChapters(u); }} className="input-field" placeholder="Module title" style={{ marginBottom: 6 }} />
                      <input type="url" value={m.videoUrl} onChange={(e) => { const u = [...courseChapters]; u[ci].modules[mi].videoUrl = e.target.value; setCourseChapters(u); }} className="input-field" placeholder="Video URL (YouTube, Vimeo, etc.)" style={{ marginBottom: 6 }} />
                      <textarea value={m.description} onChange={(e) => { const u = [...courseChapters]; u[ci].modules[mi].description = e.target.value; setCourseChapters(u); }} className="input-field" placeholder="Module description" style={{ minHeight: 60 }} />
                    </div>
                  ))}
                  <button type="button" onClick={() => addModule(ci)} className="btn-ghost" style={{ fontSize: 12 }}><PlusIcon className="w-3 h-3" /> Add Module</button>
                </div>
              ))}
              <button type="button" onClick={addChapter} className="btn-secondary" style={{ fontSize: 13 }}><PlusIcon className="w-4 h-4" /> Add Chapter</button>
            </>
          )}

          {productType === 'software_license' && (
            <>
              <div style={{ marginBottom: 12 }}><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>License Key</label><input type="text" value={licenseKey} onChange={(e) => setLicenseKey(e.target.value)} className="input-field" placeholder="XXXX-XXXX-XXXX" /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>License Type</label><select value={licenseType} onChange={(e) => setLicenseType(e.target.value)} className="select-field"><option value="single">Single User</option><option value="multi">Multi-User</option><option value="site">Site License</option></select></div>
                <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Version</label><input type="text" value={softwareVersion} onChange={(e) => setSoftwareVersion(e.target.value)} className="input-field" placeholder="2.0.1" /></div>
              </div>
              <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Download URL</label><input type="url" value={downloadUrl} onChange={(e) => setDownloadUrl(e.target.value)} className="input-field" placeholder="https://..." /></div>
            </>
          )}

          {productType === 'template' && (
            <>
              <div style={{ marginBottom: 12 }}><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Framework</label><input type="text" value={templateFramework} onChange={(e) => setTemplateFramework(e.target.value)} className="input-field" placeholder="React, Next.js, etc." /></div>
              <div style={{ marginBottom: 12 }}><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Demo URL</label><input type="url" value={templateDemoUrl} onChange={(e) => setTemplateDemoUrl(e.target.value)} className="input-field" placeholder="https://demo..." /></div>
              <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Files URL</label><input type="url" value={templateFiles} onChange={(e) => setTemplateFiles(e.target.value)} className="input-field" placeholder="https://...zip" /></div>
            </>
          )}

          {productType === 'music_audio' && (
            <>
              <div style={{ marginBottom: 12 }}><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Audio URL</label><input type="url" value={audioUrl} onChange={(e) => setAudioUrl(e.target.value)} className="input-field" placeholder="https://...mp3" /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Format</label><select value={audioFormat} onChange={(e) => setAudioFormat(e.target.value)} className="select-field"><option value="mp3">MP3</option><option value="wav">WAV</option><option value="flac">FLAC</option></select></div>
                <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Duration</label><input type="text" value={audioDuration} onChange={(e) => setAudioDuration(e.target.value)} className="input-field" placeholder="3:45" /></div>
              </div>
            </>
          )}

          {productType === 'graphic_design' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Format</label><select value={designFormat} onChange={(e) => setDesignFormat(e.target.value)} className="select-field"><option value="png">PNG</option><option value="svg">SVG</option><option value="psd">PSD</option><option value="ai">AI</option></select></div>
                <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Dimensions</label><input type="text" value={designDimensions} onChange={(e) => setDesignDimensions(e.target.value)} className="input-field" placeholder="1920x1080" /></div>
              </div>
              <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Files URL</label><input type="url" value={designFiles} onChange={(e) => setDesignFiles(e.target.value)} className="input-field" placeholder="https://...zip" /></div>
            </>
          )}

          {productType === 'text_course' && (
            <>
              {textChapters.map((ch, i) => (
                <div key={i} className="card" style={{ padding: 12, marginBottom: 10 }}>
                  <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600, marginBottom: 6 }}>Chapter {i + 1}</div>
                  <input type="text" value={ch.title} onChange={(e) => { const u = [...textChapters]; u[i].title = e.target.value; setTextChapters(u); }} className="input-field" placeholder="Chapter title" style={{ marginBottom: 8 }} />
                  <textarea value={ch.content} onChange={(e) => { const u = [...textChapters]; u[i].content = e.target.value; setTextChapters(u); }} className="input-field" placeholder="Chapter content..." style={{ minHeight: 100 }} />
                </div>
              ))}
              <button type="button" onClick={addTextChapter} className="btn-secondary" style={{ fontSize: 13 }}><PlusIcon className="w-4 h-4" /> Add Chapter</button>
            </>
          )}

          {productType === 'membership' && (
            <>
              <div style={{ marginBottom: 12 }}><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Duration (days)</label><input type="number" value={membershipDuration} onChange={(e) => setMembershipDuration(e.target.value)} className="input-field" placeholder="30" /></div>
              <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Access URL</label><input type="url" value={membershipAccessUrl} onChange={(e) => setMembershipAccessUrl(e.target.value)} className="input-field" placeholder="https://..." /></div>
            </>
          )}

          {productType === 'coupon_voucher' && (
            <>
              <div style={{ marginBottom: 12 }}><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Coupon Code</label><input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} className="input-field" placeholder="SAVE20" /></div>
              <div style={{ marginBottom: 12 }}><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Value</label><input type="text" value={couponValue} onChange={(e) => setCouponValue(e.target.value)} className="input-field" placeholder="20% or $10" /></div>
              <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Expiry Date</label><input type="date" value={couponExpiry} onChange={(e) => setCouponExpiry(e.target.value)} className="input-field" /></div>
            </>
          )}

          {productType === 'api_key' && (
            <>
              <div style={{ marginBottom: 12 }}><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>API Key</label><input type="text" value={apiKeyValue} onChange={(e) => setApiKeyValue(e.target.value)} className="input-field" placeholder="sk-..." /></div>
              <div style={{ marginBottom: 12 }}><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Endpoint</label><input type="url" value={apiEndpoint} onChange={(e) => setApiEndpoint(e.target.value)} className="input-field" placeholder="https://api..." /></div>
              <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Documentation URL</label><input type="url" value={apiDocs} onChange={(e) => setApiDocs(e.target.value)} className="input-field" placeholder="https://docs..." /></div>
            </>
          )}

          {productType === 'digital_art' && (
            <>
              <div style={{ marginBottom: 12 }}><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Style</label><input type="text" value={artStyle} onChange={(e) => setArtStyle(e.target.value)} className="input-field" placeholder="Abstract, Portrait, etc." /></div>
              <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Resolution</label><input type="text" value={artResolution} onChange={(e) => setArtResolution(e.target.value)} className="input-field" placeholder="4096x4096" /></div>
            </>
          )}

          {productType === 'subscription' && (
            <>
              <div style={{ marginBottom: 12 }}><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Billing Interval</label><select value={subInterval} onChange={(e) => setSubInterval(e.target.value)} className="select-field"><option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="yearly">Yearly</option></select></div>
              <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Access URL</label><input type="url" value={subAccessUrl} onChange={(e) => setSubAccessUrl(e.target.value)} className="input-field" placeholder="https://..." /></div>
            </>
          )}

          {productType === 'custom_link' && (
            <>
              <div style={{ marginBottom: 12 }}><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Link URL</label><input type="url" value={customLinkUrl} onChange={(e) => setCustomLinkUrl(e.target.value)} className="input-field" placeholder="https://..." /></div>
              <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Instructions for buyer</label><textarea value={customLinkInstructions} onChange={(e) => setCustomLinkInstructions(e.target.value)} className="input-field" placeholder="How to access the product..." /></div>
            </>
          )}

          {productType === 'other' && (
            <>
              <div style={{ marginBottom: 12 }}><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Delivery Method</label><input type="text" value={otherDelivery} onChange={(e) => setOtherDelivery(e.target.value)} className="input-field" placeholder="How is the product delivered?" /></div>
              <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Instructions</label><textarea value={otherInstructions} onChange={(e) => setOtherInstructions(e.target.value)} className="input-field" placeholder="Instructions for the buyer..." /></div>
            </>
          )}
        </div>

        {/* Status */}
        <div>
          <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8, display: 'block' }}>Status</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['active', 'draft'] as const).map(s => (
              <button key={s} type="button" onClick={() => setStatus(s)} style={{ flex: 1, padding: 10, borderRadius: 8, border: status === s ? '2px solid var(--accent)' : '1px solid var(--border)', background: status === s ? 'var(--accent-light)' : 'var(--bg-card)', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: status === s ? 'var(--accent)' : 'var(--text-secondary)', textTransform: 'capitalize' }}>{s}</button>
            ))}
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: 8 }}>
          {loading ? 'Creating...' : 'Create Product'}
        </button>
      </form>
    </div>
  );
}
