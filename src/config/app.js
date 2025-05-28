const express = require('express');
const morgan = require('morgan'); // For request logging

const app = express();

// 1. GLOBAL MIDDLEWARES
// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Body parser, reading data from body into req.body
app.use(express.json());

// Basic test route
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to the Subscription Service API!',
        status: 'running'
    });
});

// For now, no specific routes, but we'll add them later.

module.exports = app;