// Placeholder for Header

import React from "react";
import { useAuth } from "../../contexts/AuthContext";

const Header = ({
  setActiveScreen,
  notificationCount,
  onNotificationToggle,
}) => {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CC</span>
              </div>
              <span className="font-heading font-bold text-xl text-gray-900">
                Campus Connect
              </span>
            </div>
          </div>

          <div className=" md:flex items-center space-x-6">
            <button
              onClick={() => setActiveScreen("home")}
              className="text-gray-700 hover:text-primary font-medium transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => setActiveScreen("discover")}
              className="text-gray-700 hover:text-primary font-medium transition-colors"
            >
              Discover
            </button>
            <button
              onClick={() => setActiveScreen("my-events")}
              className="text-gray-700 hover:text-primary font-medium transition-colors"
            >
              My Events
            </button>
            <button
              onClick={() => setActiveScreen("create-event")}
              className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Create Event
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <button
              id="notification-btn"
              onClick={onNotificationToggle}
              className="relative p-2 text-gray-600 hover:text-primary transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-5 5v-5zM9 7H4l5-5v5zm6 10V7a1 1 0 00-1-1H5a1 1 0 00-1 1v10a1 1 0 001 1h9a1 1 0 001-1z"
                />
              </svg>
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-error rounded-full text-white text-xs flex items-center justify-center font-semibold notification-dot">
                  {notificationCount}
                </span>
              )}
            </button>
            {user && (
              <div className="flex items-center space-x-4">
                {/* <span className="text-sm text-gray-600">
                  Welcome, {user.username}
                </span> */}
                <button
                  onClick={handleLogout}
                  className="bg-red-50 text-red-700 px-4 py-2 border border-red-200 rounded-lg font-semibold hover:bg-red-100 transition-colors text-sm"
                >
                  Logout
                </button>
              </div>
            )}
            <div
              onClick={() => setActiveScreen("profile")}
              className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full cursor-pointer hover:ring-2 hover:ring-primary transition-all flex items-center justify-center text-white font-semibold text-sm"
            >
              S
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
