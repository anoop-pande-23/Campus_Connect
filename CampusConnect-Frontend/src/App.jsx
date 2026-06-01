import React, { useState, useEffect,useCallback } from "react";
import Header from "./components/Header";
import NotificationPanel from "./components/NotificationPanel";
import HomeScreen from "./components/screens/HomeScreen";
import ProfileScreen from "./components/screens/ProfileScreen";
import OrganizationProfileScreen from "./components/screens/OrganizationProfileScreen";
import DiscoverScreen from "./components/screens/DiscoverScreen";
import MyEventsScreen from "./components/screens/MyEventsScreen";
import CreateEventScreen from "./components/screens/CreateEventScreen";
import { useAuth } from "./contexts/AuthContext";
import EventDetailsScreen from "./components/screens/EventDetailsScreen";
import AuthScreen from "./components/auth";
import useNotificationSocket from "./hooks/useNotificationSocket";
import UserDiscoveryScreen from "./components/screens/UserDiscoverScreen";
import { eventService } from "./utils/apiClient";

const App = () => {
  const { isAuthenticated, isLoading } = useAuth();

  //   WebSocket notifications integration
  const {
    isConnected,
    notifications: wsNotifications,
    unreadCount,
    markAsRead,
    clearAllNotifications,
  } = useNotificationSocket();

  const [activeScreen, setActiveScreen] = useState("home");
  const [isNotificationPanelOpen, setNotificationPanelOpen] = useState(false);

  // Local notifications state (for app-specific notifications)
  const [localNotifications, setLocalNotifications] = useState([]);
  // const [eventDetails, seteventDetails] = useState([]);
  const [eventDetails, seteventDetails] = useState(null);

  const [events,setEvents] = useState([])
  // Combine WebSocket notifications with local notifications
  const allNotifications = [...wsNotifications, ...localNotifications];
  const totalNotificationCount =
    unreadCount + localNotifications.filter((n) => !n.read).length;

  const [following, setFollowing] = useState(
    new Set(["engineering-society", "drama-club", "mike-chen"])
  );
  const [rsvpedEvents, setRsvpedEvents] = useState(
    new Set(["spring-festival"])
  );

  const toggleNotifications = () => {
    setNotificationPanelOpen(!isNotificationPanelOpen);
  };

  const addLocalNotification = (message, type = "custom") => {
    const newNotification = {
      id: Date.now(),
      type: type,
      message,
      time: "just now",
      read: false,
      source: "local", // Mark as local notification
    };
    setLocalNotifications((prev) => [newNotification, ...prev]);
  };

  const handleFollow = (id, type) => {
    setFollowing((prevFollowing) => {
      const newFollowing = new Set(prevFollowing);
      if (newFollowing.has(id)) {
        newFollowing.delete(id);
        addLocalNotification(`You unfollowed ${id}`, "unfollow");
      } else {
        newFollowing.add(id);
        addLocalNotification(`🎉 You're now following ${id}!`, "follow");
      }
      return newFollowing;
    });
  };

  const handleRsvp = async (eventId, eventName) => {
  try {
    console.log(rsvpedEvents,"rsvpedEvents")
    const isCurrentlyRsvped = rsvpedEvents.has(eventId);

    await eventService.rsvpToEvent(eventId);

    // Update local state only after successful API call
    setRsvpedEvents((prevRsvped) => {
      const newRsvped = new Set(prevRsvped);
        newRsvped.add(eventId);
        addLocalNotification(
          `🎉 You're now registered for ${eventName}!`,
          "rsvp"
        );
      return newRsvped;
    });
    
   console.log(events,"eventDetails")
   console.log(eventId,"eveneventIdtDetails")
    
   setEvents(prevEvents => 
      prevEvents.map(event => {
        if (event.id === eventId) {
          return {
            ...event,
            isAttending: true,
            attendeesCount: event.attendeesCount + 1
          };
        }
        return event;
      })
    );


  } catch (error) {
    console.error('RSVP error:', error);
    addLocalNotification(
      `Failed to ${rsvpedEvents.has(eventId) ? 'cancel RSVP for' : 'RSVP to'} ${eventName}. Please try again.`,
      "error"
    );
  }
};

  const handleCreateEvent = (eventData) => {
    console.log("Event created:", eventData);
    addLocalNotification(
      `🎉 "${eventData.title}" has been created successfully!`,
      "event-created"
    );
    setActiveScreen("home");
  };

  // Handle notification actions
  const handleNotificationClick = (notification) => {
    // Mark as read
    if (notification.source === "local") {
      setLocalNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
      );
    } else {
      markAsRead(notification.id);
    }

    // Handle different notification types
    switch (notification.type) {
      case "new-event":
      case "event-created":
        setActiveScreen("discover");
        break;
      case "rsvp":
      case "event-reminder":
        setActiveScreen("my-events");
        break;
      case "follow":
      case "new-follower":
        setActiveScreen("profile");
        break;
      default:
        // Keep current screen
        break;
    }

    setNotificationPanelOpen(false);
  };

  const handleClearAllNotifications = () => {
    clearAllNotifications(); // Clear WebSocket notifications
    setLocalNotifications([]); // Clear local notifications
  };

  // Auto-close notification panel when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      const panel = document.getElementById("notification-panel");
      const notificationBtn = document.getElementById("notification-btn");
      if (
        panel &&
        !panel.contains(e.target) &&
        notificationBtn &&
        !notificationBtn.contains(e.target)
      ) {
        setNotificationPanelOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Debug: Log WebSocket connection status
  useEffect(() => {
    console.log(
      "WebSocket connection status:",
      isConnected ? "Connected" : "Disconnected"
    );
  }, [isConnected]);

  // Debug: Log new WebSocket notifications
  useEffect(() => {
    if (wsNotifications.length > 0) {
      console.log("WebSocket notifications:", wsNotifications);
    }
  }, [wsNotifications]);


  const handleEventClick = useCallback((event) => {
    // alert("cleix")
    seteventDetails(event);
    setActiveScreen("event-details")
  }, []);


  const [selectedProfile, setSelectedProfile] = useState(null);

  const openProfile = async (userId) => {
    // alert("from openprofile def")
    try {
      setSelectedProfile(userId);
      setActiveScreen("organization-profile");
    } catch (error) {
      console.error("Error loading profile:", error);
      alert("Failed to load profile.");
    }
  };


  const renderScreen = () => {
    switch (activeScreen) {
      case "home":
        return (
          <HomeScreen
            setActiveScreen={setActiveScreen}
            setEvents={setEvents}
            events={events}
            onFollow={handleFollow}
            rsvpedEvents={rsvpedEvents}
            onRsvp={handleRsvp}
            following={following}
            onEventClick={handleEventClick}
            openProfile={openProfile}
          />
        );
      case "profile":
        return (
          <ProfileScreen
            following={following}
            onUnfollow={handleFollow}
            isConnected={isConnected}
          />
        );
      case "discover":
        return (
          <DiscoverScreen
            setActiveScreen={setActiveScreen}
            rsvpedEvents={rsvpedEvents}
            onRsvp={handleRsvp}
            setEvents={setEvents}
            events={events}
            
          />
        );
      case "my-events":
        return <MyEventsScreen  />;
      case "create-event":
        return (
          <CreateEventScreen
            onCancel={() => setActiveScreen("home")}
            onCreate={handleCreateEvent}
          />
        );
      case "event-details":
        return (
        <EventDetailsScreen onRsvp={handleRsvp} rsvpedEvents={rsvpedEvents} eventDetails={eventDetails}   openProfile={openProfile} />
        );
      case "organization-profile":
        return (
          // <OrganizationProfileScreen
          //   onFollow={handleFollow}
          //   following={following}
          //   onRsvp={handleRsvp}
          //   rsvpedEvents={rsvpedEvents}
          // />

           <OrganizationProfileScreen
            profileId={selectedProfile}
            onFollow={handleFollow}
            following={following}
            onRsvp={handleRsvp}
            rsvpedEvents={rsvpedEvents}
            setActiveScreen={setActiveScreen}
           />
        );
      case "user-discovery":
        return (
          <UserDiscoveryScreen
            onFollow={handleFollow}
            following={following}
            setActiveScreen={setActiveScreen}
            openProfile={openProfile}
          />
        );
      default:
        return (
          <HomeScreen
            setActiveScreen={setActiveScreen}
            onFollow={handleFollow}
            rsvpedEvents={rsvpedEvents}
            onRsvp={handleRsvp}
            following={following}
          />
        );
    }
  };

  const [currentUser, setCurrentUser] = useState(null);

  const handleAuthSuccess = (user) => {
    // setCurrentUser(user);
    setActiveScreen("profile");
  };

  // Show loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-2xl">CC</span>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 font-body min-h-screen">
      {isAuthenticated ? (
        <>
          <Header
            setActiveScreen={setActiveScreen}
            notificationCount={totalNotificationCount}
            onNotificationToggle={toggleNotifications}
            isWebSocketConnected={isConnected}
          />
          <NotificationPanel
            notifications={allNotifications}
            isOpen={isNotificationPanelOpen}
            togglePanel={toggleNotifications}
            onNotificationClick={handleNotificationClick}
            onClearAll={handleClearAllNotifications}
            unreadCount={totalNotificationCount}
          />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {renderScreen()}
          </main>
        </>
      ) : (
        <AuthScreen onAuthSuccess={handleAuthSuccess} />
      )}
    </div>
  );
};

export default App;
