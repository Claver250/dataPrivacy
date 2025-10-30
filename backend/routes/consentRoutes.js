const express = require('express');
const router = express.Router();
const consentController = require('../controllers/consentController');

router.post('/grant', consentController.grantConsent);
router.post('/revoke', consentController.revokeConsent);
router.get('/get', consentController.getConsent);

module.exports = router;