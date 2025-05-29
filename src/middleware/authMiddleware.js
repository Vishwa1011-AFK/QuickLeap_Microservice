const jwt = require('jsonwebtoken');
const config = require('../config');
const AppError = require('../utils/AppError');

module.exports = (req, res, next) => {

    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new AppError('No token, authorization denied. Please provide a Bearer token.', 401));
    }

    const token = authHeader.slice(7, authHeader.length);

    if (!token) {
        return next(new AppError('No token, authorization denied.', 401));
    }

    try {

        const decoded = jwt.verify(token, config.JWT_SECRET);

        req.user = decoded.user;
        next();
    } catch (err) {
        return next(err);
    }
};