const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');
const isLoggedIn = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const upload = require('../middleware/multer');

// Public route to view website settings
router.get('/', settingController.getSettings);

// Admin-only route to update settings
router.post('/', isLoggedIn, isAdmin, upload.single('website_logo'), settingController.saveSettings);
router.put('/', isLoggedIn, isAdmin, upload.single('website_logo'), settingController.saveSettings);

module.exports = router;
