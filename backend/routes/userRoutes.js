const express = require('express');
const { getAgents } = require('../controllers/userController');

const router = express.Router();

router.get('/agents', getAgents);

module.exports = router;
