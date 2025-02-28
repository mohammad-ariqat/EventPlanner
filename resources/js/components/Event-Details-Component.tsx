import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Event, Participant, Material } from '../types';
import ParticipantManagement from './ParticipantManagement';
import MaterialUpload from './MaterialUpload';
import FeedbackManagement from './FeedbackManagement';

const EventDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('details');

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await axios.get(`/api/events/${id}`);
                setEvent(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load event details');
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    const handleDeleteEvent = async () => {
        if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
            return;
        }

        try {
            await axios.delete(`/api/events/${id}`);
            navigate('/events');
        } catch (err) {
            setError('Failed to delete event');
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    if (loading) return <div className="text-center p-4">Loading event details...</div>;
    if (error) return <div className="text-red-500 p-4">{error}</div>;
    if (!event) return <div className="text-center p-4">Event not found</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">{event.title}</h1>
                <div className="space-x-2">
                    <button 
                        onClick={() => navigate(`/events/${id}/edit`)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Edit Event
                    </button>
                    <button 
                        onClick={handleDeleteEvent}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                    >
                        Delete Event
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <div className="border-b">
                    <nav className="flex">
                        <button
                            className={`py-4 px-6 text-sm font-medium ${activeTab === 'details' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('details')}
                        >
                            Event Details
                        </button>
                        <button
                            className={`py-4 px-6 text-sm font-medium ${activeTab === 'participants' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('participants')}
                        >
                            Participants
                        </button>
                        <button
                            className={`py-4 px-6 text-sm font-medium ${activeTab === 'materials' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('materials')}
                        >
                            Materials
                        </button>
                        <button
                            className={`py-4 px-6 text-sm font-medium ${activeTab === 'feedback' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('feedback')}
                        >
                            Feedback
                        </button>
                    </nav>
                </div>

                <div className="p-6">
                    {activeTab === 'details' && (
                        <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-medium mb-2">Event Information</h3>
                                    {event.description && (
                                        <p className="text-gray-700 mb-4">{event.description}</p>
                                    )}
                                    <div className="space-y-2">
                                        <p>
                                            <span className="font-medium">Location:</span> {event.location || 'No location specified'}
                                        </p>
                                        <p>
                                            <span className="font-medium">Start Date:</span> {formatDate(event.start_date)}
                                        </p>
                                        <p>
                                            <span className="font-medium">End Date:</span> {formatDate(event.end_date)}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium mb-2">Event Stats</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-blue-50 rounded-lg">
                                            <p className="text-sm text-gray-500">Participants</p>
                                            <p className="text-2xl font-bold">{event.participants?.length || 0}</p>
                                        </div>
                                        <div className="p-4 bg-green-50 rounded-lg">
                                            <p className="text-sm text-gray-500">Confirmed</p>
                                            <p className="text-2xl font-bold">
                                                {event.participants?.filter(p => p.status === 'confirmed').length || 0}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-yellow-50 rounded-lg">
                                            <p className="text-sm text-gray-500">Materials</p>
                                            <p className="text-2xl font-bold">{event.materials?.length || 0}</p>
                                        </div>
                                        <div className="p-4 bg-purple-50 rounded-lg">
                                            <p className="text-sm text-gray-500">Feedback</p>
                                            <p className="text-2xl font-bold">{event.feedback?.length || 0}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'participants' && (
                        <ParticipantManagement eventId={parseInt(id as string)} />
                    )}

                    {activeTab === 'materials' && (
                        <MaterialUpload eventId={parseInt(id as string)} />
                    )}

                    {activeTab === 'feedback' && (
                        <FeedbackManagement eventId={parseInt(id as string)} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventDetail;