'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { UserIcon, BellIcon, ShieldIcon, ChevronLeftIcon } from '@/components/icons';

export default function BuyerSettings() {
  const [name, setName] = useState('');
  const [notifOrders, setNotifOrders] = useState(true);
  const [notifPromos, setNotifPromos] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const save = async () => {
    setLoading(true);
    setMsg('Settings saved');
    setTimeout(() => setMsg(''), 2000);
    setLoading(false);
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>Settings</h1>
      {msg && <div style={{ padding: 12, borderRadius: 8, background: 'rgba(16,185,129,0.1)', color: 'var(--success)', fontSize: 13, marginBottom: 12 }}>{msg}</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Display Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="Your name" />
        </div>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Notifications</h3>
          {[
            { label: 'Order updates', value: notifOrders, set: setNotifOrders },
            { label: 'Promotions', value: notifPromos, set: setNotifPromos },
          ].map((n, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 14, color: 'var(--text-primary)' }}>{n.label}</span>
              <button onClick={() => n.set(!n.value)} className={`toggle-switch ${n.value ? 'active' : ''}`} />
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Security</h3>
          <div><label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Change PIN</label><input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input-field" placeholder="New 5-digit PIN" maxLength={5} /></div>
        </div>
        <button onClick={save} className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: 8 }}>{loading ? 'Saving...' : 'Save Settings'}</button>
      </div>
    </div>
  );
}
