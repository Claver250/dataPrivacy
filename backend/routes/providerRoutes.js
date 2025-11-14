const express = require('express');
const router = express.Router();
const providerController = require('../controllers/providerController');

router.post('/', providerController.getProviders);
router.post('/:id', providerController.getProvider);
router.post('/grant', providerController.grantAccess);
router.delete('/revoke', providerController.revokeAccess);
router.patch('/:id', providerController.updateProvider);

module.exports = router;