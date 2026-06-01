import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import apiClient from "../utils/apiClient";

const useNotificationSocket = () => {
  const { user, isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  // Function to process incoming messages from the RNS
  const handleMessage = useCallback((event) => {
    try {
      const data = JSON.parse(event.data);
      console.log("[WS] Notification received:", data);

      // Add the notification to the local state
      setNotifications((prev) => [...prev, data]);

      // Show browser notification (if permission granted)
      if (Notification.permission === "granted") {
        new Notification(data.title || "Campus Connect", {
          body: data.message || "New activity alert!",
          icon: "/vite.svg", // Use your app icon
          badge: "/vite.svg",
        });
      }

      // You can also show in-app notifications here
      console.log("📢 New notification:", data.message);
    } catch (e) {
      console.error("Failed to parse WS message:", e);
    }
  }, []);

  const fetchOfflineNotifications = async () => {
    try {
      const userId = user;
      // alert(userId)
      if (!userId) return;
      // Use your existing apiClient
      const response = await apiClient.get(`/notifications/${userId}`);

      if (
        response.data?.notifications &&
        response.data.notifications.length > 0
      ) {
        console.log(
          `[WS] Delivering ${response.data.notifications.length} queued offline messages.`
        );

        // Add the retrieved notifications to the state
        setNotifications((prev) => [...prev, ...response.data.notifications]);
      }
    } catch (error) {
      console.error("Failed to fetch offline notifications:", error);
      // Don't throw error, just log it as offline notifications are not critical
    }
  };

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      console.log("[Notifications] Permission:", permission);
      return permission === "granted";
    }
    return false;
  };

  // Function to mark notification as read
  const markAsRead = useCallback((notificationId) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const connectWebSocket = useCallback(
    (id) => {
      if (!id) {
        return;
      }

      if (
        wsRef.current &&
        (wsRef.current.readyState === WebSocket.CONNECTING ||
          wsRef.current.readyState === WebSocket.OPEN)
      ) {
        return;
      }

      // 2. Close stale socket before creating new one
      if (wsRef.current) {
        wsRef.current.close(1000, "Stale connection");
      }

      const WS_BASE_URL = import.meta.env.WS_URL || 'ws://localhost:3000';
      const WS_URL = `${WS_BASE_URL}/notifications?token=${id}`;

      try {
        console.log("[WS] Connecting to:", WS_URL);

        wsRef.current = new WebSocket(WS_URL);

        wsRef.current.onopen = () => {
          console.log(`[WS] Connection established for user: ${id}`);
          setIsConnected(true);

          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
          }

           fetchOfflineNotifications(id);
        };

        wsRef.current.onmessage = handleMessage;

        wsRef.current.onclose = (event) => {
          console.log(`[WS] Connection closed for user: ${id}`, event.reason);
          setIsConnected(false);

          if (user && isAuthenticated && !reconnectTimeoutRef.current) {
            console.log("[WS] Attempting to reconnect in 5 seconds...");
            reconnectTimeoutRef.current = setTimeout(() => {
              reconnectTimeoutRef.current = null;
              connectWebSocket(id);
            }, 5000);
          }
        };

        wsRef.current.onerror = (error) => {
          console.error(`[WS Error] Connection error for user ${id}:`, error);
          setIsConnected(false);
        };
      } catch (error) {
        console.error("[WS] Failed to create WebSocket connection:", error);
      }
    },
    [user, isAuthenticated]
  );

  useEffect(() => {
    if (isAuthenticated && user) {
      // 1. Connection setup on authentication
      connectWebSocket(user);
    } else {
      // 2. Cleanup on logout
      if (wsRef.current) {
        wsRef.current.close(1000, "User logged out");
        wsRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      setIsConnected(false);
      setNotifications([]);
    }

    // Cleanup function
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setIsConnected(false);
    };
  }, [isAuthenticated, user, connectWebSocket]);

  // Return hook interface
  return {
    isConnected,
    notifications,
    unreadCount: notifications.filter((n) => !n.read).length,
    markAsRead,
    clearAllNotifications,
    fetchOfflineNotifications,
    requestNotificationPermission,
  };
};

export default useNotificationSocket;
