const Setting = require('../models/setting');
const fs = require('fs');
const path = require('path');

// Get settings
const getSettings = async (req, res, next) => {
    try {
        let setting = await Setting.findOne();
        if (!setting) {
            setting = {
                website_title: 'News CMS',
                website_logo: '',
                footer_description: '© Copyright 2025 News | Powered by SHIVAM'
            };
        }
        res.json({
            success: true,
            setting
        });
    } catch (error) {
        next(error);
    }
};

// Save settings (admin only)
const saveSettings = async (req, res, next) => {
    try {
        const { website_title, footer_description } = req.body;
        const website_logo = req.file ? req.file.filename : null;

        let setting = await Setting.findOne();
        if (!setting) {
            setting = new Setting({
                website_title: website_title || 'News CMS',
                footer_description: footer_description || '© Copyright 2025 News'
            });
        } else {
            if (website_title) setting.website_title = website_title;
            if (footer_description) setting.footer_description = footer_description;
        }

        if (website_logo) {
            if (setting.website_logo) {
                const oldLogoPath = path.join(__dirname, '../uploads', setting.website_logo);
                if (fs.existsSync(oldLogoPath)) {
                    fs.unlinkSync(oldLogoPath);
                }
            }
            setting.website_logo = website_logo;
        }

        await setting.save();

        res.json({
            success: true,
            message: 'Settings saved successfully',
            setting
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getSettings,
    saveSettings
};
