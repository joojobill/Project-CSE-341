const router = require('express').Router();

const getCoursesController = require('../controllers/courses');
const { isAuthenticated } = require('../middleware/authenticate');

router.get('/', getCoursesController.getAllCourses);
router.get('/:id', getCoursesController.getCourse);
router.post('/', isAuthenticated, getCoursesController.postCourse);
router.put('/:id', isAuthenticated, getCoursesController.putCourse);
router.delete('/:id', isAuthenticated, getCoursesController.deleteCourse);

module.exports = router;
// This code defines the routes for managing courses in an Express application.
// It includes routes for getting all courses, getting a single course by ID,