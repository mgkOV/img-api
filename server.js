const express = require('express');
      app = express();
const axios = require('axios');

app.get('/:searchQ', (req, res) => {
  var offset = req.query.offset || 0;
  console.log(offset);
  var url = `https://api.cognitive.microsoft.com/bing/v5.0/images/search?q=${req.params.searchQ}&count=10&offset=${offset}&mkt=en-us&safeSearch=Moderate`;
  axios.get(url, {
    headers: {
      "Ocp-Apim-Subscription-Key": "8ffccd4acfb84529a0e4b7b0dfba8033"
    }
  }).then(axiosRes => {

    var resList = axiosRes.data.value.map(item => {
      var modifiedItem = {
        url: item.contentUrl,
        snippet: item.name,
        thumbnail: item.thumbnailUrl,
        context: item.hostPageUrl
      }
      return modifiedItem
    });

    //console.log(JSON.stringify(resList, undefined, 2));
    console.log(resList[0].url);
    res.json(resList);
  }).catch((e) => {
    console.log(e.message);
  });
}).listen(3000, () => console.log('App runnig'));
