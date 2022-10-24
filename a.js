const axios = require('axios');

axios
  .get('https://maps.googleapis.com/maps/api/distancematrix/json?origins=45&destinations=110&key=AIzaSyCXK8Vvc6LqGd_TvMs7Bh_DB4wlXlREps4')
  .then(res => {
    console.log(`statusCode ha ya bahi ruk jahgkjgjkgjhgjhgjtuytyutuygjhgjhghjggjfyjyghggfyy: ${res.status}`);
    //console.log(res);
  })
  .catch(error => {
    console.error(error);
  });
