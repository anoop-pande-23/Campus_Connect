import React from 'react';

const AttendeeModal = ({ event, attendees, onClose }) => {
    // Note: 'attendees' is an array of User objects [{ id, username, isOrganization }]
    if (!event || !attendees || !onClose) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all duration-300 scale-100">
                <div className="p-6 border-b bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-900">Attendees for "{event.title}"</h2>
                    <p className="text-sm text-gray-500">{attendees.length} people confirmed</p>
                </div>
                
                {/* Scrollable List of Attendees */}
                <div className="max-h-80 overflow-y-auto p-6 space-y-4">
                    {attendees.length === 0 && (
                        <p className="text-center text-gray-500 italic">No attendees found yet.</p>
                    )}
                    {attendees.map(user => (
                        <div key={user.id} className="flex items-center space-x-4 border-b pb-2 last:border-b-0">
                            <div className="w-10 h-10 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-700 font-semibold flex-shrink-0">
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800">{user.username}</p>
                                <p className="text-xs text-gray-500">
                                    {user.isOrganization ? 'Organization Host' : 'Student'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Footer and Close Button */}
                <div className="p-4 border-t flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-semibold transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AttendeeModal;