const Subscription = require('../models/Subscription');
const Plan = require('../models/Plan');
const AppError = require('../utils/AppError');


class SubscriptionService {
    static async createSubscription(userId, planId) {
        const plan = await Plan.findById(planId);
        if (!plan) {
            throw new AppError('Plan not found.', 404);
        }

        const existingActiveSubscription = await Subscription.findOne({
            userId,
            status: 'ACTIVE'
        });

        if (existingActiveSubscription) {
            throw new AppError('User already has an active subscription. Please update or cancel the existing one.', 400);
        }

        const subscription = new Subscription({
            userId,
            plan: plan._id,
            startDate: new Date(),
        });

        await subscription.save();
        return subscription;
    }

    static async getSubscription(userId) {
        let subscription = await Subscription.findOne({ userId })
            .sort({ createdAt: -1 }) 
            .populate('plan'); 

        if (subscription) {
            subscription.checkAndSetStatus();
            if (subscription.isModified('status')) {
                await subscription.save();
            }
        }
        return subscription;
    }

    static async updateSubscription(userId, newPlanId) {
        const currentSubscription = await Subscription.findOne({
            userId,
            status: 'ACTIVE'
        });

        if (!currentSubscription) {
            throw new AppError('No active subscription found for this user to update.', 404);
        }

        if (currentSubscription.plan.toString() === newPlanId) {
            throw new AppError('User is already subscribed to this plan.', 400);
        }

        const newPlan = await Plan.findById(newPlanId);
        if (!newPlan) {
            throw new AppError('New plan not found.', 404);
        }

        currentSubscription.status = 'CANCELLED';
        await currentSubscription.save();

        const newSubscription = new Subscription({
            userId,
            plan: newPlan._id,
            startDate: new Date(),
        });
        await newSubscription.save();

        return newSubscription;
    }

    static async cancelSubscription(userId) {
        const subscription = await Subscription.findOne({
            userId,
            status: 'ACTIVE'
        });

        if (!subscription) {
            throw new AppError('No active subscription found for this user to cancel.', 404);
        }

        subscription.status = 'CANCELLED';
        await subscription.save();
        return subscription;
    }
}

module.exports = SubscriptionService;