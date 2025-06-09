import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ItemCard from '../components/ItemCard';
import { api } from '../utils/api';

const MyItems = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }
        fetchMyItems();
    }, [user, navigate]);

    const fetchMyItems = async () => {
        try {
            const response = await api.get('/items/user/my-items');
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (itemId, newStatus) => {
        try {
            await api.patch(`/items/${itemId}/status`, { status: newStatus });
            fetchMyItems(); // Refresh the list
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleDelete = async (itemId) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await api.delete(`/items/${itemId}`);
                fetchMyItems(); // Refresh the list
            } catch (error) {
                console.error('Error deleting item:', error);
            }
        }
    };

    if (!user) {
        return <div className="loading">Please login to view your items.</div>;
    }

    return (
        <div className="container">
            <h1 style={{ color: 'white', textAlign: 'center', marginBottom: '2rem' }}>
                My Posted Items
            </h1>

            {loading ? (
                <div className="loading">Loading your items...</div>
            ) : items.length > 0 ? (
                <div className="items-grid">
                    {items.map(item => (
                        <div key={item._id} style={{ position: 'relative' }}>
                            <ItemCard item={item} />
                            <div style={{ 
                                position: 'absolute', 
                                top: '10px', 
                                right: '10px',
                                display: 'flex',
                                gap: '5px'
                            }}>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleStatusChange(
                                            item._id, 
                                            item.status === 'active' ? 'resolved' : 'active'
                                        );
                                    }}
                                    className={`btn ${item.status === 'active' ? 'btn-secondary' : 'btn-primary'}`}
                                    style={{ 
                                        fontSize: '0.8rem', 
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '15px'
                                    }}
                                >
                                    {item.status === 'active' ? 'Mark Resolved' : 'Mark Active'}
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(item._id);
                                    }}
                                    className="btn btn-danger"
                                    style={{ 
                                        fontSize: '0.8rem', 
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '15px'
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <h3>No items posted yet</h3>
                    <p>Start by posting your first lost or found item!</p>
                    <button 
                        onClick={() => navigate('/post')}
                        className="btn btn-primary"
                    >
                        Post an Item
                    </button>
                </div>
            )}
        </div>
    );
};

export default MyItems;