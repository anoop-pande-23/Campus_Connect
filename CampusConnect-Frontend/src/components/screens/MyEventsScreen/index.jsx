// Placeholder for MyEventsScreen
import React, { useState ,useEffect} from 'react';
import { useAuth } from '../../../contexts/AuthContext'; 
import { eventService } from '../../../utils/apiClient'; 
import { graphqlService } from '../../../utils/graphqlService'; 
import AttendeeModal from '../../modal/AttendeeModal'; // <-- Make sure this import is correct
const MyEventsScreen = ({eventDetails}) => {

    const { user } = useAuth(); 

    const [activeTab, setActiveTab] = useState('attending');
    const [attendingEvents, setAttendingEvents] = useState([]);
    const [createdEvents, setCreatedEvents] = useState([]);
    const [pastEvents, setPastEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loadingEventId, setLoadingEventId] = useState(null); // Track which event is being processed

    const userId = user 


    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEventAttendees, setSelectedEventAttendees] = useState(null);
    const [selectedEventTitle, setSelectedEventTitle] = useState('');

    const handleViewAttendees = (event) => {
        // CRITICAL: event.attendeesList is the array of {id, username, isOrganization} 
        setSelectedEventAttendees(event.attendeesList);
        setSelectedEventTitle(event.title);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedEventAttendees(null);
        setSelectedEventTitle('');
    };

    useEffect(() => {
        const loadDashboardEvents = async () => {
            if (!userId) {
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            setError(null);

            try {
    
                const dashboardData = await graphqlService.getUserDashboardEvents(userId);
                
                const now = new Date();
                const allAttending = dashboardData.attendingEvents || [];
                const allCreated = dashboardData.createdEvents || [];

                // 1. Split Attending into Current vs. Past
                const currentAttending = allAttending.filter(event => new Date(event.dateTime) >= now);
                const pastAttended = allAttending.filter(event => new Date(event.dateTime) < now);

                // 2. Filter Created Events (Only show future created events in the 'Created' tab)
                const currentCreated = allCreated.filter(event => new Date(event.dateTime) >= now);

                setAttendingEvents(currentAttending);
                setCreatedEvents(allCreated);
                setPastEvents(pastAttended); // Past events are defined as those the user RSVP'd to that are over.

            } catch (err) {
                console.error("Dashboard Fetch Error:", err);
                setError("Failed to load events. Please check network connection.");
            } finally {
                setIsLoading(false);
            }
        };

        loadDashboardEvents();
    }, [userId]);

     const handleLeaveEvent = async (eventId) => {
        setLoadingEventId(eventId);
        try {
            await eventService.cancelRsvp(eventId);
            
            setAttendingEvents(prev => prev.filter(event => event.id !== eventId));
            
            console.log('Successfully left the event');
            
        } catch (error) {
            console.error('Failed to leave event:', error);
            setError('Failed to leave event. Please try again.');
        } finally {
            setLoadingEventId(null);
        }
    };


    // --- Helper Function for Formatting Dates ---
    const formatEventDate = (dateTime) => {
        try {
            const date = new Date(dateTime);
            return {
                time: date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
            };
        } catch (error) {
            return { time: "TBD" };
        }
    };

    const renderEvents = (events, type) => (
        <div className="space-y-4">
            {events.map(event => (
                <div key={event.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg"></div>
                        <div>
                            <h3 className="font-semibold text-gray-900">{event.title}</h3>
                            <p className="text-sm text-gray-600">{formatEventDate(event.dateTime).time} • {event.location}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                         {type === 'attending' && (
                            <>
                                <span className="text-sm text-gray-500">{event.attendeesCount} attending</span>
                                <button 
                                    onClick={() => handleLeaveEvent(event.id)}
                                    disabled={loadingEventId === event.id}
                                    className="text-error hover:text-error/80 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loadingEventId === event.id ? 'Leaving...' : 'Leave Event'}
                                </button>
                            </>
                        )}
                        {type === 'created' && (
                                <>
                                    <span className="text-sm text-gray-500">{event.attendeesCount} attending</span>
                                    {/* Button to show the list of attendees */}
                                    <button
                                        onClick={() => handleViewAttendees(event)}
                                        className="px-3 py-1 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 text-sm font-semibold transition-colors"
                                    >
                                        View Attendees ({event.attendeesList ? event.attendeesList.length : 0})
                                    </button>
                                    {/* <button className="text-primary hover:text-primary/80 text-sm font-semibold">Edit</button> */}
                                </>
                            )}
                        {type === 'past' && (
                            <>
                                <span className="text-sm text-gray-500">{event.status}</span>
                                <button className="text-primary hover:text-primary/80 text-sm font-semibold">Rate Event</button>
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );

    return ( 
        <> 
        <div className="fade-in">
            <div className="mb-8">
                <h1 className="font-heading font-bold text-3xl text-gray-900 mb-2">My Events</h1>
                <p className="text-gray-600">Manage your events and RSVPs</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6">
                        <button onClick={() => setActiveTab('attending')} className={`py-4 px-1 border-b-2 font-semibold text-sm ${activeTab === 'attending' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                            Attending ({attendingEvents.length})
                        </button>
                        <button onClick={() => setActiveTab('created')} className={`py-4 px-1 border-b-2 font-semibold text-sm ${activeTab === 'created' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                            Created ({createdEvents.length})
                        </button>
                        <button onClick={() => setActiveTab('past')} className={`py-4 px-1 border-b-2 font-semibold text-sm ${activeTab === 'past' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                            Past Events ({pastEvents.length})
                        </button>
                    </nav>
                </div>
                {activeTab === 'attending' && <div id="attending-events" className="p-6">{renderEvents(attendingEvents, 'attending')}</div>}
                {activeTab === 'created' && <div id="created-events" className="p-6">{renderEvents(createdEvents, 'created')}</div>}
                {activeTab === 'past' && <div id="past-events" className="p-6">{renderEvents(pastEvents, 'past')}</div>}
            </div>
        </div>

        {isModalOpen && selectedEventAttendees && (
                <AttendeeModal
                    // Pass the full event data for the title display
                    event={{title: selectedEventTitle}} 
                    attendees={selectedEventAttendees}
                    onClose={handleCloseModal}
                />
            )}
        </>   
    );
};

export default MyEventsScreen;