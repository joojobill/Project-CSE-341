const express = require('express');

const bodyParser = require('body-parser');
const mongobd = require('./data/database');
const app = express();


const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use('/', require('./routes'));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers', 
        'Origin, X-Requested-Withh, Content-Type, Accept, Z-Key'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});
app.use('/', require('./routes'));



mongobd.initDb((err) => {
    if(err) {
        console.log(err);
    }
    else{
        app.listen(port, () => {console.log(`Running on port  ${port}`)});
        
    }
});
 


