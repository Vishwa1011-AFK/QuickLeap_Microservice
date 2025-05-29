require('express-async-errors');
const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/AppError');
const errorHandler = require('./middleware/errorHandler');
const apiRoutes = require('./routes'); 

const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(express.json());

app.use('/api/v1', apiRoutes); 

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

module.exports = app;