import { gql } from "@apollo/client";

// Query to get trending events
export const GET_TRENDING_EVENTS = gql`
  query GetTrendingEvents {
    trendingEvents {
      id
      title
      description
      location
      attendeesCount
      host {
        id
        username
        isOrganization
      }
    }
  }
`;

// Query to search events
export const SEARCH_EVENTS = gql`
  query SearchEvents($query: String!) {
    searchEvents(query: $query) {
      id
      title
      description
      location
      dateTime
      attendeesCount
      host {
        id
        username
        isOrganization
      }
    }
  }
`;

// Query to get user profile with recommendations
export const GET_USER_WITH_RECOMMENDATIONS = gql`
  query GetUserWithRecommendations($id: ID!) {
    user(id: $id) {
      id
      username
      bio
      isOrganization
      followersCount
      recommendations {
        id
        title
        description
        location
        dateTime
        attendeesCount
        host {
          id
          username
          isOrganization
        }
      }
    }
  }
`;

// Query to get event details with host info
export const GET_EVENT_DETAILS = gql`
  query GetEventDetails($id: ID!, $requesterId: ID!) {
    event(id: $id) {
      id
      title
      description
      location
      dateTime
      attendeesCount
      isAttending(requesterId: $requesterId)
      host {
        id
        username
        bio
        isOrganization
        followersCount
      }
    }
  }
`;


// --- QUERY FOR MY EVENTS DASHBOARD (NEW) ---

// Query 5: Get all user-specific event lists for the dashboard (Calls multiple nested resolvers)
export const GET_USER_DASHBOARD_EVENTS = gql`
  query GetUserDashboardEvents($userId: ID!) {
    user(id: $userId) {
      id
      
      attendingEvents { # Fetches events user has RSVP'd to
        id
        title
        location
        dateTime
        attendeesCount
      }
      
      createdEvents { # Fetches events user has created
        id
        title
        location
        dateTime
        attendeesCount
        attendeesList { 
          id
          username
        }
      }
    }
  }
`;

export const GET_ALL_EVENTS_WITH_STATUS = gql`
  query GetAllEventsWithStatus($requesterId: ID!) {
    # We will use the searchEvents query entry point without a query parameter 
    # to fetch all upcoming events (as your EMS search endpoint is configured).
    searchEvents(query: "") { 
      id
      title
      location
      dateTime
      attendeesCount
      # CRITICAL: Request the flag for the current user
      isAttending(requesterId: $requesterId) 
      host {
        id
        username
      }
    }
  }
`;