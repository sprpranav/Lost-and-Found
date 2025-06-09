const express = require('express');
const multer = require('multer');
const path = require('path');
const Item = require('../models/Item');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// Get all items
router.get('/', async (req, res) => {
    try {
        const { type, category, search } = req.query;
        let filter = { status: 'active' };

        if (type) filter.type = type;
        if (category) filter.category = category;
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } }
            ];
        }

        const items = await Item.find(filter)
            .populate('user', 'name email phone')
            .sort({ createdAt: -1 });

        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get single item
router.get('/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id).populate('user', 'name email phone');
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Create new item
router.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        const { title, description, category, type, location, date } = req.body;

        const itemData = {
            title,
            description,
            category,
            type,
            location,
            date,
            user: req.user._id,
            contactInfo: {
                name: req.user.name,
                phone: req.user.phone,
                email: req.user.email
            }
        };

        if (req.file) {
            itemData.image = req.file.filename;
        }

        const item = new Item(itemData);
        await item.save();

        const populatedItem = await Item.findById(item._id).populate('user', 'name email phone');
        res.status(201).json(populatedItem);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get user's items
router.get('/user/my-items', auth, async (req, res) => {
    try {
        const items = await Item.find({ user: req.user._id })
            .populate('user', 'name email phone')
            .sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update item status
router.patch('/:id/status', auth, async (req, res) => {
    try {
        const { status } = req.body;
        const item = await Item.findOne({ _id: req.params.id, user: req.user._id });

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        item.status = status;
        await item.save();

        res.json(item);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete item
router.delete('/:id', auth, async (req, res) => {
    try {
        const item = await Item.findOne({ _id: req.params.id, user: req.user._id });

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        await Item.findByIdAndDelete(req.params.id);
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;