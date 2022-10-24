const express = require('express');
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());
const {Client} = require("@googlemaps/google-maps-services-js");


const client = new Client({});


  app.get("/pro", async (request, response) => {
    console.log("request coming in...");
  
    try {
        client.elevation({
            params: {
              locations: [{ lat: 45, lng: -110 }],
              key: "AIzaSyCXK8Vvc6LqGd_TvMs7Bh_DB4wlXlREps4",
            },
            timeout: 1000, // milliseconds
          })
          .then((r) => {
            console.log(r.data.results[0].elevation);
          })
          .catch((e) => {
            console.log(e.response.data.error_message);
          });
    } catch (err) {
      // handle any issues with invalid links
      response.json({
        error: "There is a problem with the link you have provided."
      });
    }
  });
  
  const PORT = process.env.PORT || 5000;
  
  app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
  });