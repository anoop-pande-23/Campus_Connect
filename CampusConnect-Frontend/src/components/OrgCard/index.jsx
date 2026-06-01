import React from 'react';

const OrgCard = ({ org, onFollow, isFollowing, onCardClick,openProfile  }) => {
    console.log(org,"org.followers_count")
    return (
        <div onClick={() => openProfile(org.id)} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{org.username}</span>
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 cursor-pointer hover:text-primary">{org.name}</h3>
                    <p className="text-sm text-gray-600">{org.followers} followers</p>
                </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">{""}</p>
            {/* <button
                onClick={() => onFollow(org.id, 'organization')}
                className={`w-full py-2 rounded-lg font-semibold transition-colors ${isFollowing ? 'bg-accent text-white hover:bg-accent/90' : 'bg-primary text-white hover:bg-primary/90'}`}
            >
                {isFollowing ? '✓ Following' : 'Follow'}
            </button> */}
        </div>
    );
};

export default OrgCard;