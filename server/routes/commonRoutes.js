const express = require('express');
const router = express.Router();
const commonController = require('../controllers/commonController');

// Public route to get site-wide common data (settings, active categories, latest 5 news)
router.get('/', commonController.getCommonData);

module.exports = router;
