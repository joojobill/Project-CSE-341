const mongobd = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

// Get all courses
const getAll = async (req, res) => {
    try {
        const result = await mongobd.getDatabase().db().collection('courses').find();
        const courses = await result.toArray();
        res.status(200).json(courses);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Get single course by ID
const getSingle = async (req, res) => {
    try {
        const courseId = new ObjectId(req.params.id);
        const course = await mongobd.getDatabase().db().collection('courses').findOne({ _id: courseId });
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Create course
const createCourse = async (req, res) => {
    try {
        const course = {
            code: req.body.code,
            title: req.body.title,
            description: req.body.description,
            credits: req.body.credits
        };
        const response = await mongobd.getDatabase().db().collection('courses').insertOne(course);
        if (response.acknowledged) {
            res.status(201).json({ _id: response.insertedId, ...course });
        } else {
            res.status(500).json(response.error || 'Some error occurred while creating the course');
        }
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Update course
const updateCourse = async (req, res) => {
    try {
        const courseId = new ObjectId(req.params.id);
        const course = {
            code: req.body.code,
            title: req.body.title,
            description: req.body.description,
            credits: req.body.credits
        };
        const response = await mongobd.getDatabase().db().collection('courses').replaceOne({ _id: courseId }, course);
        if (response.matchedCount === 0) {
            return res.status(404).json({ message: 'Course not found' });
        }
        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(200).json({ message: 'No changes made to the course' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete course
const deleteCourse = async (req, res) => {
    try {
        const courseId = new ObjectId(req.params.id);
        const response = await mongobd.getDatabase().db().collection('courses').deleteOne({ _id: courseId });
        if (response.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Course not found or already deleted' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    getAll,
    getSingle,
    createCourse,
    updateCourse,
    deleteCourse
};