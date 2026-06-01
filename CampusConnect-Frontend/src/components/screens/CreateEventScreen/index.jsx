import React, { useState } from "react";
import { eventService } from "../../../utils/apiClient";
import { useAuth } from "../../../contexts/AuthContext";

const CreateEventScreen = ({ onEventCreated, onBack }) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Form state
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
  });

  const handleInputChange = (field, value) => {
    setEventData((prev) => ({ ...prev, [field]: value }));
    setErrorMessage("");
    setSuccessMessage("");
  };

  const formatDateTime = (date, time) => {
    // Combine date and time into ISO format
    const dateTimeString = `${date}T${time}:00Z`;
    return new Date(dateTimeString).toISOString();
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Validate required fields
      if (
        !eventData.title ||
        !eventData.description ||
        !eventData.date ||
        !eventData.time ||
        !eventData.location
      ) {
        setErrorMessage("Please fill in all fields");
        return;
      }

      // Format the data for the API
      const apiEventData = {
        title: eventData.title,
        description: eventData.description,
        date_time: formatDateTime(eventData.date, eventData.time),
        location: eventData.location,
      };

      console.log("Creating event with data:", apiEventData);

      const result = await eventService.createEvent(apiEventData);

      setSuccessMessage("Event created successfully!");

      // Reset form
      setEventData({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
      });

      // Notify parent component
      onEventCreated?.(result);

      // Optionally redirect after success
      setTimeout(() => {
        onBack?.();
      }, 2000);
    } catch (error) {
        
      const message =
        error.response?.data?.message ||
        "Failed to create event. Please try again.";
      console.error("Create event error:", error);
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <div className="flex items-center mb-4">
              {onBack && (
                <button
                  onClick={onBack}
                  className="mr-4 text-gray-600 hover:text-gray-800"
                >
                  ← Back
                </button>
              )}
              <h1 className="text-2xl font-bold text-gray-900">
                Create New Event
              </h1>
            </div>
            <p className="text-gray-600">
              Fill in the details to create your event
            </p>
          </div>

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleCreateEvent} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Title *
              </label>
              <input
                type="text"
                required
                value={eventData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter event title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                required
                rows={4}
                value={eventData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your event"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  required
                  value={eventData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time *
                </label>
                <input
                  type="time"
                  required
                  value={eventData.time}
                  onChange={(e) => handleInputChange("time", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                required
                value={eventData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter event location"
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                {isSubmitting ? "Creating Event..." : "Create Event"}
              </button>
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="px-6 py-3 border border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
            {/* <div className="flex justify-end space-x-4 pt-6">
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              )}

              
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Creating...' : 'Create Event'}
              </button>
            </div> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEventScreen;
