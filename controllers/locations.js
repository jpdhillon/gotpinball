const axios = require('axios');

const fetchLocations = async (thisRegion) => {
  try {
    const res = await axios.get('https://pinballmap.com/api/v1/region/' + thisRegion + '/locations.json');
    const locations = res.data.locations;
    return locations;
  } catch (e) {
    console.log("Error:", e);
  }
}

module.exports.getLocations = async (req, res) => {
  const thisRegion = req.params.id;
  const locations = await fetchLocations(thisRegion);
  if (!locations) {
    req.flash('error', 'Cannot find that Region!');
    return res.redirect('/');
  }
  res.render('locations/locations', { locations, thisRegion });
}