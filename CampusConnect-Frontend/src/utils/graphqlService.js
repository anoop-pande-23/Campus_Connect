import apolloClient from "./apolloClient";
import {
  GET_TRENDING_EVENTS,
  SEARCH_EVENTS,
  GET_USER_WITH_RECOMMENDATIONS,
  GET_EVENT_DETAILS,
  GET_USER_DASHBOARD_EVENTS,
  GET_ALL_EVENTS_WITH_STATUS
} from "./graphqlQueries";

export const graphqlService = {
  // Get trending events (replaces REST call to DRS)
  getTrendingEvents: async () => {
    try {
      const { data, error } = await apolloClient.query({
        query: GET_TRENDING_EVENTS,
        fetchPolicy: "no-cache", 
      });

      if (error) {
        console.error("GraphQL Error:", error);
        throw new Error("Failed to fetch trending events");
      }

      return data.trendingEvents;
    } catch (error) {
      console.error("getTrendingEvents error:", error);
      throw error;
    }
  },

  // Search events with GraphQL
  searchEvents: async (query) => {
    try {
      const { data, error } = await apolloClient.query({
        query: SEARCH_EVENTS,
        variables: { query },
        fetchPolicy: "no-cache", 
      });

      if (error) {
        console.error("GraphQL Error:", error);
        throw new Error("Failed to search events");
      }

      return data.searchEvents;
    } catch (error) {
      console.error("searchEvents error:", error);
      throw error;
    }
  },

  // Get user profile with recommendations
  getUserWithRecommendations: async (userId) => {
    try {
      const { data, error } = await apolloClient.query({
        query: GET_USER_WITH_RECOMMENDATIONS,
        variables: { id: userId },
        fetchPolicy: "cache-first",
      });

      if (error) {
        console.error("GraphQL Error:", error);
        throw new Error("Failed to fetch user recommendations");
      }

      return data.user;
    } catch (error) {
      console.error("getUserWithRecommendations error:", error);
      throw error;
    }
  },

  // Get event details with host information
  getEventDetails: async (eventId, requesterId) => {
    try {
      const { data, error } = await apolloClient.query({
        query: GET_EVENT_DETAILS,
        variables: { id: eventId, requesterId }, // Pass requesterId for isAttending check
        fetchPolicy: "cache-first",
      });

      if (error) {
        console.error("GraphQL Error:", error);
        throw new Error("Failed to fetch event details");
      }

      return data.event;
    } catch (error) {
      console.error("getEventDetails error:", error);
      throw error;
    }
  },
  
  // NEW: Get dashboard event lists (Attending, Created)
  getUserDashboardEvents: async (userId) => {
    try {
      const { data, error } = await apolloClient.query({
        query: GET_USER_DASHBOARD_EVENTS,
        variables: { userId },
        fetchPolicy: "network-only", // Always fetch fresh list
      });
      
      if (error) {
          console.error("GraphQL Error:", error);
          throw new Error("Failed to fetch user dashboard events");
      }

      // Return the nested user object containing the two event arrays
      return data.user; 
    } catch (error) {
      console.error("getUserDashboardEvents error:", error);
      throw error;
    }
  },
  getAllEvents: async (requesterId) => {
    try {
      if (!requesterId) {
        console.warn("Attempting to fetch all events without a requester ID.");
      }
      
      const { data, error } = await apolloClient.query({
        query: GET_ALL_EVENTS_WITH_STATUS,
        variables: { requesterId: requesterId || "" }, 
        fetchPolicy: "network-only", // Ensure fresh data
      });

      if (error) {
        console.error("GraphQL Error:", error);
        throw new Error("Failed to fetch all events with attendance status.");
      }
      
      // The result comes from the searchEvents root resolver
      return data.searchEvents;
    } catch (error) {
      console.error("getAllEvents error:", error);
      throw error;
    }
  },
};