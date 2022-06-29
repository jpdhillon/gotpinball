const express = require('express');
const router = express.Router();
const axios = require('axios');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const getRegions = async () => {
  try {
    const res = await axios.get('https://pinballmap.com/api/v1/regions.json');
    const regions = res.data.regions;
    return regions;
  } catch (e) {
    console.log("Error:", e);
  }
}

const getLinks = async (req) => {
  try {
    const res = await axios.get('https://pinballmap.com/api/v1/region/' + req.params.id + '/region_link_xrefs.json');
    const links = res.data.regionlinks;
    return links;
  } catch (e) {
    console.log("Error:", e);
  }
}

router.get('/:id', catchAsync(async (req, res) => {
  const regions = await getRegions();
  const links = await getLinks(req);
  if (!links) {
    req.flash('error', 'Cannot find that Region to Look for Links!');
    return res.redirect('/');
  }
  res.render('links/links', { regions, links });
}));

module.exports = router;