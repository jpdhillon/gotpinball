const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const axios = require('axios');

//mongoose.connect('mongodb://localhost:27017/find-pinball', {
//  useNewUrlParser: true,
//  useUnifiedTopology: true
//});

//const db = mongoose.connection;
//db.on("error", console.error.bind(console, "connection error:"));
//db.once("open", () => {
//  console.log("Database connected");
//});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//axios.get('https://pinballmap.com/api/v1/regions.json').then((res) => {
//  console.log(res.data.regions[i].full_name);
//});

const getRegions = async () => {
  try {
    const res = await axios.get('https://pinballmap.com/api/v1/regions.json');
    const allRegions = res.data.regions;
    return allRegions;
  } catch (e) {
    console.log("Error:", e);
  }
}

app.get('/', async (req, res) => {
  const regions = await getRegions();
  res.render('home', { regions });
});

app.listen(3000, () => {
  console.log("Listening on port 3000!");
})