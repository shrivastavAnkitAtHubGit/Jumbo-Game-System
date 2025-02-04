

const mongoose = require('mongoose');

function validateConfig(config) {
    if (!config) {
        throw new Error('Invalid initialization of mongodb module, no config');
    }
    if (!config.db || !config.db.host || !config.db.port || !config.db.database
        || !config.db.username || !config.db.password) {
        throw new Error('Invalid initialization of mongodb module, no db credentials');
    }
}

function init({ config }) {
    validateConfig(config);
    const { db } = config;
    const connectionUri = db.connectionUri;

    const options = {
        user: db.username,
        pass: db.password,
        useNewUrlParser: true,
        readPreference: 'secondaryPreferred',
        useUnifiedTopology: true,
    };

    mongoose.Promise = global.Promise;

    mongoose.connection.on('error', (err) => {
        console.log('MongoDB connection error. Please make sure MongoDB is running.', err);
        process.exit();
    });

    mongoose.connect(connectionUri, options)
        .then(() => {
            console.log('Successfully connected to db');
        })
        .catch((err) => {
            console.error('MongoDB connection error:', err);
            process.exit();
        });
}

module.exports = {
    init
}
