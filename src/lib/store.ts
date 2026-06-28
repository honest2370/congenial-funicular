import { create } from 'zustand';

interface AppState {
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  user: { id: string; email: string; role: 'admin' | 'seller' | 'buyer'; name: string } | null;
  setUser: (user: AppState['user']) => void;
  currentSpace: 'seller' | 'buyer' | 'admin';
  setCurrentSpace: (space: AppState['currentSpace']) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  notifPanelOpen: boolean;
  setNotifPanelOpen: (open: boolean) => void;
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  showProgress: boolean;
  setShowProgress: (show: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  theme: (typeof window !== 'undefined' && localStorage.getItem('sellizi-theme') as 'dark' | 'light') || 'dark',
  setTheme: (theme) => {
    if (typeof window !== 'undefined') localStorage.setItem('sellizi-theme', theme);
    set({ theme });
  },
  toggleTheme: () => {
    const newTheme = get().theme === 'dark' ? 'light' : 'dark';
    if (typeof window !== 'undefined') localStorage.setItem('sellizi-theme', newTheme);
    set({ theme: newTheme });
  },
  user: null,
  setUser: (user) => set({ user }),
  currentSpace: 'seller',
  setCurrentSpace: (space) => set({ currentSpace: space }),
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  notifPanelOpen: false,
  setNotifPanelOpen: (open) => set({ notifPanelOpen: open }),
  unreadCount: 0,
  setUnreadCount: (count) => set({ unreadCount: count }),
  showProgress: false,
  setShowProgress: (show) => set({ showProgress: show }),
}));
