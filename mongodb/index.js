

const mongoose = require('mongoose');

function init({ config }) {
    const { db } = config;
    const connectionUri = db.connectionUri;

    mongoose.Promise = global.Promise;

    mongoose.connection.on('error', (err) => {
        console.log('MongoDB connection error. Please make sure MongoDB is running.', err);
        process.exit();
    });

    mongoose.connect(connectionUri)
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
