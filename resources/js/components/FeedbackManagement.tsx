import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Feedback, Participant } from '../types';

interface FeedbackManagementProps {
    eventId: number;
}

const FeedbackManagement: React.FC<FeedbackManagementProps> = ({ eventId }) => {
    const [feedback, setFeedback] = useState<Feedback[]>([]);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [feedbackResponse, participantsResponse] = await Promise.all([
                    axios.get(`/api/events/${eventId}/feedback`),
                    axios.get(`/api/events/${eventId}/participants`)
                ]);
                
                setFeedback(feedbackResponse.data);
                setParticipants(participantsResponse.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load feedback data');
                setLoading(false);
            }
        };

        fetchData();
    }, [eventId]);

    const getParticipantName = (participantId: number) => {
        const participant = participants.find(p => p.id === participantId);
        return participant ? participant.name : 'Unknown';
    };

    const getAverageRating = () => {
        if (feedback.length === 0) return 0;
        
        const validRatings = feedback.filter(f => f.rating !== null).map(f => f.rating as number);
        if (validRatings.length === 0) return 0;
        
        const sum = validRatings.reduce((total, rating) => total + rating, 0);
        return (sum / validRatings.length).toFixed(1);
    };

    const getFeedbackRate = () => {
        if (participants.length === 0) return '0%';
        const participantsWithFeedback = new Set(feedback.map(f => f.participant_id));
        return `${Math.round((participantsWithFeedback.size / participants.length) * 100)}%`;
    };

    const handleSendFeedbackRequest = async () => {
        setError(null);
        setSuccessMessage(null);

        try {
            // This would trigger an email to participants requesting feedback
            await axios.post(`/api/events/${eventId}/feedback/request`);
            setSuccessMessage('Feedback request sent to all participants');
        } catch (err) {
            setError('Failed to send feedback request');
        }
    };

    if (loading) return <div className="text-center p-4">Loading feedback data...</div>;

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Event Feedback</h2>
            
            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                    {error}
                </div>
            )}
            
            {successMessage && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
                    {successMessage}
                </div>
            )}

            {/* Feedback Overview */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-medium mb-3">Feedback Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-500">Average Rating</p>
                        <div className="flex items-end mt-1">
                            <span className="text-2xl font-bold">{getAverageRating()}</span>
                            <span className="text-gray-500 ml-1">/5</span>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-500">Feedback Received</p>
                        <p className="text-2xl font-bold">{feedback.length}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-500">Response Rate</p>
                        <p className="text-2xl font-bold">{getFeedbackRate()}</p>
                    </div>
                </div>

                <div className="mt-4">
                    <button
                        onClick={handleSendFeedbackRequest}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Request Feedback from Participants
                    </button>
                </div>
            </div>

            {/* Feedback List */}
            {feedback.length > 0 ? (
                <div>
                    <h3 className="text-lg font-medium mb-3">Feedback Responses</h3>
                    <div className="space-y-4">
                        {feedback.map(item => (
                            <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="font-medium">{getParticipantName(item.participant_id)}</p>
                                        <p className="text-sm text-gray-500">{new Date(item.created_at).toLocaleDateString()}</p>
                                    </div>
                                    {item.rating !== null && (
                                        <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded font-medium">
                                            Rating: {item.rating}/5
                                        </div>
                                    )}
                                </div>
                                {item.comments && (
                                    <div className="mt-2 text-gray-700">
                                        {item.comments}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No feedback has been submitted yet.</p>
                </div>
            )}
        </div>
    );
};

export default FeedbackManagement;