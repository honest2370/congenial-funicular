'use client';
import { useState, useEffect, ReactNode } from 'react';
import { useAppStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import {
  LogoIcon, BellIcon, SunIcon, MoonIcon, MenuIcon, XIcon,
  HomeIcon, ProductsIcon, AnalyticsIcon, MarketingIcon, SettingsIcon,
  SupportIcon, WalletIcon, AffiliateIcon, StoreIcon, SalesIcon,
  VisitorsIcon, ChartIcon, GlobeIcon, ShareIcon, TagIcon, LinkIcon,
  ShieldIcon, MailIcon, EditIcon, BookIcon, ZapIcon, TargetIcon,
  BarChartIcon, CopyIcon, SearchIcon, SwitchIcon, LogoutIcon,
  TrendUpIcon, CouponIcon, BroadcastIcon, FilterIcon, RefreshIcon,
  PackageIcon, KeyIcon, AwardIcon, PaletteIcon, CodeIcon,
  ImageIcon, MusicIcon, PlayIcon, FileTextIcon, LayoutIcon
} from '@/components/icons';

const sellerNav = [
  { label: 'Home', icon: HomeIcon, href: '/seller' },
  { label: 'Products', icon: ProductsIcon, href: '/seller/products' },
  { label: 'Analytics', icon: AnalyticsIcon, href: '/seller/analytics' },
  { label: 'Marketing', icon: MarketingIcon, href: '/seller/marketing' },
  { label: 'More', icon: MenuIcon, href: '#more' },
];

const sellerTools = [
  { label: 'Dashboard', icon: HomeIcon, href: '/seller' },
  { label: 'Products', icon: ProductsIcon, href: '/seller/products' },
  { label: 'New Product', icon: PlusIcon, href: '/seller/products/new' },
  { label: 'Sales', icon: SalesIcon, href: '/seller/sales' },
  { label: 'Analytics', icon: AnalyticsIcon, href: '/seller/analytics' },
  { label: 'Visitors', icon: VisitorsIcon, href: '/seller/analytics?tab=visitors' },
  { label: 'Conversion', icon: TargetIcon, href: '/seller/analytics?tab=conversion' },
  { label: 'Link Traffic', icon: GlobeIcon, href: '/seller/analytics?tab=traffic' },
  { label: 'Marketing Hub', icon: MarketingIcon, href: '/seller/marketing' },
  { label: 'Affiliate Links', icon: AffiliateIcon, href: '/seller/marketing?tab=affiliate' },
  { label: 'Coupons', icon: CouponIcon, href: '/seller/marketing?tab=coupons' },
  { label: 'Email Campaigns', icon: MailIcon, href: '/seller/marketing?tab=email' },
  { label: 'Social Sharing', icon: ShareIcon, href: '/seller/marketing?tab=social' },
  { label: 'SEO Tools', icon: SearchIcon, href: '/seller/marketing?tab=seo' },
  { label: 'Referral Program', icon: ShareIcon, href: '/seller/marketing?tab=referral' },
  { label: 'Payouts', icon: WalletIcon, href: '/seller/payouts' },
  { label: 'Store Settings', icon: StoreIcon, href: '/seller/settings/store' },
  { label: 'Store Design', icon: PaletteIcon, href: '/seller/settings/design' },
  { label: 'Custom Domain', icon: GlobeIcon, href: '/seller/settings/domain' },
  { label: 'Currencies', icon: DollarIcon, href: '/seller/settings/currencies' },
  { label: 'Delivery', icon: PackageIcon, href: '/seller/settings/delivery' },
  { label: 'Legal Pages', icon: FileTextIcon, href: '/seller/settings/legal' },
  { label: 'Support Channels', icon: SupportIcon, href: '/seller/settings/support-channels' },
  { label: 'Profile', icon: EditIcon, href: '/seller/settings/profile' },
  { label: 'Notifications', icon: BellIcon, href: '/seller/settings/notifications' },
  { label: 'Security', icon: ShieldIcon, href: '/seller/settings/security' },
  { label: 'Support Tickets', icon: SupportIcon, href: '/seller/support' },
  { label: 'AI Tools', icon: ZapIcon, href: '/seller/ai-tools' },
  { label: 'Price Optimization', icon: TrendUpIcon, href: '/seller/marketing?tab=pricing' },
  { label: 'Abandoned Cart', icon: ShoppingCartIcon, href: '/seller/marketing?tab=cart' },
  { label: 'Customer Segments', icon: VisitorsIcon, href: '/seller/analytics?tab=segments' },
  { label: 'Product Reviews', icon: StarIcon, href: '/seller/products?tab=reviews' },
  { label: 'Inventory Alerts', icon: BellIcon, href: '/seller/products?tab=alerts' },
  { label: 'Export Data', icon: DownloadIcon, href: '/seller/settings?tab=export' },
  { label: 'Webhooks', icon: CodeIcon, href: '/seller/settings?tab=webhooks' },
  { label: 'Subscription', icon: AwardIcon, href: '/seller/subscription' },
  { label: 'Switch to Buyer', icon: SwitchIcon, href: '/buyer' },
  { label: 'Help', icon: BookIcon, href: '/help' },
  { label: 'Logout', icon: LogoutIcon, href: '/login' },
];

function PlusIcon(p: { className?: string }) {
  return <svg className={p.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
}
function DollarIcon(p: { className?: string }) {
  return <svg className={p.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>;
}
function ShoppingCartIcon(p: { className?: string }) {
  return <svg className={p.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>;
}
function StarIcon(p: { className?: string }) {
  return <svg className={p.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
}
function DownloadIcon(p: { className?: string }) {
  return <svg className={p.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
}

export default function SellerLayout({ children }: { children: ReactNode }) {
  const { theme, toggleTheme, sidebarOpen, setSidebarOpen, unreadCount, user, setUser } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUser({ id: data.user.id, email: data.user.email || '', role: 'seller', name: data.user.user_metadata?.name || '' });
    });
  }, [setUser]);

  if (!mounted) return null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', maxWidth: '100vw', overflowX: 'hidden' }}>
      {/* Top Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 40, background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <LogoIcon className="w-7 h-7" />
          <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>SELLIZI</span>
          <span className="badge badge-info" style={{ fontSize: 10 }}>Seller</span>
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

      {/* Side Drawer */}
      {sidebarOpen && <div className="overlay visible" onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99 }} />}
      <div className={`drawer ${sidebarOpen ? 'open' : ''}`} style={{ position: 'fixed', top: 0, left: 0, width: 280, height: '100vh', background: 'var(--bg-sidebar)', zIndex: 100, transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)', transition: 'transform 0.3s ease', overflowY: 'auto', paddingTop: 20 }}>
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
          {sellerTools.map((tool, i) => (
            <a key={i} href={tool.href} onClick={() => setSidebarOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: 13, fontWeight: 500, transition: 'all 0.2s' }}>
              <tool.icon className="w-4 h-4" />
              {tool.label}
            </a>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main style={{ paddingBottom: 72 }}>
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        {sellerNav.map((item, i) => (
          <a key={i} href={item.href} onClick={item.href === '#more' ? (e) => { e.preventDefault(); setSidebarOpen(true); } : undefined} className={`bottom-nav-item ${typeof window !== 'undefined' && window.location.pathname === item.href ? 'active' : ''}`}>
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}
