const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Plan name is required'],
        unique: true,
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Plan price is required'],
        min: 0
    },
    features: {
        type: [String],
        default: []
    },
    duration: {
        type: String, 
        required: [true, 'Plan duration is required']
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

PlanSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

PlanSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

PlanSchema.set('toJSON', { virtuals: true });
PlanSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Plan', PlanSchema);