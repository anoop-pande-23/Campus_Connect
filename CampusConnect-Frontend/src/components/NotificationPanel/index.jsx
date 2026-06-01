import React from "react";

const NotificationPanel = ({
  notifications,
  isOpen,
  togglePanel,
  onNotificationClick,
  onClearAll,
  unreadCount,
}) => {
  if (!isOpen) return null;

  const formatTime = (time) => {
    if (typeof time === "string") return time;
    // Handle Date objects from WebSocket notifications
    if (time instanceof Date) {
      const now = new Date();
      const diff = now - time;
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      if (minutes < 60) return `${minutes} minutes ago`;
      if (hours < 24) return `${hours} hours ago`;
      return `${days} days ago`;
    }
    return "just now";
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "new-event":
        return "📅";
      case "update-event":
        return "📝";
      case "hosting-event":
        return "🎭";
      case "rsvp":
        return "✅";
      case "rsvp-cancel":
        return "❌";
      case "follow":
        return "👥";
      case "unfollow":
        return "👋";
      case "event-created":
        return "🎉";
      case "event-reminder":
        return "⏰";
      default:
        return "🔔";
    }
  };

  return (
    <div
      id="notification-panel"
      className="fixed top-16 right-4 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto"
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">
            Notifications{" "}
            {unreadCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {unreadCount}
              </span>
            )}
          </h3>
          {notifications.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <div className="text-2xl mb-2">🔔</div>
            <p>No new notifications</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => onNotificationClick?.(notification)}
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                !notification.read ? "bg-blue-50" : ""
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="text-lg">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-900">
                    {notification.message ||
                      `${notification.orgName} - ${notification.eventName}`}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatTime(notification.time)}
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
