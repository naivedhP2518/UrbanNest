const express = require('express');
const { getProperties, getProperty, createProperty } = require('../controllers/propertyController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getProperties)
  .post(protect, authorize('agent', 'admin'), createProperty);

router.route('/:id')
  .get(getProperty);

module.exports = router;
