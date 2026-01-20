import { useState, useEffect, useCallback } from 'react';
import { getNotificationPermission, setNotificationPermission } from '../lib/storage';

interface UseNotificationsResult {
  isSupported: boolean;
  permission: NotificationPermission | 'unsupported';
  requestPermission: () => Promise<boolean>;
  sendNotification: (title: string, options?: NotificationOptions) => void;
}

export function useNotifications(): UseNotificationsResult {
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'unsupported';
    }
    return Notification.permission;
  });

  const isSupported = permission !== 'unsupported';

  useEffect(() => {
    if (!isSupported) return;

    // Sync with stored preference
    const stored = getNotificationPermission();
    if (stored && Notification.permission === 'granted') {
      setPermission('granted');
    }
  }, [isSupported]);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) return false;

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      setNotificationPermission(result === 'granted');
      return result === 'granted';
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return false;
    }
  }, [isSupported]);

  const sendNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (!isSupported || permission !== 'granted') return;

    try {
      const notification = new Notification(title, {
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
        ...options
      });

      // Auto close after 5 seconds
      setTimeout(() => notification.close(), 5000);
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  }, [isSupported, permission]);

  return {
    isSupported,
    permission,
    requestPermission,
    sendNotification
  };
}
