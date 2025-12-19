import { create } from 'zustand';

export type NotificationType = 'success' | 'error' | 'info';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number; // em ms
}

interface NotificationStoreState {
  notifications: Notification[];
  
  // Actions
  addNotification: (message: string, type: NotificationType, duration?: number) => void;
  removeNotification: (id: string) => void;
}

let notificationId = 0;

export const useNotificationStore = create<NotificationStoreState>((set) => ({
  notifications: [],

  addNotification: (message, type, duration = 3000) => {
    const id = `notification-${notificationId++}`;
    
    set((state) => ({
      notifications: [...state.notifications, { id, message, type, duration }]
    }));

    // Auto remover depois do tempo especificado
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      }));
    }, duration);
  },

  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  }))
}));
