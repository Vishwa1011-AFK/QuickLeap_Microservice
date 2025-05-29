const express = require('express');
const planRoutes = require('./planRoutes');
const subscriptionRoutes = require('./subscriptionRoutes');

const router = express.Router();

router.use('/plans', planRoutes);
router.use('/subscriptions', subscriptionRoutes);

module.exports = router;