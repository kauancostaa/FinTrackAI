import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface DashboardStore {
  // Estado
  darkMode: boolean
  sidebarCollapsed: boolean
  notifications: Notification[]
  userPreferences: UserPreferences
  
  // Ações
  toggleDarkMode: () => void
  toggleSidebar: () => void
  addNotification: (notification: Notification) => void
  clearNotifications: () => void
  updatePreferences: (prefs: Partial<UserPreferences>) => void
}

interface Notification {
  id: string
  type: 'info' | 'warning' | 'error' | 'success'
  title: string
  message: string
  read: boolean
  timestamp: Date
}

interface UserPreferences {
  language: string
  timezone: string
  refreshInterval: number
  emailNotifications: boolean
  pushNotifications: boolean
}

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set) => ({
      // Estado inicial
      darkMode: false,
      sidebarCollapsed: false,
      notifications: [],
      userPreferences: {
        language: 'pt-BR',
        timezone: 'America/Sao_Paulo',
        refreshInterval: 30000,
        emailNotifications: true,
        pushNotifications: true,
      },

      // Ações
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      
      addNotification: (notification) =>
        set((state) => ({
          notifications: [notification, ...state.notifications].slice(0, 50),
        })),
      
      clearNotifications: () => set({ notifications: [] }),
      
      updatePreferences: (prefs) =>
        set((state) => ({
          userPreferences: { ...state.userPreferences, ...prefs },
        })),
    }),
    {
      name: 'dashboard-storage',
    }
  )
)

// Store para dados da aplicação
interface AppDataStore {
  transactions: any[]
  fraudAlerts: any[]
  users: any[]
  isLoading: boolean
  
  setTransactions: (transactions: any[]) => void
  setFraudAlerts: (alerts: any[]) => void
  setUsers: (users: any[]) => void
  setLoading: (loading: boolean) => void
}

export const useAppDataStore = create<AppDataStore>((set) => ({
  transactions: [],
  fraudAlerts: [],
  users: [],
  isLoading: false,
  
  setTransactions: (transactions) => set({ transactions }),
  setFraudAlerts: (alerts) => set({ fraudAlerts }),
  setUsers: (users) => set({ users }),
  setLoading: (isLoading) => set({ isLoading }),
}))
