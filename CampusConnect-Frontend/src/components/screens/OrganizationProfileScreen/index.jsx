import React, { useState, useEffect } from 'react';
import { userService } from '../../../utils/apiClient';
import { useAuth } from "../../../contexts/AuthContext";

const OrganizationProfileScreen = ({ profileId, onFollow, following, onRsvp, rsvpedEvents, setActiveScreen }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // const isFollowing = 
    const [isFollowing,setisFollowing]= useState(false)
    const { user } = useAuth();
    const handleFollow = async (targetUserId, type) => {
       
        if (!user) return;
        try {
          await userService.followUser(user, targetUserId);
          setisFollowing(true)
        } catch (error) {
          console.error("Error following user:", error);
          alert("Failed to follow user. Please try again.");
        }
      };

    const handleunFollow = async (targetUserId, type) => {
        if (!user) return;
        try {
          await userService.unfollowUser(user, targetUserId);
          setisFollowing(false)
        } catch (error) {
          console.error("Error following user:", error);
          alert("Failed to follow user. Please try again.");
        }
      };


    useEffect(() => {
        const fetchProfile = async () => {
            if (!profileId) return;            
            try {
                setLoading(true);
                const profileData = await userService.getProfile(profileId);
                setProfile(profileData);

                setisFollowing(profileData?.is_following_requester)
            } catch (error) {
                console.error('Error fetching profile:', error);
                setError('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [profileId]);

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto fade-in">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="text-gray-500 ml-2">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="max-w-4xl mx-auto fade-in">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                    <div className="text-center">
                        <p className="text-red-500 mb-4">{error || 'Profile not found'}</p>
                        <button
                            onClick={() => setActiveScreen && setActiveScreen('discover')}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                        >
                            Back to Discovery
                        </button>
                    </div>
                </div>
            </div>
        );
    }

   
    const profileType = profile.is_organization ? 'Organization' : 'Student';
    
    const joinedDate = new Date(profile.created_at).getFullYear();

  

    const upcomingEvents = [
        { id: 'tech-career-fair-org', title: 'Tech Career Fair', date: 'Tomorrow', time: '2:00 PM - 6:00 PM', location: 'Student Union Hall', attendees: '234' },
        { id: 'ai-workshop-org', title: 'AI Workshop', date: 'Next Week', time: '3:00 PM - 5:00 PM', location: 'Engineering Building', attendees: '45' },
    ];

    const handleClick=()=>{
         isFollowing ?  handleunFollow(
                                    profile.user_id,
                                    profile.is_organization ? "organization" : "user"
                                  ) :
                                 handleFollow(
                                     profile.user_id,
                                     profile.is_organization ? "organization" : "user"
                                  )
    }

    return (
        <div className="max-w-4xl mx-auto fade-in">
            <div className="mb-6">
                <button
                    onClick={() => setActiveScreen && setActiveScreen('discover')}
                    className="text-gray-600 hover:text-gray-800 flex items-center"
                >
                    ← Back to Discovery
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
                <div className="flex items-start space-x-6">
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-2xl ${
                        profile.is_organization ? 'bg-primary' : 'bg-gradient-to-br from-blue-400 to-green-400'
                    }`}>
                        {profile.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                            <h1 className="font-heading font-bold text-3xl text-gray-900">
                                {profile.username}
                            </h1>
                            <span className="text-blue-500 text-xl">✓</span>
                        </div>
                        <p className="text-gray-600 mb-2">{profile.email}</p>
                        <p className="text-gray-600 mb-4">{profileType}</p>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                            <div>
                                <span className="font-semibold text-gray-900">{profile.followers_count}</span> followers
                            </div>
                            <div>
                                <span className="font-semibold text-gray-900">{profile.following_count}</span> following
                            </div>
                            <div>
                                <span className="font-semibold text-gray-900">Joined</span> {joinedDate}
                            </div>
                        </div>
                        
                        <div className="flex space-x-4">
                            <button
                               onClick={handleClick}
                                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                                    isFollowing 
                                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                                        : 'bg-primary text-white hover:bg-primary/90'
                                          }`}
                    
                            >
                                {isFollowing ? 'Unfollow' : 'Follow'}
                            </button>
                            <button className="border border-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                                Contact
                            </button>
                        </div>
                    </div>
                </div>
            </div>
                   {/* Events Section - Only show if it's an organization */}
            {/* {profile.is_organization && ( */}
                {/* <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="font-heading font-bold text-xl text-gray-900 mb-6">Upcoming Events</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {upcomingEvents.map(event => (
                            <div key={event.id} className="border border-gray-200 rounded-lg overflow-hidden">
                                <div className="h-32 bg-gradient-to-br from-purple-400 to-pink-400 relative">
                                    <div className="absolute bottom-4 left-4 text-white">
                                        <h3 className="font-bold">{event.title}</h3>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <p className="text-sm text-gray-600 mb-2">{event.date} • {event.time}</p>
                                    <p className="text-sm text-gray-600 mb-4">{event.location}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">{event.attendees} attending</span>
                                        <button
                                            onClick={() => onRsvp && onRsvp(event.id, event.title)}
                                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                                rsvpedEvents?.has(event.id) 
                                                    ? 'bg-accent text-white hover:bg-accent/90' 
                                                    : 'bg-primary text-white hover:bg-primary/90'
                                            }`}
                                        >
                                            {rsvpedEvents?.has(event.id) ? '✓ Going' : 'RSVP'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div> */}
            {/* )} */}

            {/* User Profile Section - Show if it's a regular user */}
       
            {/* {!profile.is_organization && ( */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="font-heading font-bold text-xl text-gray-900 mb-6">About</h2>
                    <div className="text-gray-600">
                        <p>Student profile • Member since {joinedDate}</p>
                        <p className="mt-2">Following {profile.following_count} users and organizations</p>
                    </div>
                </div>
            {/* )} */}
        </div>
    );
};

export default OrganizationProfileScreen;