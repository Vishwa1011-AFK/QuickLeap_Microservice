const express = require('express');
const planController = require('../controllers/planController');
const authMiddleware = require('../middleware/authMiddleware'); 

const router = express.Router();

router.use(authMiddleware);

router.route('/')
    .get(planController.getAllPlans); 

module.exports = router;