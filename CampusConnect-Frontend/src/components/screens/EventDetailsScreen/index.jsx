// Placeholder for EventDetailsScreen
import React,{useState,useEffect} from 'react';
import { userService } from '../../../utils/apiClient';
const eventDetails = {
    id: 'tech-career-fair-detail',
    title: 'Tech Career Fair',
    organizer: 'Engineering Society',
    date: 'March 15, 2024',
    time: '2:00 PM - 6:00 PM PST',
    location: 'Student Union Hall',
    address: '2495 Bancroft Way, Berkeley, CA',
    attendees: 234,
    attendeesCount: 333,
    isAttending: true,
    dateTime: "2026-01-15T10:00:00.000Z",
    category: 'Career',
    description: "Join us for the biggest tech career fair of the year! Connect with representatives from leading technology companies including Google, Microsoft, Apple, and many exciting startups. This event is perfect for students looking for internships, full-time positions, or just wanting to learn more about career opportunities in tech.",
    schedule: [
        { time: '2:00 PM', title: 'Registration & Check-in', details: 'Get your name tag and event materials' },
        { time: '2:30 PM', title: 'Career Fair Opens', details: 'Start networking with company representatives' },
        { time: '4:00 PM', title: 'Tech Panel Discussion', details: '"Future of Technology" with industry leaders' },
        { time: '5:30 PM', title: 'Networking Reception', details: 'Casual networking with refreshments' },
    ]
};




const EventDetailsScreen = ({ onRsvp, rsvpedEvents, setActiveScreen,eventDetails,   openProfile }) => {
    const isRsvped = rsvpedEvents.has(eventDetails.id);

    const [hostProfile, setHostProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [schedule,setSchedule] = useState([
        { time: '2:00 PM', title: 'Registration & Check-in', details: 'Get your name tag and event materials' },
        { time: '2:30 PM', title: 'Career Fair Opens', details: 'Start networking with company representatives' },
        { time: '4:00 PM', title: 'Tech Panel Discussion', details: '"Future of Technology" with industry leaders' },
        { time: '5:30 PM', title: 'Networking Reception', details: 'Casual networking with refreshments' },
    ])

    // Format date and time from ISO string
    const formatDateTime = (isoString) => {
        const date = new Date(isoString);
        const dateStr = date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        const timeStr = date.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
        return { dateStr, timeStr };
    };

    const { dateStr, timeStr } = formatDateTime(eventDetails.dateTime);

    useEffect(() => {
        const fetchHostProfile = async () => {
            try {
                setLoading(true);
                const profile = await userService.getProfile(eventDetails?.host?.id);
                setHostProfile(profile);
            } catch (error) {
                console.error('Error fetching host profile:', error);
            } finally {
                setLoading(false);
            }
        };

        if (eventDetails?.host?.id) {
            fetchHostProfile();
        }
    }, [eventDetails?.host?.id]);


    return (
        <div className="max-w-4xl mx-auto fade-in">
            <div className="bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                        <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
                           {dateStr.split(',')[0]} • {timeStr}
                        </span>
                        <button onClick={() => window.history.back()} className="text-white/80 hover:text-white">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <h1 className="font-heading font-bold text-4xl mb-2">{eventDetails.title}</h1>
                    <p className="text-xl text-white/90 mb-4">Connect with top tech companies and explore career opportunities</p>
                    <div className="flex items-center space-x-6 text-white/90">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            {eventDetails.attendeesCount} attending
                        </div>
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                            {eventDetails.location}
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="font-heading font-bold text-xl text-gray-900 mb-4">About This Event</h2>
                        <div className="prose text-gray-600">
                            <p>Join us for the biggest tech career fair of the year! Connect with representatives from leading technology companies including Google, Microsoft, Apple, and many exciting startups. This event is perfect for students looking for internships, full-time positions, or just wanting to learn more about career opportunities in tech.,</p>
                            <h3 className="font-semibold text-gray-900 mt-4 mb-2">What to Expect:</h3>
                            <ul className="list-disc list-inside space-y-1">
                                <li>50+ companies with booths and representatives</li>
                                <li>On-the-spot interviews and networking opportunities</li>
                                <li>Resume review sessions</li>
                                <li>Tech talks and panel discussions</li>
                                <li>Free swag and refreshments</li>
                            </ul>
                        </div>
                    </div>
                    {/* <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="font-heading font-bold text-xl text-gray-900 mb-4">Schedule</h2>
                        <div className="space-y-4">
                            {schedule.map((item, index) => (
                                <div key={index} className="flex items-start space-x-4">
                                    <div className="w-16 text-sm font-semibold text-gray-600">{item.time}</div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                                        <p className="text-sm text-gray-600">{item.details}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div> */}
                </div>
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="text-center mb-4">
                            <div className="text-2xl font-bold text-gray-900 mb-1">{eventDetails.attendeesCount}</div>
                            <div className="text-sm text-gray-600">people attending</div>
                        </div>
                        <button
                            onClick={() => onRsvp(eventDetails.id, eventDetails.title)}
                            className={`w-full py-3 rounded-lg font-semibold transition-colors mb-4 ${isRsvped ? 'bg-accent text-white hover:bg-accent/90' : 'bg-primary text-white hover:bg-primary/90'}`}
                        >
                            {eventDetails?.isAttending ? '✓ Going' : 'RSVP for Free'}
                        </button>
                        <div className="text-xs text-gray-500 text-center">
                            By RSVPing, you agree to follow the event guidelines
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-heading font-bold text-lg text-gray-900 mb-4">Event Details</h3>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3"><svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg><div><div className="font-semibold text-gray-900">{eventDetails.date}</div><div className="text-sm text-gray-600">{timeStr}</div></div></div>
                            <div className="flex items-start space-x-3"><svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg><div><div className="font-semibold text-gray-900">{eventDetails.location}</div><div className="text-sm text-gray-600">{eventDetails.location}</div></div></div>
                            <div className="flex items-start space-x-3"><svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg><div><div className="font-semibold text-gray-900">{eventDetails.category}</div><div className="text-sm text-gray-600">Professional Development</div></div></div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-heading font-bold text-lg text-gray-900 mb-4">Organized by</h3>
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                                <span className="text-white font-bold">ES</span>
                            </div>
                            <div>
                                <div className="font-semibold text-gray-900 cursor-pointer hover:text-primary">{hostProfile?.username}</div>
                                <div className="text-sm text-gray-600">{hostProfile?.followers_count} followers</div>
                            </div>
                        </div>
                        {/* <button className="w-full bg-accent text-white py-2 rounded-lg font-semibold hover:bg-accent/90 transition-colors mb-2">
                            ✓ Following
                        </button> */}
                        <button onClick={() => openProfile(eventDetails?.host?.id)}  className="w-full border border-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                            View Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetailsScreen;