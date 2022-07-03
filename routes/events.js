const express = require('express');
const router = express.Router();
const events = require('../controllers/events');
const catchAsync = require('../utils/catchAsync');

router.get('/:id', catchAsync(events.getEvents));

module.exports = router;