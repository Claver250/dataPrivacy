const express = require('express');
const router = express.Router();
const connectionController = require('../controllers/connectionController');

router.post('/', connectionController.createConnection);

module.exports = router;