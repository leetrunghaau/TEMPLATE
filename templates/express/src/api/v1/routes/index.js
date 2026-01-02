const express = require('express');
const router = express.Router();

// Example route
router.use('/example', require('./example.route'));

module.exports = router;