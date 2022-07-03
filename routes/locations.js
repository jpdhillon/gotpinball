const express = require('express');
const router = express.Router();
const locations = require('../controllers/locations');
const catchAsync = require('../utils/catchAsync');

router.get('/:id', catchAsync(locations.getLocations));

module.exports = router;