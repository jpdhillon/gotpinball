const axios = require('axios');

const fetchEvents = async (req) => {
  try {
    const res = await axios.get('https://pinballmap.com/api/v1/region/' + req.params.id + '/events.json');
    const events = res.data.events;
    return events;
  } catch (e) {
    console.log("Error:", e);
  }
}

module.exports.getEvents = async (req, res) => {
  const events = await fetchEvents(req);
  if (!events) {
    req.flash('error', 'Cannot find that Region to Look for Events!');
    return res.redirect('/');
  }
  res.render('events/events', { events });
}