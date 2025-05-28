const Plan = require('../models/Plan');
const AppError = require('../utils/AppError');

class PlanService {
    static async getAllPlans() {
        return await Plan.find({});
    }
    static async getPlanById(planId) {
        const plan = await Plan.findById(planId);
        if (!plan) {
            throw new AppError('Plan not found', 404);
        }
        return plan;
    }
    static async createPlan(planData) {
        const plan = new Plan(planData);
        await plan.save();
        return plan;
    }
}

module.exports = PlanService;