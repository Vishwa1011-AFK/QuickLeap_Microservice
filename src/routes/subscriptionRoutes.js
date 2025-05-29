const express = require('express');
const { body, param } = require('express-validator'); 
const subscriptionController = require('../controllers/subscriptionController');
const authMiddleware = require('../middleware/authMiddleware'); 
const validate = require('../middleware/validationMiddleware'); 

const router = express.Router();

router.use(authMiddleware);

router.route('/')
    .post(
        validate([
            body('planId').isMongoId().withMessage('Plan ID is invalid.').notEmpty().withMessage('Plan ID is required.')
        ]),
        subscriptionController.createSubscription
    );
router.route('/:userId')
    .get(
        validate([
            param('userId').isString().withMessage('User ID must be a string.').notEmpty().withMessage('User ID is required.')
        ]),
        subscriptionController.getSubscription
    )
    .put(
        validate([
            param('userId').isString().withMessage('User ID must be a string.').notEmpty().withMessage('User ID is required.'),
            body('newPlanId').isMongoId().withMessage('New Plan ID is invalid.').notEmpty().withMessage('New Plan ID is required.')
        ]),
        subscriptionController.updateSubscription
    )
    .delete(
        validate([
            param('userId').isString().withMessage('User ID must be a string.').notEmpty().withMessage('User ID is required.')
        ]),
        subscriptionController.cancelSubscription
    );

module.exports = router;