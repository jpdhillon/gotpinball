const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const axios = require('axios');
const ejsMate = require('ejs-mate');
const Review = require('./models/review');

mongoose.connect('mongodb://localhost:27017/gotPinball', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));

const getRegions = async () => {
  try {
    const res = await axios.get('https://pinballmap.com/api/v1/regions.json');
    const regions = res.data.regions;
    return regions;
  } catch (e) {
    console.log("Error:", e);
  }
}

const getLocations = async (req) => {
  try {
    const res = await axios.get('https://pinballmap.com/api/v1/region/' + req.params.id + '/locations.json');
    const locations = res.data.locations;
    return locations;
  } catch (e) {
    console.log("Error:", e);
  }
}

const getLocation = async (req) => {
  try {
    const res = await axios.get('https://pinballmap.com/api/v1/locations/' + req.params.id + '.json');
    const location = res.data;
    const res2 = await axios.get('https://pinballmap.com/api/v1/locations/' + req.params.id + '/machine_details.json');
    const locationMachines = res2.data.machines;
    const res3 = await axios.get('https://pinballmap.com/api/v1/machines.json');
    const machines = res3.data.machines;
    for (var i = 0; i < locationMachines.length; i++) {
      for (var k = 0; k < machines.length; k++) {
        if (locationMachines[i].opdb_id == machines[k].opdb_id) {
          locationMachines[i].opdb_img = machines[k].opdb_img;
        }
      }
    }
    const locationAndMachines = [location, locationMachines];
    return locationAndMachines;
  } catch (e) {
    console.log("Error:", e);
  }
}

const getEvents = async (req) => {
  try {
    const res = await axios.get('https://pinballmap.com/api/v1/region/' + req.params.id + '/events.json');
    const events = res.data.events;
    return events;
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

const getMachines = async () => {
  try {
    const res = await axios.get('https://pinballmap.com/api/v1/machines.json');
    const machines = res.data.machines;
    return machines;
  } catch (e) {
    console.log("Error:", e);
  }
}

const getReviews = async (req) => {
  try {
    const reviews = await Review.find({locationId: req.params.id});
    return reviews;
  } catch (e) {
    console.log("Error:", e);
  }
}

app.get('/', async (req, res) => {
  const regions = await getRegions();
  res.render('home', { regions });
});

app.get('/locations/:id', async (req, res) => {
  const regions = await getRegions();
  const thisRegion = req.params.id;
  const locations = await getLocations(req);
  res.render('locations/locations', { regions, locations, thisRegion });
});

app.get('/location/:id', async (req, res) => {
  const regions = await getRegions();
  const locationAndMachines = await getLocation(req);
  const reviews = await getReviews(req);
  const [location, locationMachines] = locationAndMachines;
  res.render('locations/location', { regions, location, locationMachines, reviews });
});

app.post('/location/:id/reviews', async (req, res) => {
  const review = new Review(req.body.review);
  await review.save();
  res.redirect(`/location/${req.body.review.locationId}`);
})

app.get('/events/:id', async (req, res) => {
  const regions = await getRegions();
  const events = await getEvents(req);
  res.render('events/events', { regions, events });
});

app.get('/links/:id', async (req, res) => {
  const regions = await getRegions();
  const links = await getLinks(req);
  res.render('links/links', { regions, links });
});

app.get('/machines', async (req, res) => {
  const regions = await getRegions();
  const machines = await getMachines();
  res.render('machines/machines', { regions, machines });
});

app.get('/error', async (req, res) => {
  const regions = await getRegions();
  res.render('error', { regions });
});

app.listen(3000, () => {
  console.log("Listening on port 3000!");
})