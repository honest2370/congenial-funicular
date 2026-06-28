'use client';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { SupportIcon, PlusIcon, SendIcon, PaperclipIcon, XIcon } from '@/components/icons';

export default function SellerSupport() {
  const [tickets, setTickets] = useState<Array<{ id: string; subject: string; status: string; created_at: string; updated_at: string }>>([]);
  const [tab, setTab] = useState<'open' | 'closed'>('open');
  const [showNew, setShowNew] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<{ id: string; sender_role: string; message: string; attachment_url: string | null; created_at: string }>>([]);
  const [newMsg, setNewMsg] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(true);
  const msgEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { data } = await supabase.from('support_tickets').select('*').eq('user_id', user.id).order('updated_at', { ascending: false });
      setTickets(data || []);
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    if (!selectedTicket) return;
    async function loadMsgs() {
      const { data } = await supabase.from('ticket_messages').select('*').eq('ticket_id', selectedTicket).order('created_at', { ascending: true });
      setMessages(data || []);
    }
    loadMsgs();
    const channel = supabase.channel(`ticket-${selectedTicket}`).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'ticket_messages', filter: `ticket_id=eq.${selectedTicket}` }, (payload) => {
      setMessages(prev => [...prev, payload.new as typeof messages[0]]);
    }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [selectedTicket]);

  useEffect(() => { msgEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const createTicket = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !subject) return;
    const { data } = await supabase.from('support_tickets').insert({ user_id: user.id, subject, status: 'open' }).select();
    if (data) { setTickets([data[0], ...tickets]); setShowNew(false); setSubject(''); setSelectedTicket(data[0].id); }
  };

  const sendMessage = async () => {
    if (!newMsg.trim() || !selectedTicket) return;
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('ticket_messages').insert({ ticket_id: selectedTicket, sender_id: user!.id, sender_role: 'user', message: newMsg, attachment_url: null });
    setNewMsg('');
  };

  const closeTicket = async () => {
    if (!selectedTicket) return;
    await supabase.from('support_tickets').update({ status: 'closed' }).eq('id', selectedTicket);
    setTickets(prev => prev.map(t => t.id === selectedTicket ? { ...t, status: 'closed' } : t));
    setSelectedTicket(null);
  };

  const filtered = tickets.filter(t => t.status === tab);

  // Chat view
  if (selectedTicket) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 130px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg-card)' }}>
          <button onClick={() => setSelectedTicket(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><XIcon className="w-5 h-5" /></button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{tickets.find(t => t.id === selectedTicket)?.subject}</div>
            <span className={`badge ${tickets.find(t => t.id === selectedTicket)?.status === 'open' ? 'badge-success' : 'badge-danger'}`}>{tickets.find(t => t.id === selectedTicket)?.status}</span>
          </div>
          {tickets.find(t => t.id === selectedTicket)?.status === 'open' && (
            <button onClick={closeTicket} className="btn-ghost" style={{ fontSize: 12, color: 'var(--danger)' }}>Close</button>
          )}
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {messages.map(m => (
            <div key={m.id} style={{ display: 'flex', justifyContent: m.sender_role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{ maxWidth: '80%', padding: '10px 14px', borderRadius: 12, background: m.sender_role === 'user' ? 'var(--accent)' : m.sender_role === 'admin' ? 'var(--success)' : 'var(--bg-card)', color: m.sender_role === 'user' ? 'white' : 'var(--text-primary)', border: m.sender_role !== 'user' ? '1px solid var(--border)' : 'none', fontSize: 13, lineHeight: 1.5 }}>
                {m.sender_role !== 'user' && <div style={{ fontSize: 10, fontWeight: 600, marginBottom: 4, textTransform: 'capitalize', color: m.sender_role === 'admin' ? 'var(--success)' : 'var(--accent)' }}>{m.sender_role}</div>}
                {m.message}
                {m.attachment_url && <div style={{ marginTop: 6 }}><a href={m.attachment_url} target="_blank" style={{ fontSize: 11, color: m.sender_role === 'user' ? 'rgba(255,255,255,0.8)' : 'var(--accent)' }}>Attachment</a></div>}
              </div>
            </div>
          ))}
          <div ref={msgEndRef} />
        </div>
        <div style={{ display: 'flex', gap: 8, padding: '12px 16px', borderTop: '1px solid var(--border)', background: 'var(--bg-card)' }}>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><PaperclipIcon className="w-5 h-5" /></button>
          <input type="text" value={newMsg} onChange={(e) => setNewMsg(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} className="input-field" placeholder="Type a message..." style={{ flex: 1 }} />
          <button onClick={sendMessage} style={{ background: 'var(--accent)', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', color: 'white' }}><SendIcon className="w-4 h-4" /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>Support</h1>
        <button onClick={() => setShowNew(!showNew)} className="btn-primary" style={{ padding: '8px 16px', fontSize: 13 }}><PlusIcon className="w-4 h-4" /> New Ticket</button>
      </div>

      {showNew && (
        <div className="card" style={{ padding: 16, marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Create Support Ticket</h3>
          <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className="input-field" placeholder="Subject (e.g. Payment issue, Subscription problem)" style={{ marginBottom: 12 }} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={createTicket} className="btn-primary" style={{ flex: 1 }}>Create Ticket</button>
            <button onClick={() => setShowNew(false)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button onClick={() => setTab('open')} className={`tab-item ${tab === 'open' ? 'active' : ''}`}>Open ({tickets.filter(t => t.status === 'open').length})</button>
        <button onClick={() => setTab('closed')} className={`tab-item ${tab === 'closed' ? 'active' : ''}`}>Closed ({tickets.filter(t => t.status === 'closed').length})</button>
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ padding: 32, textAlign: 'center' }}>
          <span style={{ color: 'var(--text-muted)' }}><SupportIcon className="w-12 h-12" /></span>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 12 }}>No {tab} tickets</p>
        </div>
      ) : filtered.map(t => (
        <div key={t.id} className="card" style={{ padding: 14, marginBottom: 8, cursor: 'pointer' }} onClick={() => setSelectedTicket(t.id)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{t.subject}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{new Date(t.created_at).toLocaleDateString()}</div>
            </div>
            <span className={`badge ${t.status === 'open' ? 'badge-success' : 'badge-danger'}`}>{t.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
