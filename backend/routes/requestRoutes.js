const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');

router.post('/', requestController.createRequest);
router.get('/user/:userId', requestController.getUserRequests);
router.put('/:id/status', requestController.updateRequestStatus);

module.exports = router;