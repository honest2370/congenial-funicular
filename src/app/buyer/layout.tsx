'use client';
import { useState, useEffect, ReactNode } from 'react';
import { useAppStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { LogoIcon, BellIcon, SunIcon, MoonIcon, MenuIcon, XIcon, HomeIcon, ProductsIcon, SettingsIcon, SupportIcon, SwitchIcon, LogoutIcon, BookIcon, PlayIcon, DownloadIcon } from '@/components/icons';

const buyerNav = [
  { label: 'Library', icon: HomeIcon, href: '/buyer' },
  { label: 'Courses', icon: PlayIcon, href: '/buyer?tab=courses' },
  { label: 'Downloads', icon: DownloadIcon, href: '/buyer?tab=downloads' },
  { label: 'More', icon: MenuIcon, href: '#more' },
];

const buyerTools = [
  { label: 'My Library', icon: HomeIcon, href: '/buyer' },
  { label: 'Courses', icon: PlayIcon, href: '/buyer?tab=courses' },
  { label: 'Ebooks', icon: BookIcon, href: '/buyer?tab=ebooks' },
  { label: 'Downloads', icon: DownloadIcon, href: '/buyer?tab=downloads' },
  { label: 'Accounts', icon: ProductsIcon, href: '/buyer?tab=accounts' },
  { label: 'Notifications', icon: BellIcon, href: '/buyer/notifications' },
  { label: 'Support', icon: SupportIcon, href: '/buyer/support' },
  { label: 'Settings', icon: SettingsIcon, href: '/buyer/settings' },
  { label: 'Switch to Seller', icon: SwitchIcon, href: '/seller' },
  { label: 'Help', icon: BookIcon, href: '/help' },
  { label: 'Logout', icon: LogoutIcon, href: '/login' },
];

export default function BuyerLayout({ children }: { children: ReactNode }) {
  const { theme, toggleTheme, sidebarOpen, setSidebarOpen, unreadCount } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', maxWidth: '100vw', overflowX: 'hidden' }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 40, background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <LogoIcon className="w-7 h-7" />
          <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>SELLIZI</span>
          <span className="badge badge-info" style={{ fontSize: 10 }}>Buyer</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={toggleTheme} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 4 }}>
            {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
          </button>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 4, position: 'relative' }}>
            <BellIcon className="w-5 h-5" />
            {unreadCount > 0 && <span style={{ position: 'absolute', top: -2, right: -2, width: 16, height: 16, borderRadius: 8, background: 'var(--danger)', color: 'white', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{unreadCount}</span>}
          </button>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 4 }}>
            <MenuIcon className="w-5 h-5" />
          </button>
        </div>
      </header>

      {sidebarOpen && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99 }} onClick={() => setSidebarOpen(false)} />}
      <div style={{ position: 'fixed', top: 0, left: 0, width: 280, height: '100vh', background: 'var(--bg-sidebar)', zIndex: 100, transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)', transition: 'transform 0.3s ease', overflowY: 'auto', paddingTop: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <LogoIcon className="w-7 h-7" />
            <span style={{ fontSize: 16, fontWeight: 700, color: 'white' }}>SELLIZI</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', padding: 4 }}>
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        <div style={{ padding: '12px 0' }}>
          {buyerTools.map((tool, i) => (
            <a key={i} href={tool.href} onClick={() => setSidebarOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: 13, fontWeight: 500 }}>
              <tool.icon className="w-4 h-4" />
              {tool.label}
            </a>
          ))}
        </div>
      </div>

      <main style={{ paddingBottom: 72 }}>{children}</main>

      <nav className="bottom-nav">
        {buyerNav.map((item, i) => (
          <a key={i} href={item.href} onClick={item.href === '#more' ? (e) => { e.preventDefault(); setSidebarOpen(true); } : undefined} className="bottom-nav-item">
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}
