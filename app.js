const restana = require('restana');
const { createServer } = require('http');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const compression = require('compression');

const config = require('./development.config.json');
const { init: mongoInit } = require('./mongodb/index');
const routes = require('./routes');
const { validateAuth } = require('./middlewares/auth.middleware');
const {
    errorResponse,
    statusCodes: { STATUS_CODE_FAILURE, STATUS_CODE_DATA_NOT_FOUND },
} = require('./utils/response/response.handler');
const {
    markUserAvailable,
    markUserUnavailable,
} = require('./modules/user/helpers/user.helper');

const app = restana();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",  // Allow all origins (modify for production)
        methods: ["GET", "POST"]
    }
});

global.io = io;

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(compression());

// Routes
app.use('/auth', validateAuth);
app.use('/', routes);

// Handle invalid routes
app.use((req, res, next) => errorResponse({
    code: STATUS_CODE_DATA_NOT_FOUND,
    req,
    res,
    message: 'Route not found',
}));

// Global error handler
app.use((error, req, res, next) => errorResponse({
    code: STATUS_CODE_FAILURE,
    req,
    res,
    error,
    message: error.message,
}));

// WebSocket connection handling
io.on("connection", (socket) => {
    socket.emit("message", "You are connected");
    socket.on("joinGame", async ({ userId }) => {
        if (!userId) {
            socket.emit("error", "Invalid request: Missing userId or gameId");
            return;
        }
        socket.join(userId);
        await markUserAvailable({ userId });
    });

    socket.on("answerSubmit", async (attemptData) => {
        // validateAttemptData(attemptData);
        const { event = '', users = [], eventMsg = '', eventData = {} } = await processAndSaveAttemptData(attemptData);
        users.forEach(({ _id: userId }) => {
            io.to(userId.toString()).emit(event, eventMsg, eventData);
        });
    });

    socket.on("disconnect", async () => {
        await markUserUnavailable({ userId });
        console.log("Client disconnected:", socket.id);
    });
});

// Start server after MongoDB initializes
server.listen(config.PORT, async () => {
    try {
        await mongoInit({ config: { db: config.mongoDB } });
        console.log(`Server started at port ${config.PORT}`);
    } catch (err) {
        console.error("Failed to start server:", err);
    }
});
