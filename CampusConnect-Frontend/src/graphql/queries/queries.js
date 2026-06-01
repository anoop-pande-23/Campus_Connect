import { gql } from "@apollo/client";

// Query to get trending events
export const GET_TRENDING_EVENTS = gql`
  query GetTrendingEvents {
    trendingEvents {
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
  query GetEventDetails($id: ID!) {
    event(id: $id) {
      id
      title
      description
      location
      dateTime
      attendeesCount
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
