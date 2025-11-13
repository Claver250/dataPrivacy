const express = require('express');
const router = express.Router();
const connectionController = require('../controllers/connectionController');

router.post('/', connectionController.createConnection);
router.get('/', connectionController.getConnection);
router.grt('/user/:userId', connectionController.getUserConnection);
router.post('/revoke', connectionController.revokeConnection);
router.delete('/delete', connectionController.deleteConnection);

module.exports = router;