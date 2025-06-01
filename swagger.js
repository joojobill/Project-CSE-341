const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'User API',
        description: 'User API with authentication'
    },
    host: 'localhost:5000',
    schemes: ['http'],
    securityDefinitions: {
        cookieAuth: {
            type: 'apiKey',
            in: 'cookie',
            name: 'connect.sid'
        }
    }
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js', './routes/users.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);