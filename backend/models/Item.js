const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Electronics', 'Clothing', 'Accessories', 'Documents', 'Keys', 'Books', 'Other']
    },
    type: {
        type: String,
        required: true,
        enum: ['lost', 'found']
    },
    location: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    image: {
        type: String,
        default: null
    },
    contactInfo: {
        name: String,
        phone: String,
        email: String
    },
    status: {
        type: String,
        enum: ['active', 'resolved'],
        default: 'active'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Item', itemSchema);