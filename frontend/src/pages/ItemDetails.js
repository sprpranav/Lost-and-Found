import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

const ItemDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchItem();
    }, [id]);

    const fetchItem = async () => {
        try {
            const response = await api.get(`/items/${id}`);
            setItem(response.data);
        } catch (error) {
            setError('Item not found');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getImageUrl = (imageName) => {
        return imageName ? `http://localhost:5000/uploads/${imageName}` : null;
    };

    if (loading) {
        return <div className="loading">Loading item details...</div>;
    }

    if (error || !item) {
        return (
            <div className="container">
                <div className="error" style={{ marginTop: '2rem' }}>
                    {error || 'Item not found'}
                </div>
                <button 
                    onClick={() => navigate('/')}
                    className="btn btn-primary"
                    style={{ marginTop: '1rem' }}
                >
                    Back to Home
                </button>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="form-container" style={{ maxWidth: '800px' }}>
                <button 
                    onClick={() => navigate('/')}
                    className="btn btn-secondary"
                    style={{ marginBottom: '1rem' }}
                >
                    ← Back to Items
                </button>

                <div style={{ display: 'grid', gridTemplateColumns: item.image ? '1fr 1fr' : '1fr', gap: '2rem' }}>
                    {item.image && (
                        <div>
                            <img 
                                src={getImageUrl(item.image)} 
                                alt={item.title}
                                style={{ 
                                    width: '100%', 
                                    borderRadius: '10px',
                                    boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                                }}
                            />
                        </div>
                    )}

                    <div>
                        <span className={`item-type type-${item.type}`} style={{ fontSize: '1rem', marginBottom: '1rem', display: 'inline-block' }}>
                            {item.type === 'lost' ? '🔍 Lost Item' : '✅ Found Item'}
                        </span>

                        <h1 style={{ marginBottom: '1rem', color: '#333' }}>{item.title}</h1>

                        <div style={{ marginBottom: '1rem' }}>
                            <span className={`status-badge status-${item.status}`} style={{ fontSize: '1rem' }}>
                                Status: {item.status}
                            </span>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ color: '#667eea', marginBottom: '0.5rem' }}>Description</h3>
                            <p style={{ lineHeight: '1.6', color: '#666' }}>{item.description}</p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                            <div>
                                <h4 style={{ color: '#667eea', marginBottom: '0.5rem' }}>📍 Location</h4>
                                <p style={{ color: '#666' }}>{item.location}</p>
                            </div>
                            <div>
                                <h4 style={{ color: '#667eea', marginBottom: '0.5rem' }}>📅 Date</h4>
                                <p style={{ color: '#666' }}>{formatDate(item.date)}</p>
                            </div>
                            <div>
                                <h4 style={{ color: '#667eea', marginBottom: '0.5rem' }}>🏷️ Category</h4>
                                <p style={{ color: '#666' }}>{item.category}</p>
                            </div>
                            <div>
                                <h4 style={{ color: '#667eea', marginBottom: '0.5rem' }}>📝 Posted</h4>
                                <p style={{ color: '#666' }}>{formatDate(item.createdAt)}</p>
                            </div>
                        </div>

                        {item.contactInfo && (
                            <div style={{ 
                                background: '#f8f9fa', 
                                padding: '1.5rem', 
                                borderRadius: '10px',
                                border: '2px solid #e9ecef'
                            }}>
                                <h3 style={{ color: '#667eea', marginBottom: '1rem' }}>Contact Information</h3>
                                <div style={{ display: 'grid', gap: '0.5rem' }}>
                                    <p><strong>Name:</strong> {item.contactInfo.name}</p>
                                    <p><strong>Email:</strong> <a href={`mailto:${item.contactInfo.email}`} style={{ color: '#667eea' }}>{item.contactInfo.email}</a></p>
                                    <p><strong>Phone:</strong> <a href={`tel:${item.contactInfo.phone}`} style={{ color: '#667eea' }}>{item.contactInfo.phone}</a></p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemDetails;