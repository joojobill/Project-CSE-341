const router = require('express').Router();

router.get('/', (req, res) => {
    res.send('Hello World');
});

router.use('/collections', require('./users'));

module.exports = router;