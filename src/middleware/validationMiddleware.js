const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

const validate = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map((validation) => validation.run(req)));

        const errors = validationResult(req); 
        if (errors.isEmpty()) {
            return next();
        }

        const extractedErrors = [];
        errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

        return next(new AppError('Validation failed: ' + JSON.stringify(extractedErrors), 400));
    };
};

module.exports = validate;