import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Event } from '../types';

const EventList = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get<Event[]>('/api/events');
                setEvents(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load events. Please try again later.');
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    const handleCreateEvent = () => {
        navigate('/events/create');
    };

    if (loading) return <div className="text-center p-4">Loading events...</div>;
    if (error) return <div className="text-red-500 p-4">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">My Events</h1>
                <button 
                    onClick={handleCreateEvent}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Create New Event
                </button>
            </div>

            {events.length === 0 ? (
                <div className="text-center p-8 bg-gray-100 rounded-lg">
                    <p className="text-lg text-gray-600">You don't have any events yet.</p>
                    <p className="mt-2">Create your first event to get started!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {events.map(event => (
                        <div 
                            key={event.id} 
                            className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={() => navigate(`/events/${event.id}`)}
                        >
                            <div className="bg-blue-50 p-4">
                                <h2 className="text-xl font-semibold truncate">{event.title}</h2>
                                <p className="text-sm text-gray-500">{event.location || 'No location specified'}</p>
                            </div>
                            <div className="p-4">
                                <p className="text-sm">
                                    <span className="font-medium">Starts:</span> {formatDate(event.start_date)}
                                </p>
                                <p className="text-sm">
                                    <span className="font-medium">Ends:</span> {formatDate(event.end_date)}
                                </p>
                                <p className="mt-2 text-sm text-gray-700 line-clamp-2">
                                    {event.description || 'No description provided'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EventList;