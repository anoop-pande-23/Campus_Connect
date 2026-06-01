import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const GRAPHQL_URI = import.meta.env.GRAPHQL_ENDPOINT

const httpLink = createHttpLink({
  uri: GRAPHQL_URI,
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("authToken");
  const userId = localStorage.getItem("user_id");

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
      "X-User-ID": userId || "",
    },
  };
});

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: "all",
    },
    query: {
      errorPolicy: "all",
    },
  },
});

export default apolloClient;
