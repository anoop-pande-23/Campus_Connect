import React, { useState, useEffect } from "react";
import { eventService,userService } from "../../../utils/apiClient";
import { graphqlService } from "../../../utils/graphqlService";
import { useAuth } from "../../../contexts/AuthContext";
import EventCard from "../../EventCard";
import OrgCard from "../../OrgCard";
import CreateEventScreen from "../CreateEventScreen";
const HomeScreen = ({
  setActiveScreen,
  onFollow,
  rsvpedEvents,
  onRsvp,
  following,
  onEventClick,
  openProfile,
  events,
  setEvents
}) => {
  const { user, logout } = useAuth();
  // const [events, setEvents] = useState([]);
  const [trendingEvents, setTrendingEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentScreen, setCurrentScreen] = useState("home");
  const [organizations,setOrganizations] = useState([])

  useEffect(() => {
    loadEvents();
    loadTrendingEvents();
    getSuggestedOrganisation()
  }, []);

  const loadTrendingEvents = async () => {
    try {
      const trendingData = await graphqlService.getTrendingEvents();
      console.log(trendingData, "trendingData");
      setTrendingEvents(trendingData || []);
      // alert("got trending events");
    } catch (error) {
      console.error("Load trending events error:", error);
      // Don't set error message for trending events - it's not critical
    }
  };

   const getSuggestedOrganisation = async () => {
    try {
      const suggestedData = await userService.getSuggestedOrganizations();
      const filteredOrganizations = suggestedData?.filter(org => org.id !== user) || [];
      setOrganizations(filteredOrganizations||[]);
      // setOrganizations(suggestedData || []);
    } catch (error) {
      console.error("Load trending events error:", error);
      // Don't set error message for trending events - it's not critical
    }
  };

  const loadEvents = async () => {
    setIsLoading(true);
    setErrorMessage("");
     const requesterId = user
    try {    
      const eventsData = await graphqlService.getAllEvents(requesterId); 
      const filteredEvents = eventsData?.filter(event => event.host?.id !== user) || [];
      setEvents(filteredEvents);
      // setEvents(eventsData || []);
    } catch (error) {
      const message = error.response?.data?.message || "Failed to load events";
      console.error("Load events error:", error);
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEventCreated = (newEvent) => {
    setEvents((prev) => [newEvent, ...prev]);
    setCurrentScreen("home");
  };

  const handleOrgCardClick = (orgId) => {
    // Here you would navigate to a specific organization's profile page
    // For our current simplified setup, we'll just go to the generic org profile screen
    setActiveScreen("organization-profile");
    // A more advanced app would pass the orgId to the screen or a global state management system
  };

  if (currentScreen === "create-event") {
    return (
      <CreateEventScreen
        onEventCreated={handleEventCreated}
        onBack={() => setCurrentScreen("home")}
      />
    );
  }

  return (
    <div className="fade-in">
      {/* Welcome Header */}
      <div className="gradient-bg rounded-2xl p-8 mb-8 text-white">
        <h1 className="font-heading font-bold text-3xl mb-2">
          Welcome back, {user?.username || "User"}! 👋
        </h1>
        <p className="text-blue-100 text-lg">
          Discover amazing events happening at University of California
        </p>
        <button
          onClick={() => setCurrentScreen("create-event")}
          className="mt-4 bg-white text-primary px-4 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          ✨ Create New Event
        </button>

        <button
          onClick={() => setActiveScreen("user-discovery")}
          className="mt-4 ml-2 bg-white text-primary px-4 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          👥 Discover People
        </button>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {errorMessage}
          <button
            onClick={loadEvents}
            className="ml-4 text-red-800 hover:text-red-900 font-medium"
          >
            Try Again
          </button>
        </div>
      )}

      {/* {trendingEvents.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading font-bold text-2xl text-gray-900">
              🔥 Trending Events
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingEvents.slice(0, 3).map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onRsvp={onRsvp}
                isRsvped={rsvpedEvents?.has(event.id)}
                onEventClick={onEventClick}
              />
            ))}
          </div>
        </div>
      )} */}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* ... (Your stats components here) */}
      </div>

      {/* Suggested Organizations */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-bold text-2xl text-gray-900">
            🌟 Suggested Organizations
          </h2>
          <button
            onClick={() => setActiveScreen("discover")}
            className="text-primary font-semibold hover:text-primary/80 transition-colors"
          >
            View All
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {organizations?.map((org) => (
            <OrgCard
              key={org.id}
              org={org}
              onFollow={onFollow}
              isFollowing={following?.has(org.id)}
              onCardClick={handleOrgCardClick}
              openProfile={openProfile}
            />
          ))}
        </div>
      </div>

      {/* Upcoming Events Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-bold text-2xl text-gray-900">
            🔥 Upcoming Events
          </h2>
          <button
            onClick={() => setActiveScreen("discover")}
            className="text-primary font-semibold hover:text-primary/80 transition-colors"
          >
            View All
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                <span className="text-white font-bold text-2xl">CC</span>
              </div>
              <p className="text-gray-600">Loading events...</p>
            </div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-500 font-bold text-2xl">📅</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No events yet
            </h3>
            <p className="text-gray-600 mb-6">
              Be the first to create an event for your community!
            </p>
            <button
              onClick={() => setCurrentScreen("create-event")}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-semibold"
            >
              Create First Event
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard
                key={event.id || event._id}
                event={event}
                onRsvp={onRsvp}
                isRsvped={rsvpedEvents?.has(event.id)}
                onEventClick={onEventClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;
