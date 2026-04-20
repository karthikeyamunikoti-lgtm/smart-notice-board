import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('notifications');
    return saved ? JSON.parse(saved) : [];
  });

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('newNotice', (data) => {
      const newNotification = {
        id: Date.now(),
        message: data.message,
        title: data.title,
        time: new Date().toISOString(),
        read: false
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      toast(data.message, {
        icon: '🔔',
        duration: 4000
      });
    });

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const clearAll = () => {
    setNotifications([]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <NotificationContext.Provider value={{ notifications, clearAll, removeNotification, markAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};
