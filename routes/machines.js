const express = require('express');
const router = express.Router();
const machines = require('../controllers/machines');
const catchAsync = require('../utils/catchAsync');

router.get('/:page', catchAsync(machines.getMachines));

module.exports = router;