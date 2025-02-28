import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Participant } from '../types';

interface ParticipantManagementProps {
    eventId: number;
}

const ParticipantManagement: React.FC<ParticipantManagementProps> = ({ eventId }) => {
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [inviteEmails, setInviteEmails] = useState<string[]>(['']);
    const [inviteNames, setInviteNames] = useState<string[]>(['']);
    const [sending, setSending] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchParticipants = async () => {
            try {
                const response = await axios.get(`/api/events/${eventId}/participants`);
                setParticipants(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load participants');
                setLoading(false);
            }
        };

        fetchParticipants();
    }, [eventId]);

    const handleEmailChange = (index: number, value: string) => {
        const newEmails = [...inviteEmails];
        newEmails[index] = value;
        setInviteEmails(newEmails);
    };

    const handleNameChange = (index: number, value: string) => {
        const newNames = [...inviteNames];
        newNames[index] = value;
        setInviteNames(newNames);
    };

    const addInviteField = () => {
        setInviteEmails([...inviteEmails, '']);
        setInviteNames([...inviteNames, '']);
    };

    const removeInviteField = (index: number) => {
        if (inviteEmails.length > 1) {
            const newEmails = [...inviteEmails];
            const newNames = [...inviteNames];
            newEmails.splice(index, 1);
            newNames.splice(index, 1);
            setInviteEmails(newEmails);
            setInviteNames(newNames);
        }
    };

    const sendInvitations = async () => {
        // Filter out empty entries
        const emails = inviteEmails.filter(email => email.trim() !== '');
        const names = inviteNames.filter(name => name.trim() !== '');

        if (emails.length === 0 || names.length === 0 || emails.length !== names.length) {
            setError('Please provide both name and email for all invitees');
            return;
        }

        setSending(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await axios.post(`/api/events/${eventId}/participants/invite`, {
                emails,
                names
            });
            
            setParticipants([...participants, ...response.data]);
            setInviteEmails(['']);
            setInviteNames(['']);
            setSuccessMessage(`Successfully sent ${emails.length} invitation${emails.length > 1 ? 's' : ''}`);
            setSending(false);
        } catch (err) {
            setError('Failed to send invitations. Please check the email addresses and try again.');
            setSending(false);
        }
    };

    const updateParticipantStatus = async (participantId: number, status: string) => {
        try {
            const response = await axios.put(`/api/participants/${participantId}`, { status });
            
            // Update the participant in the local state
            setParticipants(participants.map(p => 
                p.id === participantId ? { ...p, status: status as 'invited' | 'confirmed' | 'declined' | 'attended' } : p
            ));
        } catch (err) {
            setError('Failed to update participant status');
        }
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'invited': return 'bg-yellow-100 text-yellow-800';
            case 'confirmed': return 'bg-green-100 text-green-800';
            case 'declined': return 'bg-red-100 text-red-800';
            case 'attended': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) return <div className="text-center p-4">Loading participants...</div>;

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Participants</h2>
            
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

            {/* Current Participants */}
            {participants.length > 0 ? (
                <div className="mb-8">
                    <h3 className="text-lg font-medium mb-2">Current Participants</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="py-2 px-4 text-left">Name</th>
                                    <th className="py-2 px-4 text-left">Email</th>
                                    <th className="py-2 px-4 text-left">Status</th>
                                    <th className="py-2 px-4 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {participants.map(participant => (
                                    <tr key={participant.id} className="border-t">
                                        <td className="py-2 px-4">{participant.name}</td>
                                        <td className="py-2 px-4">{participant.email}</td>
                                        <td className="py-2 px-4">
                                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(participant.status)}`}>
                                                {participant.status.charAt(0).toUpperCase() + participant.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="py-2 px-4">
                                            <select 
                                                value={participant.status}
                                                onChange={(e) => updateParticipantStatus(participant.id, e.target.value)}
                                                className="border rounded p-1 text-sm"
                                            >
                                                <option value="invited">Invited</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="declined">Declined</option>
                                                <option value="attended">Attended</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <p className="text-gray-500 mb-6">No participants yet. Invite people below!</p>
            )}

            {/* Invite New Participants */}
            <h3 className="text-lg font-medium mb-2">Invite Participants</h3>
            <div className="space-y-2 mb-4">
                {inviteEmails.map((email, index) => (
                    <div key={index} className="flex gap-2">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Name"
                                value={inviteNames[index]}
                                onChange={(e) => handleNameChange(index, e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className="flex-1">
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => handleEmailChange(index, e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => removeInviteField(index)}
                            disabled={inviteEmails.length <= 1}
                            className="p-2 text-red-500 hover:text-red-700 disabled:text-gray-300"
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex space-x-2">
                <button
                    type="button"
                    onClick={addInviteField}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
                >
                    Add Another
                </button>
                <button
                    type="button"
                    onClick={sendInvitations}
                    disabled={sending}
                    className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded ${sending ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {sending ? 'Sending...' : 'Send Invitations'}
                </button>
            </div>
        </div>
    );
};

export default ParticipantManagement;