const axios = require('axios');

const fetchLinks = async (req) => {
  try {
    const res = await axios.get('https://pinballmap.com/api/v1/region/' + req.params.id + '/region_link_xrefs.json');
    const links = res.data.regionlinks;
    return links;
  } catch (e) {
    console.log("Error:", e);
  }
};

module.exports.getLinks = async (req, res) => {
  const links = await fetchLinks(req);
  if (!links) {
    req.flash('error', 'Cannot find that Region to Look for Links!');
    return res.redirect('/');
  }
  res.render('links/links', { links });
}