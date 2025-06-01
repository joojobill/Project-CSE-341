const passport = require('passport');
const { body } = require('express-validator');
const router = require('express').Router();
const authController = require('../controllers/auth');
router.use("/", require("./swagger"));
router.use('/collections', require('./users'));

router.get('/login', passport.authenticate('github'), (req, res) => {});
router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').notEmpty().withMessage('Password is required')
    ],
    passport.authenticate('local', {
        successRedirect: '/', 
        failureRedirect: '/login',
        failureFlash: false 
    })
);

router.post(
    '/register',
    [
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    ],
    authController.register
);

router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

module.exports = router;