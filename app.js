const express = require('express');

const app = express();

app.use((req, res) => {
  console.log("We got a new request!");
  res.send("Request received, this is a response!");
});

app.listen(3000, () => {
  console.log("Listening on port 3000!");
})