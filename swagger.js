const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'User Api',
        description: 'User Api'

    },
    host: 'localhost:5000',
    schemes: ['http', 'https']
};
const outputFile =  './swagger.json';
const endpointsFiles = ['./routes/index.js', './routes/user.js', './routes/other.js'];

//  this will generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);