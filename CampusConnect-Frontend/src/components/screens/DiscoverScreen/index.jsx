import React, { useState, useEffect, use } from "react";
import EventCard from "../../EventCard";
import { eventService } from "../../../utils/apiClient";
import { graphqlService } from '../../../utils/graphqlService';
import { useAuth } from "../../../contexts/AuthContext";
const DiscoverScreen = ({ rsvpedEvents, onRsvp, events, setEvents }) => {
  // const [discoverEvents, setDiscoverEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const { user } = useAuth()
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setIsLoading(true);
    setErrorMessage("");
    const requesterId = user
    try {
      const eventsData = await graphqlService.getAllEvents(requesterId); 
      const filteredEvents = eventsData?.filter(event => event.host?.id !== user) || [];
      setEvents(filteredEvents || []);
      // setDiscoverEvents(eventsData || []);
    } catch (error) {
      const message = error.response?.data?.message || "Failed to load events";
      console.error("Load events error:", error);
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter events based on search and category
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location?.toLowerCase().includes(searchTerm.toLowerCase());

    // For now, return all events since we don't have categories in the API
    return matchesSearch;
  });

  return (
    <div className="fade-in">
      <div className="mb-8">
        <h1 className="font-heading font-bold text-3xl text-gray-900 mb-2">
          Discover Events
        </h1>
        <p className="text-gray-600">
          Find amazing events happening across your campus
        </p>
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

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option>All Categories</option>
            <option>Academic</option>
            <option>Social</option>
            <option>Sports</option>
            <option>Career</option>
            <option>Cultural</option>
            <option>Volunteer</option>
          </select>
          <select className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
            <option>All Dates</option>
            <option>Today</option>
            <option>Tomorrow</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>
        </div>
      </div>

      {/* Category Buttons */}
      {/* <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
        <button className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
          <div className="text-2xl mb-2">📚</div>
          <p className="text-sm font-semibold text-gray-900">Academic</p>
        </button>
        <button className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
          <div className="text-2xl mb-2">🎉</div>
          <p className="text-sm font-semibold text-gray-900">Social</p>
        </button>
        <button className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
          <div className="text-2xl mb-2">⚽</div>
          <p className="text-sm font-semibold text-gray-900">Sports</p>
        </button>
        <button className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
          <div className="text-2xl mb-2">💼</div>
          <p className="text-sm font-semibold text-gray-900">Career</p>
        </button>
        <button className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
          <div className="text-2xl mb-2">🎨</div>
          <p className="text-sm font-semibold text-gray-900">Cultural</p>
        </button>
        <button className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
          <div className="text-2xl mb-2">🤝</div>
          <p className="text-sm font-semibold text-gray-900">Volunteer</p>
        </button>
      </div> */}

      {/* Events Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
              <span className="text-white font-bold text-2xl">CC</span>
            </div>
            <p className="text-gray-600">Loading events...</p>
          </div>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-500 font-bold text-2xl">🔍</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchTerm ? "No events found" : "No events available"}
          </h3>
          <p className="text-gray-600">
            {searchTerm
              ? "Try adjusting your search terms"
              : "Check back later for new events"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id || event._id}
              event={event}
              onRsvp={onRsvp}
              isRsvped={rsvpedEvents?.has(event.id || event._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DiscoverScreen;
