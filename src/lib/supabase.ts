import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export type Database = {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: ProfileInsert; Update: ProfileUpdate };
      products: { Row: Product; Insert: ProductInsert; Update: ProductUpdate };
      orders: { Row: Order; Insert: OrderInsert; Update: OrderUpdate };
      notifications: { Row: Notification; Insert: NotificationInsert };
      support_tickets: { Row: SupportTicket; Insert: SupportTicketInsert; Update: SupportTicketUpdate };
      ticket_messages: { Row: TicketMessage; Insert: TicketMessageInsert };
      broadcasts: { Row: Broadcast; Insert: BroadcastInsert };
      store_settings: { Row: StoreSettings; Insert: StoreSettingsInsert; Update: StoreSettingsUpdate };
      analytics_events: { Row: AnalyticsEvent; Insert: AnalyticsEventInsert };
      affiliate_links: { Row: AffiliateLink; Insert: AffiliateLinkInsert };
      buyer_accounts: { Row: BuyerAccount; Insert: BuyerAccountInsert };
      product_access: { Row: ProductAccess; Insert: ProductAccessInsert };
      subscriptions: { Row: Subscription; Insert: SubscriptionInsert; Update: SubscriptionUpdate };
      admin_settings: { Row: AdminSettings; Insert: AdminSettingsInsert; Update: AdminSettingsUpdate };
    };
  };
};

// Types
export interface Profile {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  country: string | null;
  role: 'admin' | 'seller' | 'buyer';
  avatar_url: string | null;
  username: string | null;
  bio: string | null;
  whatsapp: string | null;
  created_at: string;
  deleted_at: string | null;
  notif_orders: boolean;
  notif_price_drops: boolean;
  notif_promos: boolean;
  dark_mode: boolean;
}
export type ProfileInsert = Omit<Profile, 'created_at' | 'deleted_at'>;
export type ProfileUpdate = Partial<ProfileInsert>;

export interface Product {
  id: string;
  seller_id: string;
  name: string;
  type: ProductType;
  description: string | null;
  price: number;
  currency: string;
  image_url: string | null;
  status: 'active' | 'draft' | 'paused' | 'archived';
  metadata: Record<string, unknown>;
  delivery_data: Record<string, unknown>;
  views: number;
  sales: number;
  created_at: string;
  updated_at: string;
}
export type ProductInsert = Omit<Product, 'id' | 'views' | 'sales' | 'created_at' | 'updated_at'>;
export type ProductUpdate = Partial<ProductInsert> & { views?: number; sales?: number };

export type ProductType =
  | 'ebook' | 'account_proxy' | 'account_generic' | 'video_course'
  | 'software_license' | 'template' | 'music_audio' | 'graphic_design'
  | 'text_course' | 'membership' | 'coupon_voucher' | 'api_key'
  | 'digital_art' | 'subscription' | 'custom_link' | 'other';

export interface Order {
  id: string;
  buyer_email: string;
  product_id: string;
  seller_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'success' | 'failed';
  payment_ref: string | null;
  ashtechpay_ref: string | null;
  ashtechpay_txn_id: string | null;
  created_at: string;
  confirmed_at: string | null;
}
export type OrderInsert = Omit<Order, 'id' | 'created_at' | 'confirmed_at'>;
export type OrderUpdate = Partial<OrderInsert>;

export interface Notification {
  id: string;
  user_id: string;
  type: 'order' | 'payment' | 'broadcast' | 'support' | 'system';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}
export type NotificationInsert = Omit<Notification, 'id' | 'created_at'>;

export interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  status: 'open' | 'closed';
  created_at: string;
  updated_at: string;
}
export type SupportTicketInsert = Omit<SupportTicket, 'id' | 'created_at' | 'updated_at'>;
export type SupportTicketUpdate = Partial<Pick<SupportTicket, 'status'>>;

export interface TicketMessage {
  id: string;
  ticket_id: string;
  sender_id: string;
  sender_role: 'user' | 'admin' | 'assistant';
  message: string;
  attachment_url: string | null;
  created_at: string;
}
export type TicketMessageInsert = Omit<TicketMessage, 'id' | 'created_at'>;

export interface Broadcast {
  id: string;
  admin_id: string;
  type: 'info' | 'promo' | 'alert';
  title: string;
  message: string;
  target: 'all' | string;
  created_at: string;
}
export type BroadcastInsert = Omit<Broadcast, 'id' | 'created_at'>;

export interface StoreSettings {
  id: string;
  seller_id: string;
  name: string | null;
  logo_url: string | null;
  currency: string;
  social_links: Record<string, string>;
  custom_domain: string | null;
  slug: string | null;
  delivery_settings: Record<string, unknown>;
  design_settings: Record<string, unknown>;
  support_channels: Record<string, string>;
  legal_pages: Record<string, string>;
  created_at: string;
}
export type StoreSettingsInsert = Omit<StoreSettings, 'id' | 'created_at'>;
export type StoreSettingsUpdate = Partial<StoreSettingsInsert>;

export interface AnalyticsEvent {
  id: string;
  product_id: string | null;
  seller_id: string;
  event_type: 'view' | 'purchase' | 'click' | 'share' | 'affiliate_click';
  referrer: string | null;
  visitor_id: string;
  created_at: string;
}
export type AnalyticsEventInsert = Omit<AnalyticsEvent, 'id' | 'created_at'>;

export interface AffiliateLink {
  id: string;
  seller_id: string;
  product_id: string;
  code: string;
  clicks: number;
  earnings: number;
  created_at: string;
}
export type AffiliateLinkInsert = Omit<AffiliateLink, 'id' | 'clicks' | 'earnings' | 'created_at'>;

export interface BuyerAccount {
  id: string;
  email: string;
  pin_hash: string;
  name: string | null;
  created_at: string;
}
export type BuyerAccountInsert = Omit<BuyerAccount, 'id' | 'created_at'>;

export interface ProductAccess {
  id: string;
  buyer_email: string;
  product_id: string;
  order_id: string;
  accessed_at: string;
}
export type ProductAccessInsert = Omit<ProductAccess, 'id' | 'accessed_at'>;

export interface Subscription {
  id: string;
  seller_id: string;
  plan: 'free' | 'starter' | 'pro' | 'enterprise';
  status: 'active' | 'past_due' | 'cancelled';
  ashtechpay_ref: string | null;
  created_at: string;
  expires_at: string;
}
export type SubscriptionInsert = Omit<Subscription, 'id' | 'created_at'>;
export type SubscriptionUpdate = Partial<Pick<Subscription, 'status' | 'ashtechpay_ref' | 'expires_at'>>;

export interface AdminSettings {
  id: string;
  key: string;
  value: Record<string, unknown>;
  updated_at: string;
}
export type AdminSettingsInsert = Omit<AdminSettings, 'id' | 'updated_at'>;
export type AdminSettingsUpdate = Partial<Pick<AdminSettings, 'value' | 'updated_at'>>;

// Ashtechpay Countries
export const ASHTECHPAY_COUNTRIES = [
  { code: 'BJ', name: 'Benin', currency: 'XOF', operators: ['Moov Money', 'MTN Mobile Money'] },
  { code: 'BF', name: 'Burkina Faso', currency: 'XOF', operators: ['Moov Money', 'Orange Money'] },
  { code: 'CM', name: 'Cameroon', currency: 'XAF', operators: ['MTN Mobile Money', 'Orange Money'] },
  { code: 'CF', name: 'Central African Rep.', currency: 'XAF', operators: ['Orange Money'] },
  { code: 'CG', name: 'Congo', currency: 'XAF', operators: ['Airtel Money', 'MTN Mobile Money'] },
  { code: 'CI', name: "Côte d'Ivoire", currency: 'XOF', operators: ['Moov Money', 'MTN', 'Orange Money', 'Wave'] },
  { code: 'GA', name: 'Gabon', currency: 'XAF', operators: ['Airtel Money', 'Moov Money'] },
  { code: 'GN', name: 'Guinea Conakry', currency: 'GNF', operators: ['MTN Mobile Money', 'Orange Money'] },
  { code: 'GQ', name: 'Equatorial Guinea', currency: 'XAF', operators: ['Orange Money'] },
  { code: 'GW', name: 'Guinea-Bissau', currency: 'XOF', operators: ['Orange Money'] },
  { code: 'ML', name: 'Mali', currency: 'XOF', operators: ['Moov Money', 'Orange Money'] },
  { code: 'NE', name: 'Niger', currency: 'XOF', operators: ['Airtel Money'] },
  { code: 'CD', name: 'DR Congo', currency: 'CDF', operators: ['Afrimoney', 'Airtel', 'Orange Money', 'Vodacom M-Pesa'] },
  { code: 'SN', name: 'Senegal', currency: 'XOF', operators: ['Free Money', 'Orange Money', 'Wave'] },
  { code: 'TD', name: 'Chad', currency: 'XAF', operators: ['Airtel Money', 'Moov Money'] },
  { code: 'TG', name: 'Togo', currency: 'XOF', operators: ['Flooz (Moov)', 'T-Money'] },
];

// Product type definitions
export const PRODUCT_TYPES: { value: ProductType; label: string; icon: string }[] = [
  { value: 'ebook', label: 'Ebook', icon: 'book' },
  { value: 'account_proxy', label: 'Proxy Account', icon: 'shield' },
  { value: 'account_generic', label: 'Account (Generic)', icon: 'user' },
  { value: 'video_course', label: 'Video Course', icon: 'play' },
  { value: 'software_license', label: 'Software License', icon: 'key' },
  { value: 'template', label: 'Template / Theme', icon: 'layout' },
  { value: 'music_audio', label: 'Music / Audio', icon: 'music' },
  { value: 'graphic_design', label: 'Graphic / Design', icon: 'palette' },
  { value: 'text_course', label: 'Text Course', icon: 'file-text' },
  { value: 'membership', label: 'Membership', icon: 'award' },
  { value: 'coupon_voucher', label: 'Coupon / Voucher', icon: 'tag' },
  { value: 'api_key', label: 'API Key / Access', icon: 'code' },
  { value: 'digital_art', label: 'Digital Art', icon: 'image' },
  { value: 'subscription', label: 'Subscription', icon: 'repeat' },
  { value: 'custom_link', label: 'Custom Link', icon: 'link' },
  { value: 'other', label: 'Other', icon: 'package' },
];
