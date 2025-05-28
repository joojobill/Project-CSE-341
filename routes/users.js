const router = require('express').Router();
const { body, param, validationResult } = require('express-validator');

const usersController = require('../controllers/users');

// Validation error handler middleware
const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// GET all users (no validation needed)
router.get('/', usersController.getAll);

// GET single user by ID with validation
router.get(
    '/:id',
    param('id').isMongoId().withMessage('Invalid user ID'),
    handleValidation,
    usersController.getSingle
);

// CREATE user with validation
router.post(
    '/',
    [
        body('firstName').notEmpty().withMessage('First name is required'),
        body('lastName').notEmpty().withMessage('Last name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('studentId').notEmpty().withMessage('Student ID is required'),
        body('major').notEmpty().withMessage('Major is required'),
        body('gpa').isFloat({ min: 0, max: 4 }).withMessage('GPA must be between 0 and 4'),
        body('enrollmentDate').isISO8601().withMessage('Enrollment date must be a valid date')
    ],
    handleValidation,
    usersController.createUser
);

// UPDATE user with validation
router.put(
    '/:id',
    [
        param('id').isMongoId().withMessage('Invalid user ID'),
        body('name').optional().notEmpty().withMessage('Name cannot be empty'),
        body('email').optional().isEmail().withMessage('Valid email is required'),
        body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    ],
    handleValidation,
    usersController.updateUser
);

// DELETE user by ID with validation
router.delete(
    '/:id',
    param('id').isMongoId().withMessage('Invalid user ID'),
    handleValidation,
    usersController.deleteUser
);

module.exports = router;