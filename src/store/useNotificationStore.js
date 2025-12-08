// useNotificationStore.js
import { create } from "zustand";

const useNotificationStore = create((set) => ({
  notifications: [],

  // 알림 목록 전체 설정 (API에서 가져올 때)
  setNotifications: (notifications) => set({ notifications }),

  // 새 알림 추가
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        {
          id: notification.id || Date.now(),
          isRead: false,
          createdAt: notification.createdAt || new Date().toISOString(),
          ...notification,
        },
        ...state.notifications,
      ],
    })),

  // 읽음 처리
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
    })),

  // 모두 읽음 처리
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
    })),

  // 모두 삭제
  clearAll: () => set({ notifications: [] }),

  // 특정 알림 삭제
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));

export default useNotificationStore;
