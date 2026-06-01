import React, { useState, useEffect } from "react";
import { userService } from "../../../utils/apiClient";
import { useAuth } from "../../../contexts/AuthContext";

const UserDiscoveryScreen = ({ onFollow, following, setActiveScreen, openProfile }) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([
    {
      user_id: "u1",
      username: "johndoe",
      full_name: "John Doe",
      bio: "Computer Science student passionate about AI and machine learning",
      followers_count: 145,
      mutual_connections: 5,
      is_organization: false,
      is_verified: true,
    },
  ]);

  const [recommendations, setRecommendations] = useState([
    {
      user_id: "r1",
      username: "techclub",
      full_name: "University Tech Club",
      bio: "Official tech club organizing workshops and hackathons",
      followers_count: 1200,
      mutual_connections: 15,
      is_organization: true,
      is_verified: true,
      reason: "Based on your interest in technology",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("recommendations");

  useEffect(() => {
    loadRecommendations();
  }, []);
  
  const handleFollow = async (targetUserId, type) => {
    if (!user) return;
    try {
      await userService.followUser(user, targetUserId);
      following.add(targetUserId);
      // Force re-render
      setUsers([...users]);
      setRecommendations([...recommendations]);
    } catch (error) {
      console.error("Error following user:", error);
      alert("Failed to follow user. Please try again.");
    }
  };

  const loadRecommendations = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
        // const response = await userService.getRecommendations(user.id);
        // setRecommendations(response.recommendations || []);
    } catch (error) {
      console.error("Error loading recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await userService.searchUsers(searchQuery);
      setUsers(response.results || []);
      setActiveTab("search");
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const UserCard = ({ user: userItem, showReason = false }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              userItem.is_organization
                ? "bg-primary"
                : "bg-gradient-to-br from-blue-400 to-green-400"
            }`}
          >
            <span className="text-white font-bold text-sm">
              {userItem.username?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3
                className="font-semibold text-gray-900 cursor-pointer hover:text-primary"
                 onClick={() =>{
                  //  alert("from discovery")
                  openProfile(userItem.user_id)
                }}
              >
                {userItem.username}
              </h3>
             <span className="text-blue-500">✓</span>
            </div>
            <p className="text-sm text-gray-600">
              {userItem.full_name} •{" "}
              {userItem.is_organization ? "Organization" : "Student"}
            </p>
            {userItem.bio && (
              <p className="text-sm text-gray-500 mt-1 truncate">
                {userItem.bio}
              </p>
            )}
            {/* <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
              <span>{userItem.followers_count || 0} followers</span>
              {userItem.mutual_connections > 0 && (
                <span>{userItem.mutual_connections} mutual connections</span>
              )}
            </div> */}
            {showReason && userItem.reason && (
              <p className="text-xs text-blue-600 mt-1">{userItem.reason}</p>
            )}
          </div>
        </div>
        {/* <button
         onClick={() =>
            handleFollow(
              userItem.user_id,
              userItem.is_organization ? "organization" : "user"
            )
          }
          disabled={following.has(userItem.user_id)}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            following.has(userItem.user_id)
              ? "bg-gray-100 text-gray-500 cursor-not-allowed"
              : "bg-primary text-white hover:bg-primary/90"
          }`}
        >
          {following.has(userItem.user_id) ? "Following" : "Follow"}
        </button> */}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Discover People</h1>
          <button
            onClick={() => setActiveScreen("home")}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Back to Home
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Search for users, organizations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button
              onClick={handleSearch}
              disabled={!searchQuery.trim()}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Search
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("recommendations")}
                className={`py-4 px-1 border-b-2 font-semibold text-sm ${
                  activeTab === "recommendations"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Recommended
              </button>
              <button
                onClick={() => setActiveTab("search")}
                className={`py-4 px-1 border-b-2 font-semibold text-sm ${
                  activeTab === "search"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Search Results {users.length > 0 && `(${users.length})`}
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeTab === "recommendations" && (
                  <>
                    {recommendations.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <p>No recommendations available at the moment.</p>
                      </div>
                    ) : (
                      recommendations.map((user) => (
                        <UserCard
                          key={user.user_id}
                          user={user}
                          showReason={true}
                        />
                      ))
                    )}
                  </>
                )}

                {activeTab === "search" && (
                  <>
                    {users.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <p>
                          {searchQuery
                            ? "No users found. Try a different search term."
                            : "Use the search bar above to find users and organizations."}
                        </p>
                      </div>
                    ) : (
                      users.map((user) => (
                        <UserCard key={user.user_id} user={user} />
                      ))
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDiscoveryScreen;
