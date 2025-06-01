const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const mongobd = require('../data/database');

// Register new user
exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        const db = mongobd.getDatabase().db();
        const existing = await db.collection('users').findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'Email already registered' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = { email, password: hashedPassword };
        await db.collection('users').insertOne(user);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Local login
exports.login = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        const db = mongobd.getDatabase().db();
        const user = await db.collection('users').findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Log the user in (using session)
        req.login(user, function(err) {
            if (err) { return next(err); }
            return res.json({ message: 'Login successful' });
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};