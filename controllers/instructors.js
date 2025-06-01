const mongobd = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

// Get all instructors
const getAll = async (req, res) => {
    try {
        const result = await mongobd.getDatabase().db().collection('instructors').find();
        const instructors = await result.toArray();
        res.status(200).json(instructors);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Get single instructor by ID
const getSingle = async (req, res) => {
    try {
        const instructorId = new ObjectId(req.params.id);
        const instructor = await mongobd.getDatabase().db().collection('instructors').findOne({ _id: instructorId });
        if (!instructor) {
            return res.status(404).json({ message: 'Instructor not found' });
        }
        res.status(200).json(instructor);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Create instructor
const createInstructor = async (req, res) => {
    try {
        const instructor = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            department: req.body.department
        };
        const response = await mongobd.getDatabase().db().collection('instructors').insertOne(instructor);
        if (response.acknowledged) {
            res.status(201).json({ _id: response.insertedId, ...instructor });
        } else {
            res.status(500).json(response.error || 'Some error occurred while creating the instructor');
        }
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Update instructor
const updateInstructor = async (req, res) => {
    try {
        const instructorId = new ObjectId(req.params.id);
        const instructor = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            department: req.body.department
        };
        const response = await mongobd.getDatabase().db().collection('instructors').replaceOne({ _id: instructorId }, instructor);
        if (response.matchedCount === 0) {
            return res.status(404).json({ message: 'Instructor not found' });
        }
        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(200).json({ message: 'No changes made to the instructor' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete instructor
const deleteInstructor = async (req, res) => {
    try {
        const instructorId = new ObjectId(req.params.id);
        const response = await mongobd.getDatabase().db().collection('instructors').deleteOne({ _id: instructorId });
        if (response.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Instructor not found or already deleted' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    getAll,
    getSingle,
    createInstructor,
    updateInstructor,
    deleteInstructor
};