import React from 'react';
import { useNotificationStore } from '../stores/notificationStore';
import '../styles/notifications.css';

export const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotificationStore();

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`notification notification-${notification.type}`}
          onClick={() => removeNotification(notification.id)}
        >
          <div className="notification-content">
            {notification.type === 'success' && <span className="notification-icon">✅</span>}
            {notification.type === 'error' && <span className="notification-icon">❌</span>}
            {notification.type === 'info' && <span className="notification-icon">ℹ️</span>}
            <span className="notification-message">{notification.message}</span>
          </div>
          <div className="notification-close" onClick={() => removeNotification(notification.id)}>
            ×
          </div>
        </div>
      ))}
    </div>
  );
};
