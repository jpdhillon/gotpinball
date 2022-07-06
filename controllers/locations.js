const axios = require('axios');

const fetchLocations = async (thisRegion) => {
  try {
    const res = await axios.get('https://pinballmap.com/api/v1/region/' + thisRegion + '/locations.json');
    const locations = res.data.locations;
    for (i=0; i < locations.length; i++) {
      locations[i].geometry = { type: "Point", coordinates: [locations[i].lon, locations[i].lat]};
      locations[i].properties = { popUpMarkup: `<a href="/location/${locations[i].id}">${locations[i].name}</a>`}
    }
    return locations;
  } catch (e) {
    console.log("Error:", e);
  }
}

module.exports.getLocations = async (req, res) => {
  const thisRegion = req.params.id;
  const regionCoordinates = [thisRegion.lon, thisRegion.lat];
  const locations = await fetchLocations(thisRegion);
  if (!locations) {
    req.flash('error', 'Cannot find that Region!');
    return res.redirect('/');
  }
  res.render('locations/locations', { locations, thisRegion });
}