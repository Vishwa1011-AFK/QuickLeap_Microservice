const SubscriptionService = require('../services/subscriptionService');
const AppError = require('../utils/AppError');

class SubscriptionController {

    static async createSubscription(req, res, next) {
        const userId = req.user.id;
        const { planId } = req.body;

        const subscription = await SubscriptionService.createSubscription(userId, planId);
        res.status(201).json({
            status: 'success',
            message: 'Subscription created successfully.',
            data: {
                subscription
            }
        });
    }

    static async getSubscription(req, res, next) {
        const userIdFromToken = req.user.id;
        const userIdParam = req.params.userId;

        if (userIdFromToken !== userIdParam) {
            return next(new AppError('Unauthorized: You can only retrieve your own subscription.', 403));
        }

        const subscription = await SubscriptionService.getSubscription(userIdParam);

        if (!subscription) {
            return next(new AppError('No subscription found for this user.', 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
                subscription
            }
        });
    }

    static async updateSubscription(req, res, next) {
        const userIdFromToken = req.user.id;
        const userIdParam = req.params.userId;
        const { newPlanId } = req.body;

        if (userIdFromToken !== userIdParam) {
            return next(new AppError('Unauthorized: You can only update your own subscription.', 403));
        }

        const updatedSubscription = await SubscriptionService.updateSubscription(userIdParam, newPlanId);

        res.status(200).json({
            status: 'success',
            message: 'Subscription updated successfully.',
            data: {
                subscription: updatedSubscription
            }
        });
    }

    static async cancelSubscription(req, res, next) {
        const userIdFromToken = req.user.id;
        const userIdParam = req.params.userId;

        if (userIdFromToken !== userIdParam) {
            return next(new AppError('Unauthorized: You can only cancel your own subscription.', 403));
        }

        const cancelledSubscription = await SubscriptionService.cancelSubscription(userIdParam);

        res.status(200).json({
            status: 'success',
            message: 'Subscription cancelled successfully.',
            data: {
                subscription: cancelledSubscription
            }
        });
    }
}

module.exports = SubscriptionController;