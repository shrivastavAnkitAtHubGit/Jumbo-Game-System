const app = require('restana')();

const config = require('./development.config.json');
const port = config.PORT;
const {
    errorResponse,
    statusCodes: { STATUS_CODE_FAILURE, STATUS_CODE_DATA_NOT_FOUND },
} = require('./utils/response/response.handler');
const { init: mongoInit } = require('./mongodb/index');

const routes = require('./routes');
const { validateAuth } = require('./middlewares/auth.middleware');

app.use('/auth', validateAuth);
app.use('/', routes);

app.use((req, res, next) => errorResponse({
    code: STATUS_CODE_DATA_NOT_FOUND,
    req,
    res,
    message: 'Route not found',
}));

app.use((error, req, res, next) => errorResponse({
    code: STATUS_CODE_FAILURE,
    req,
    res,
    error,
    message: error.message,
}));

const server = app.start(port);

server
    .then(() => {
        mongoInit({ config: { db: config.mongoDB } });
        console.log(`Server started at port ${port}`);
    })
    .catch((err) => {
        console.log('Failed to start server ', err);
    });