const express = require('express');
const app = express();
//const cors = require("cors");
app.use(express.json());
//app.use(cors());

api_key = "AIzaSyCXK8Vvc6LqGd_TvMs7Bh_DB4wlXlREps4",
url = 'https://maps.googleapis.com/maps/api/distancematrix/json?';
source = 45;
dest = -110;
  app.get('/pro', async (request, response) => {
    console.log("request coming in...");
  
    try {
        const r = await request.get(url + 'origins = ' + source + '&destinations = ' + dest + '&key = ' + api_key)
       const x = response.json(r);
        console.log(x)
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