const express = require('express');
      app = express();
const favicon = require('serve-favicon');
const axios = require('axios');
const h = require('./helper');
const db = require('./database');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const _ = require('lodash');

const port = process.env.PORT || 3000;

app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/', (req, res) => {
  if (!req.body) return res.sendStatus(400);
  var url = `/${ req.body.search }?offset=${ req.body.offset || 0 }`;
  res.redirect(url);
});

app.get('/latest_searches', (req, res) => {
  var latestSearches = db.imgs.takeRight(5).value();
  db.imgs.value();
  res.json(_.orderBy(latestSearches, 'when', 'desc'));
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
