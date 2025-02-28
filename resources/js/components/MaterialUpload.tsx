import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Material } from '../types';

interface MaterialUploadProps {
    eventId: number;
}

const MaterialUpload: React.FC<MaterialUploadProps> = ({ eventId }) => {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [materialName, setMaterialName] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const response = await axios.get(`/api/events/${eventId}/materials`);
                setMaterials(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load materials');
                setLoading(false);
            }
        };

        fetchMaterials();
    }, [eventId]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            
            // Auto-fill the name field with the filename if empty
            if (!materialName) {
                setMaterialName(e.target.files[0].name);
            }
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!file) {
            setError('Please select a file to upload');
            return;
        }

        setUploading(true);
        setError(null);
        setSuccessMessage(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', materialName || file.name);

        try {
            const response = await axios.post(`/api/events/${eventId}/materials`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            setMaterials([...materials, response.data]);
            setMaterialName('');
            setFile(null);
            setSuccessMessage('Material uploaded successfully');
            setUploading(false);
            
            // Reset the file input
            const fileInput = document.getElementById('file-upload') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
            
        } catch (err) {
            setError('Failed to upload material. Please try again.');
            setUploading(false);
        }
    };

    const handleDelete = async (materialId: number) => {
        if (!confirm('Are you sure you want to delete this material?')) {
            return;
        }

        try {
            await axios.delete(`/api/materials/${materialId}`);
            setMaterials(materials.filter(m => m.id !== materialId));
        } catch (err) {
            setError('Failed to delete material');
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    if (loading) return <div className="text-center p-4">Loading materials...</div>;

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Event Materials</h2>
            
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

            {/* Upload Form */}
            <form onSubmit={handleUpload} className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-medium mb-3">Upload New Material</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="material-name">
                            Material Name
                        </label>
                        <input
                            type="text"
                            id="material-name"
                            value={materialName}
                            onChange={(e) => setMaterialName(e.target.value)}
                            placeholder="Enter material name"
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="file-upload">
                            File
                        </label>
                        <input
                            type="file"
                            id="file-upload"
                            onChange={handleFileChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={uploading || !file}
                    className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded ${(uploading || !file) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {uploading ? 'Uploading...' : 'Upload Material'}
                </button>
            </form>

            {/* Materials List */}
            {materials.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-4 text-left">Name</th>
                                <th className="py-2 px-4 text-left">Type</th>
                                <th className="py-2 px-4 text-left">Size</th>
                                <th className="py-2 px-4 text-left">Uploaded</th>
                                <th className="py-2 px-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {materials.map(material => (
                                <tr key={material.id} className="border-t">
                                    <td className="py-2 px-4">{material.name}</td>
                                    <td className="py-2 px-4">{material.file_type || 'Unknown'}</td>
                                    <td className="py-2 px-4">{material.file_size ? formatFileSize(material.file_size) : 'Unknown'}</td>
                                    <td className="py-2 px-4">{new Date(material.created_at).toLocaleDateString()}</td>
                                    <td className="py-2 px-4">
                                        <div className="flex space-x-2">
                                            <a
                                                href={`/api/materials/${material.id}/download`}
                                                className="text-blue-500 hover:text-blue-700"
                                                download
                                            >
                                                Download
                                            </a>
                                            <button
                                                onClick={() => handleDelete(material.id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No materials have been uploaded yet.</p>
                </div>
            )}
        </div>
    );
};

export default MaterialUpload;