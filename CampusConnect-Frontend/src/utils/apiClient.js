import axios from "axios";

const API_BASE =  import.meta.env.API_BASE_URL

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request interceptor for auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    const user_id = localStorage.getItem("user_id");
    console.log(user_id);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add X-User-ID header for authenticated requests
    if (user_id) {
      config.headers["X-User-ID"] = user_id;
    }
    console.log(config);
    return config;
  },
  (error) => Promise.reject(error)
);
export const userService = {
  registerUser: async (userDetails) => {
    const endpoint = "/users/register";
    const response = await apiClient.post(endpoint, userDetails);
    return response.data;
  },

  authenticateUser: async (loginDetails) => {
    const endpoint = "/users/login";
    const response = await apiClient.post(endpoint, loginDetails);
    return response.data;
  },

  getProfile: async (userId) => {
    const endpoint = `/users/${userId}`;
    const response = await apiClient.get(endpoint);
    return response.data;
  },

  getFollowers: async (userId) => {
    try {
      const endpoint = `/users/${userId}/followers`;
      console.log("Fetching followers for userId:", userId);
      const response = await apiClient.get(endpoint);
      return response.data;
    } catch (error) {
      console.error(
        "getFollowers error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  getFollowing: async (userId) => {
    try {
      const endpoint = `/users/${userId}/following`;
      console.log("Fetching following for userId:", userId);
      const response = await apiClient.get(endpoint);
      return response.data;
    } catch (error) {
      console.error(
        "getFollowing error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  searchUsers: async (query = "") => {
    try {
      const response = await apiClient.get(
        `/users/search?query=${encodeURIComponent(query)}`
      );
      return response.data;
    } catch (error) {
      console.error("Search users error:", error);
      throw error;
    }
  },
  followUser: async (currentUserId, targetUserId) => {
    const endpoint = `/users/${currentUserId}/follow`;
    const body = { target_user_id: targetUserId };
    const response = await apiClient.post(endpoint, body);
    return response.data;
  },

  unfollowUser: async (currentUserId, targetUserId) => {
    const endpoint = `/users/${currentUserId}/follow`;
    // const body = { target_user_id: targetUserId };
    const body = { target_user_id: targetUserId };
    const response = await apiClient.delete(endpoint, { data: body });
    return response.data;
  },
   
  getSuggestedOrganizations: async () => {
    try {
      // CRITICAL: Call the public search endpoint, filtering only for organizations
      const response = await apiClient.get('/users/search?type=organization');
      
      // We use 'map' to ensure the data is in the correct format for the component
      return response.data.results.map(org => ({
        id: org.user_id,
        name: org.username,
        followers: org.followers_count,
        isFollowing: false, // This status needs to be checked separately by the client
        // bio: org.bio
      }));
    } catch (error) {
      console.error('Error fetching suggested organizations:', error);
      return [];
    }
  },
};

export const eventService = {
  createEvent: async (eventData) => {
    const endpoint = "/events";
    console.log(apiClient, "apiClient");
    const response = await apiClient.post(endpoint, eventData);
    return response.data;
  },

  getAllEvents: async () => {
    const endpoint = "/events";
    const response = await apiClient.get(endpoint);
    return response.data;
  },

  getEventById: async (eventId) => {
    const endpoint = `/events/${eventId}`;
    const response = await apiClient.get(endpoint);
    return response.data;
  },

  updateEvent: async (eventId, eventData) => {
    const endpoint = `/events/${eventId}`;
    const response = await apiClient.put(endpoint, eventData);
    return response.data;
  },

  deleteEvent: async (eventId) => {
    const endpoint = `/events/${eventId}`;
    const response = await apiClient.delete(endpoint);
    return response.data;
  },

  rsvpToEvent: async (eventId) => {
  try {
    const endpoint = `events/${eventId}/rsvp`;
    const response = await apiClient.post(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error RSVPing to event:', error);
    throw error;
  }
},
cancelRsvp : async (eventId) => {
  try {
    const endpoint = `events/${eventId}/rsvp`;
    const response = await apiClient.delete(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error canceling RSVP:', error);
    throw error;
  }
}
};

export default apiClient;
