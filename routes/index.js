const router = require('express').Router();



routes.get('/', (req, res) => {
    res.send('Hello World');
 });


router.use('/users', require('./users'));

 
module.exports = router;