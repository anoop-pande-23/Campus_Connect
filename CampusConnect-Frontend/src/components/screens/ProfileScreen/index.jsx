import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { userService } from "../../../utils/apiClient";
import useNotificationSocket from "../../../hooks/useNotificationSocket";

const ProfileScreen = ({ following, onUnfollow, isConnected }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("following");
  const [profileData, setProfileData] = useState(null);
  const [followingData, setFollowingData] = useState([]);
  const [followersData, setFollowersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        const profileResponse = await userService.getProfile(user);
        const followingResponse = await userService.getFollowing(user);
        const followersResponse = await userService.getFollowers(user);
        setProfileData(profileResponse);
        setFollowingData(followingResponse.following || []);
        setFollowersData(followersResponse.followers || []);

        const data = await userService.getProfile(user);
        setProfileData(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

    const handleFollow = async (targetUserId, type) => {     
          if (!user) return;
          try {
           await userService.followUser(user, targetUserId);
           const userToFollow = followersData.find(follower => follower.user_id === targetUserId);
          if (userToFollow) {
             setFollowingData(prev => [...prev, userToFollow]);
             setProfileData(prev => ({
              ...prev,
             following_count: (prev.following_count || 0) + 1
            }));
           }
          } catch (error) {
            console.error("Error following user:", error);
            alert("Failed to follow user. Please try again.");
          }
        };
  
    const handleunFollow = async (targetUserId, type) => {
          if (!user) return;
          try {
            await userService.unfollowUser(user, targetUserId);
            setFollowingData(prev => prev.filter(user => user.user_id !== targetUserId));
            setProfileData(prev => ({
            ...prev,
            following_count: Math.max((prev.following_count || 0) - 1, 0)
            }));
          } catch (error) {
            console.error("Error following user:", error);
            alert("Failed to follow user. Please try again.");
          }
        };
  

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };


  const renderFollowing = () => (
    <div id="following-profile-content" className="p-6">
      <div className="space-y-4">
        {followingData?.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>You're not following anyone yet.</p>
          </div>
        ) : (
          followingData?.map((followedUser) => (
            <div
              key={followedUser.user_id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    followedUser.is_organization
                      ? "bg-primary"
                      : "bg-gradient-to-br from-blue-400 to-green-400"
                  }`}
                >
                  <span className="text-white font-bold text-sm">
                    {followedUser.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 cursor-pointer hover:text-primary">
                    {followedUser.username}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {followedUser.is_organization ? "Organization" : "Student"}
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  handleunFollow(
                    followedUser.user_id,
                    followedUser.is_organization ? "organization" : "user"
                  )
                }
                className="text-red-600 hover:text-red-800 text-sm font-semibold"
              >
                Unfollow
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );


  const renderFollowers = () => (
    <div id="followers-profile-content" className="p-6">
      <div className="space-y-4">
        {followersData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No followers yet.</p>
          </div>
        ) : (
          followersData.map((follower) => (
            <div
              key={follower.user_id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    follower.is_organization
                      ? "bg-primary"
                      : "bg-gradient-to-br from-green-400 to-blue-400"
                  }`}
                >
                  <span className="text-white font-bold text-sm">
                    {follower.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {follower.username}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {follower.is_organization ? "Organization" : "Student"}
                  </p>
                </div>
              </div>
            
             {!followingData.find((f) => f.user_id === follower.user_id) ? (
  <button 
    onClick={() => handleFollow(follower.user_id, follower.is_organization ? "organization" : "user")} 
    className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
  >
    Follow Back
  </button>
) : (
  <button  
    onClick={() => handleunFollow(follower.user_id, follower.is_organization ? "organization" : "user")} 
    className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
  >
    Following
  </button>
)}

            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderEvents = () => (
    <div id="events-profile-content" className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">
            Study Group Session
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            Next Tuesday • Library Room 204
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">8 attending</span>
            <button className="text-primary hover:text-primary/80 text-sm font-semibold">
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto fade-in">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex items-start space-x-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="flex-1">
              <div className="h-8 bg-gray-200 rounded mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded mb-4 animate-pulse w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto fade-in">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p>Error loading profile: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-sm underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto fade-in">
      {/* User Profile Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
        <div className="flex items-start space-x-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-2xl">
              {profileData?.username
                ? profileData.username.charAt(0).toUpperCase()
                : "U"}
            </div>
            {/* Online status indicator */}
            <div
              className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white ${
                isConnected ? "bg-green-500" : "bg-gray-400"
              }`}
            ></div>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="font-heading font-bold text-3xl text-gray-900">
                {profileData?.username || "Loading..."}
              </h1>
              <span
                className={`text-sm px-3 py-1 rounded-full ${
                  isConnected
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {isConnected ? "Online" : "Offline"}
              </span>
            </div>
            <p className="text-gray-600 mb-4">
              {profileData?.email} •{" "}
              {profileData?.is_organization ? "Organization" : "Student"}
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
              <div>
                <span className="font-semibold text-gray-900">
                  {profileData?.followers_count || 0}
                </span>{" "}
                followers
              </div>
              <div>
                <span className="font-semibold text-gray-900">
                  {profileData?.following_count || 0}
                </span>{" "}
                following
              </div>
              {/* <div>
                <span className="font-semibold text-gray-900">8</span> events
                created
              </div> */}
            </div>
            <p className="text-gray-700 mb-6">
              {profileData?.is_organization
                ? "An active organization on campus connecting students through events and activities."
                : "Passionate about technology, sustainability, and bringing people together through events."}
            </p>
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-red-50 text-red-700 px-4 py-2 border border-red-200 rounded-lg font-semibold hover:bg-red-100 transition-colors text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Connection Status Banner */}
      {!isConnected && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-6">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-400 rounded-full mr-3"></div>
            <span className="text-sm">
              You're currently offline. Connect to see real-time updates and
              online status of others.
            </span>
          </div>
        </div>
      )}

      {/* Tabs Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("following")}
              className={`py-4 px-1 border-b-2 font-semibold text-sm ${
                activeTab === "following"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Following ({profileData?.following_count || 0})
            </button>
            <button
              onClick={() => setActiveTab("followers")}
              className={`py-4 px-1 border-b-2 font-semibold text-sm ${
                activeTab === "followers"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Followers ({profileData?.followers_count || 0})
            </button>
            {/* <button
              onClick={() => setActiveTab("events")}
              className={`py-4 px-1 border-b-2 font-semibold text-sm ${
                activeTab === "events"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              My Events (8)
            </button> */}
          </nav>
        </div>
        {activeTab === "following" && renderFollowing()}
        {activeTab === "followers" && renderFollowers()}
        {activeTab === "events" && renderEvents()}
      </div>
    </div>
  );
};

export default ProfileScreen;
