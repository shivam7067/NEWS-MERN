const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const isLoggedIn = require('../middleware/auth');

router.get('/stats', isLoggedIn, dashboardController.getDashboardStats);

module.exports = router;
