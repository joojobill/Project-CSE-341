const router = require('express').Router();

router.get('/', (req, res) => {
    res.send('Hello World');
});

router.use('/Project-CSE-341', require('./users'));

module.exports = router;