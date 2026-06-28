import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'SELLIZI — Digital Commerce Platform',
  description: 'Sell digital products, courses, accounts, and more across Africa with Ashtechpay.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/icon-512.png',
  },
  openGraph: {
    title: 'SELLIZI — Digital Commerce Platform',
    description: 'Sell digital products, courses, accounts, and more across Africa.',
    url: 'https://sellizi.vercel.app',
    siteName: 'SELLIZI',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'SELLIZI' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SELLIZI — Digital Commerce Platform',
    description: 'Sell digital products, courses, accounts, and more across Africa.',
    images: ['/og-image.png'],
  },
  keywords: 'sellizi, digital products, ebooks, courses, accounts, africa, ashtechpay, mobile money',
  other: {
    'google-site-verification': 'placeholder',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0a0e1a',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://sellizi.vercel.app" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="SELLIZI" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                try {
                  var t = localStorage.getItem('sellizi-theme');
                  if (t === 'light') document.documentElement.classList.remove('dark');
                  else document.documentElement.classList.add('dark');
                } catch(e){}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        {children}
      </body>
    </html>
  );
}
