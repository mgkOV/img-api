const express = require('express');
      app = express();
const axios = require('axios');
const h = require('./helper');
const db = require('./database');

const port = process.env.PORT || 3000

app.get('/latest_searches', (req, res) => {
  var latestSearches = db.imgs.sortBy('date').take(10);
  res.json(latestSearches);
});

app.get('/:searchQ', (req, res) => {
  var offset = req.query.offset || 0;
  var searchQ = req.params.searchQ
  var url = `https://api.cognitive.microsoft.com/bing/v5.0/images/search?q=${searchQ}&count=10&offset=${offset}&mkt=en-us&safeSearch=Moderate`;


  axios.get(url, {
    headers: {
      "Ocp-Apim-Subscription-Key": "8ffccd4acfb84529a0e4b7b0dfba8033"
    }
  })
  .then((axiosRes) => h.mapData(axiosRes))
  .then((resList) => {
    db.imgs.push({
      term: searchQ,
      when: new Date()
    }).value();
    res.json(resList);
  })
  .catch((e) => {
    console.log(e.message);
  });
});

app.listen(port, () => console.log('App runnig'));
