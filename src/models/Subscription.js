const mongoose = require('mongoose');
const { calculateEndDate } = require('../utils/durationParser');

const SubscriptionSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, 'User ID is required'],
        index: true
    },
    plan: {
        type: mongoose.Schema.ObjectId,
        ref: 'Plan',
        required: [true, 'Plan ID is required']
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        required: false
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE', 'CANCELLED', 'EXPIRED'],
        default: 'ACTIVE'
    },
    priceAtSubscription: {
        type: Number,
        required: [true, 'Price for each subscription is required']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

SubscriptionSchema.pre('save', async function(next) {
    if (this.isNew || this.isModified('plan')) {
        try {
            const Plan = mongoose.model('Plan');
            const plan = await Plan.findById(this.plan);
            if (!plan) {
                return next(new Error('Plan not found for subscription'));
            }
            this.endDate = calculateEndDate(this.startDate, plan.duration);
            this.priceAtSubscription = plan.price;
        } catch (error) {
            return next(error);
        }
    }
    this.updatedAt = Date.now();
    next();
});

SubscriptionSchema.methods.checkAndSetStatus = function() {
    const now = new Date();
    if (this.endDate && now > this.endDate && this.status !== 'EXPIRED') {
        this.status = 'EXPIRED';
        console.log(`Subscription ${this._id} for user ${this.userId} changed to EXPIRED`);
    }
};

SubscriptionSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

SubscriptionSchema.set('toJSON', { virtuals: true });
SubscriptionSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Subscription', SubscriptionSchema);