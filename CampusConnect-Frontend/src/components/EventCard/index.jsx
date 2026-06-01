import React from "react";

const EventCard = ({ event, onRsvp, isRsvped,onEventClick }) => {
  const formatEventDate = (dateTime) => {
    try {
      const date = new Date(dateTime);
      return {
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        time: date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
        fullDate: date.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      };
    } catch (error) {
      return {
        date: "TBD",
        time: "TBD",
        fullDate: "Date to be determined",
      };
    }
  };

  const { date, time } = formatEventDate(event.dateTime);

  const handleCardClick = () => {
      onEventClick(event);
  };

  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden card-hover cursor-pointer"
      onClick={handleCardClick}
    >
      <div
        className={`h-48 bg-gradient-to-br from-purple-400 to-pink-400 relative`}
      >
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-800">
          {event.date}
        </div>
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="font-bold text-lg">{event.title}</h3>
          <p className="text-white/90 cursor-pointer hover:underline">
            {event.organizer}
          </p>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center text-gray-600 text-sm mb-2">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {time}
        </div>
        <div className="flex items-center text-gray-600 text-sm mb-4">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
          </svg>
          {event.location}
        </div>
        <div>
          {event.description && (
            <div className="text-gray-600 text-sm mb-3 line-clamp-2">
              {event.description}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {event.attendeesCount} attending
          </span>
          <button
            disabled={event.isAttending}
            onClick={(e) => {
              e.stopPropagation();
              onRsvp(event.id, event.title);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              event.isAttending
                ? "bg-accent text-white hover:bg-accent/90"
                : "bg-primary text-white hover:bg-primary/90"
            }`}
          >
                {event.isAttending ? "✓ Going" : "RSVP"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
