const app = require('./app');
const connectDB = require('./config/db');
const config = require('./config');

connectDB();

const PORT = config.PORT;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${config.NODE_ENV} mode.`);
});

process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION!, Shutting down...');
    console.error(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION!, Shutting down...');
    console.error(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});