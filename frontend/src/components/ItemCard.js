import React from 'react';
import { useNavigate } from 'react-router-dom';

const ItemCard = ({ item }) => {
    const navigate = useNavigate();

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const getImageUrl = (imageName) => {
        return imageName ? `http://localhost:5000/uploads/${imageName}` : null;
    };

    return (
        <div className="item-card" onClick={() => navigate(`/item/${item._id}`)}>
            <div className="item-image">
                {item.image ? (
                    <img 
                        src={getImageUrl(item.image)} 
                        alt={item.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                ) : (
                    <span>📷</span>
                )}
            </div>
            
            <div className="item-content">
                <span className={`item-type type-${item.type}`}>
                    {item.type === 'lost' ? '🔍 Lost' : '✅ Found'}
                </span>
                
                <h3 className="item-title">{item.title}</h3>
                
                <p className="item-description">
                    {item.description.length > 100 
                        ? `${item.description.substring(0, 100)}...` 
                        : item.description
                    }
                </p>
                
                <div className="item-meta">
                    <span>📍 {item.location}</span>
                    <span>📅 {formatDate(item.date)}</span>
                </div>
                
                <div className="item-meta" style={{ marginTop: '0.5rem' }}>
                    <span>🏷️ {item.category}</span>
                    <span className={`status-badge status-${item.status}`}>
                        {item.status}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ItemCard;