const Property = require('../models/Property');

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
const getProperties = async (req, res) => {
  try {
    const { city, type, minPrice, maxPrice } = req.query;
    let query = {};

    if (city) query.city = city;
    if (type) query.type = type;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const properties = await Property.find(query).populate('agent', 'name email avatar');
    res.json({ success: true, count: properties.length, data: properties });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
const getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('agent', 'name email avatar');
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    res.json({ success: true, data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new property
// @route   POST /api/properties
// @access  Private (Agent/Admin)
const createProperty = async (req, res) => {
  try {
    req.body.agent = req.user.id;
    const property = await Property.create(req.body);
    res.status(201).json({ success: true, data: property });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProperties,
  getProperty,
  createProperty,
};
