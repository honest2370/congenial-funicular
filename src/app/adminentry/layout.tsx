'use client';
import { useState, useEffect, ReactNode } from 'react';
import { useAppStore } from '@/lib/store';
import {
  LogoIcon, SunIcon, MoonIcon, MenuIcon, XIcon, BellIcon,
  HomeIcon, UserIcon, ProductsIcon, WalletIcon, BroadcastIcon,
  SettingsIcon, SupportIcon, AnalyticsIcon, ShieldIcon, KeyIcon,
  SearchIcon, MailIcon, CodeIcon, DollarIcon, StoreIcon, ZapIcon,
  LogoutIcon, EditIcon, GlobeIcon
} from '@/components/icons';

const adminNav = [
  { label: 'Dashboard', icon: HomeIcon, href: '/adminentry' },
  { label: 'Users', icon: UserIcon, href: '/adminentry/users' },
  { label: 'Products', icon: ProductsIcon, href: '/adminentry/products' },
  { label: 'Payments', icon: WalletIcon, href: '/adminentry/payments' },
  { label: 'More', icon: MenuIcon, href: '#more' },
];

const adminTools = [
  { label: 'Dashboard', icon: HomeIcon, href: '/adminentry' },
  { label: 'User Management', icon: UserIcon, href: '/adminentry/users' },
  { label: 'Product Oversight', icon: ProductsIcon, href: '/adminentry/products' },
  { label: 'Payment Monitoring', icon: WalletIcon, href: '/adminentry/payments' },
  { label: 'Broadcasts', icon: BroadcastIcon, href: '/adminentry/broadcasts' },
  { label: 'Support Tickets', icon: SupportIcon, href: '/adminentry/support' },
  { label: 'Platform Analytics', icon: AnalyticsIcon, href: '/adminentry/analytics' },
  { label: 'AI Configuration', icon: ZapIcon, href: '/adminentry/settings?tab=ai' },
  { label: 'Ashtechpay Config', icon: DollarIcon, href: '/adminentry/settings?tab=ashtechpay' },
  { label: 'Admin Settings', icon: SettingsIcon, href: '/adminentry/settings' },
  { label: 'API Keys', icon: KeyIcon, href: '/adminentry/settings?tab=api' },
  { label: 'SEO Settings', icon: SearchIcon, href: '/adminentry/settings?tab=seo' },
  { label: 'Email Templates', icon: MailIcon, href: '/adminentry/settings?tab=email' },
  { label: 'Store Themes', icon: StoreIcon, href: '/adminentry/settings?tab=themes' },
  { label: 'Legal Pages', icon: EditIcon, href: '/adminentry/settings?tab=legal' },
  { label: 'Feature Flags', icon: CodeIcon, href: '/adminentry/settings?tab=features' },
  { label: 'Webhooks', icon: CodeIcon, href: '/adminentry/settings?tab=webhooks' },
  { label: 'Push Notifications', icon: BellIcon, href: '/adminentry/settings?tab=push' },
  { label: 'Country Settings', icon: GlobeIcon, href: '/adminentry/settings?tab=countries' },
  { label: 'Security', icon: ShieldIcon, href: '/adminentry/settings?tab=security' },
  { label: 'Logout', icon: LogoutIcon, href: '/login' },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { theme, toggleTheme, sidebarOpen, setSidebarOpen } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', maxWidth: '100vw', overflowX: 'hidden' }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 40, background: '#0a0e1a', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <LogoIcon className="w-7 h-7" />
          <span style={{ fontSize: 16, fontWeight: 700, color: 'white' }}>SELLIZI</span>
          <span className="badge badge-danger" style={{ fontSize: 10 }}>Admin</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={toggleTheme} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', padding: 4 }}>
            {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
          </button>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', padding: 4 }}>
            <MenuIcon className="w-5 h-5" />
          </button>
        </div>
      </header>

      {sidebarOpen && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99 }} onClick={() => setSidebarOpen(false)} />}
      <div style={{ position: 'fixed', top: 0, left: 0, width: 280, height: '100vh', background: '#060a14', zIndex: 100, transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)', transition: 'transform 0.3s ease', overflowY: 'auto', paddingTop: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <LogoIcon className="w-7 h-7" />
            <span style={{ fontSize: 16, fontWeight: 700, color: 'white' }}>Admin Panel</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', padding: 4 }}>
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        <div style={{ padding: '12px 0' }}>
          {adminTools.map((tool, i) => (
            <a key={i} href={tool.href} onClick={() => setSidebarOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: 13, fontWeight: 500 }}>
              <tool.icon className="w-4 h-4" />
              {tool.label}
            </a>
          ))}
        </div>
      </div>

      <main style={{ paddingBottom: 72 }}>{children}</main>

      <nav className="bottom-nav" style={{ background: '#0a0e1a', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        {adminNav.map((item, i) => (
          <a key={i} href={item.href} onClick={item.href === '#more' ? (e) => { e.preventDefault(); setSidebarOpen(true); } : undefined} className="bottom-nav-item" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}
