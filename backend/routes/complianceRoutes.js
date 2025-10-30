const express = require('express');
const router = express.Router();
const complianceController = require('../controllers/complianceController');

router.get('/', complianceController.getAllCompliance);
router.post('/', complianceController.createCompliance);
router.put('/:id/status', complianceController.updateComplianceStatus);

module.exports = router;