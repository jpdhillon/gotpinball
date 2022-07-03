const express = require('express');
const router = express.Router();
const links = require('../controllers/links');
const catchAsync = require('../utils/catchAsync');

router.get('/:id', catchAsync(links.getLinks));

module.exports = router;