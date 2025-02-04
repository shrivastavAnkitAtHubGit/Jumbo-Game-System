const app = require('restana')();

const bodyParser = require('body-parser');
const helmet = require('helmet');
const compression = require('compression');

const config = require('./development.config.json');
const port = config.PORT;
const {
    errorResponse,
    statusCodes: { STATUS_CODE_FAILURE, STATUS_CODE_DATA_NOT_FOUND },
} = require('./utils/response/response.handler');
const { init: mongoInit } = require('./mongodb/index');

const routes = require('./routes');
const { validateAuth } = require('./middlewares/auth.middleware');

// parse body params and attache them to req.body
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

// secure apps by setting various HTTP headers
app.use(helmet());

// gzip, deflate compression of API response to reduce data transfer over internet
app.use(compression());

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