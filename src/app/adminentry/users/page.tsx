'use client';
import { useState, useEffect } from 'react';
import { supabaseAdmin } from '@/lib/supabase';
import { SearchIcon, UserIcon, ShieldIcon, StoreIcon, EyeIcon, TrashIcon, EditIcon } from '@/components/icons';

export default function AdminUsers() {
  const [users, setUsers] = useState<Array<{ id: string; email: string; name: string | null; role: string; country: string | null; created_at: string; deleted_at: string | null }>>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    async function load() {
      try {
        const { data } = await supabaseAdmin.from('profiles').select('*').order('created_at', { ascending: false });
        setUsers(data || []);
      } catch (e) {}
      setLoading(false);
    }
    load();
  }, []);

  const filtered = users.filter(u => {
    if (filter !== 'all' && u.role !== filter) return false;
    if (search && !u.email.toLowerCase().includes(search.toLowerCase()) && !(u.name || '').toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const toggleRole = async (id: string, role: string) => {
    const newRole = role === 'seller' ? 'buyer' : 'seller';
    await supabaseAdmin.from('profiles').update({ role: newRole }).eq('id', id);
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
  };

  const softDelete = async (id: string) => {
    if (!confirm('Soft-delete this user?')) return;
    await supabaseAdmin.from('profiles').update({ deleted_at: new Date().toISOString() }).eq('id', id);
    setUsers(prev => prev.map(u => u.id === id ? { ...u, deleted_at: new Date().toISOString() } : u));
  };

  if (loading) return <div className="page-wrapper"><div className="shimmer" style={{ width: '100%', height: 200, borderRadius: 12 }} /></div>;

  return (
    <div className="page-wrapper animate-fade-in">
      <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>User Management</h1>

      <div style={{ position: 'relative', marginBottom: 12 }}>
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><SearchIcon className="w-4 h-4" /></span>
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="input-field" placeholder="Search users..." style={{ paddingLeft: 40 }} />
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {['all', 'seller', 'buyer', 'admin'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`tab-item ${filter === f ? 'active' : ''}`} style={{ textTransform: 'capitalize' }}>{f}</button>
        ))}
      </div>

      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>{filtered.length} users</div>

      {filtered.map(u => (
        <div key={u.id} className="card" style={{ padding: 14, marginBottom: 8 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 20, background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <UserIcon className="w-5 h-5" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{u.name || 'No name'}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{u.email}</div>
                </div>
                <span className={`badge ${u.role === 'admin' ? 'badge-danger' : u.role === 'seller' ? 'badge-info' : 'badge-success'}`}>{u.role}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{u.country || 'No country'} | {new Date(u.created_at).toLocaleDateString()}</div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button onClick={() => toggleRole(u.id, u.role)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, fontSize: 10 }} title="Toggle role">
                    <span style={{ color: 'var(--accent)' }}>Switch Role</span>
                  </button>
                  <button onClick={() => softDelete(u.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', padding: 4 }} title="Delete"><TrashIcon className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
