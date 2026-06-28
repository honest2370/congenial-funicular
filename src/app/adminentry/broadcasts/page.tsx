'use client';
import { useState, useEffect } from 'react';
import { supabaseAdmin } from '@/lib/supabase';
import { BroadcastIcon, PlusIcon, MailIcon, BellIcon, EyeIcon } from '@/components/icons';

export default function AdminBroadcasts() {
  const [broadcasts, setBroadcasts] = useState<Array<{ id: string; type: string; title: string; message: string; target: string; created_at: string }>>([]);
  const [showNew, setShowNew] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'info' | 'promo' | 'alert'>('info');
  const [target, setTarget] = useState('all');
  const [targetEmail, setTargetEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await supabaseAdmin.from('broadcasts').select('*').order('created_at', { ascending: false });
        setBroadcasts(data || []);
      } catch (e) {}
      setLoading(false);
    }
    load();
  }, []);

  const sendBroadcast = async () => {
    if (!title || !message) return;
    const finalTarget = target === 'email' ? targetEmail : target;
    try {
      const { data } = await supabaseAdmin.from('broadcasts').insert({ admin_id: 'admin', type, title, message, target: finalTarget }).select();
      if (data) {
        setBroadcasts([data[0], ...broadcasts]);
        // Create notifications for target users
        if (target === 'all') {
          const { data: users } = await supabaseAdmin.from('profiles').select('id');
          if (users) {
            const notifs = users.map(u => ({ user_id: u.id, type: 'broadcast', title, message, read: false }));
            await supabaseAdmin.from('notifications').insert(notifs);
          }
        } else if (target === 'email' && targetEmail) {
          const { data: user } = await supabaseAdmin.from('profiles').select('id').eq('email', targetEmail).single();
          if (user) {
            await supabaseAdmin.from('notifications').insert({ user_id: user.id, type: 'broadcast', title, message, read: false });
          }
        }
        setShowNew(false); setTitle(''); setMessage('');
      }
    } catch (e) {}
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>Broadcasts</h1>
        <button onClick={() => setShowNew(!showNew)} className="btn-primary" style={{ padding: '8px 16px', fontSize: 13 }}><PlusIcon className="w-4 h-4" /> New</button>
      </div>

      {showNew && (
        <div className="card" style={{ padding: 16, marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Send Broadcast</h3>
          <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
            {(['info', 'promo', 'alert'] as const).map(t => (
              <button key={t} onClick={() => setType(t)} className={`tab-item ${type === t ? 'active' : ''}`} style={{ textTransform: 'capitalize' }}>{t}</button>
            ))}
          </div>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" placeholder="Broadcast title" style={{ marginBottom: 8 }} />
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="input-field" placeholder="Broadcast message..." style={{ marginBottom: 8, minHeight: 80 }} />
          <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
            {['all', 'sellers', 'buyers', 'email'].map(t => (
              <button key={t} onClick={() => setTarget(t)} className={`tab-item ${target === t ? 'active' : ''}`} style={{ textTransform: 'capitalize', fontSize: 11 }}>{t}</button>
            ))}
          </div>
          {target === 'email' && <input type="email" value={targetEmail} onChange={(e) => setTargetEmail(e.target.value)} className="input-field" placeholder="Target user email" style={{ marginBottom: 8 }} />}
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={sendBroadcast} className="btn-primary" style={{ flex: 1 }}>Send Broadcast</button>
            <button onClick={() => setShowNew(false)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      )}

      {broadcasts.length === 0 ? (
        <div className="card" style={{ padding: 32, textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>No broadcasts yet</p>
        </div>
      ) : broadcasts.map(b => (
        <div key={b.id} className="card" style={{ padding: 14, marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className={`badge ${b.type === 'alert' ? 'badge-danger' : b.type === 'promo' ? 'badge-warning' : 'badge-info'}`}>{b.type}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{b.title}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.5 }}>{b.message}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>Target: {b.target} | {new Date(b.created_at).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
