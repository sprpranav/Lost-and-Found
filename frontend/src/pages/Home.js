import React, { useState, useEffect } from 'react';
import ItemCard from '../components/ItemCard';
import { api } from '../utils/api';

const Home = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        type: '',
        category: '',
        search: ''
    });

    const categories = [
        'Electronics', 'Clothing', 'Accessories', 'Documents', 'Keys', 'Books', 'Other'
    ];

    useEffect(() => {
        fetchItems();
    }, [filters]);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (filters.type) params.append('type', filters.type);
            if (filters.category) params.append('category', filters.category);
            if (filters.search) params.append('search', filters.search);

            const response = await api.get(`/items?${params}`);
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div>
            <section className="hero">
                <div className="container">
                    <h1>Lost & Found Community</h1>
                    <p>Help reunite people with their lost belongings</p>
                </div>
            </section>

            <div className="container">
                <div className="search-section">
                    <div className="search-filters">
                        <div className="form-group">
                            <label>Search</label>
                            <input
                                type="text"
                                name="search"
                                placeholder="Search items..."
                                className="form-control"
                                value={filters.search}
                                onChange={handleFilterChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Type</label>
                            <select
                                name="type"
                                className="form-control"
                                value={filters.type}
                                onChange={handleFilterChange}
                            >
                                <option value="">All Types</option>
                                <option value="lost">Lost Items</option>
                                <option value="found">Found Items</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Category</label>
                            <select
                                name="category"
                                className="form-control"
                                value={filters.category}
                                onChange={handleFilterChange}
                            >
                                <option value="">All Categories</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="loading">Loading items...</div>
                ) : items.length > 0 ? (
                    <div className="items-grid">
                        {items.map(item => (
                            <ItemCard key={item._id} item={item} />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <h3>No items found</h3>
                        <p>Try adjusting your search filters or be the first to post an item!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;