const parse = require('url-parse');
const queryString = require('query-string');


const parseURL = (url) => {
  var urlQuery = parse(url).query;
  var queries = queryString.parse(urlQuery);
  return queries.r;
};

const mapData = (axiosRes) => {

  var resList = axiosRes.data.value.map(item => {
    var modifiedItem = {
      url: parseURL(item.contentUrl),
      snippet: item.name,
      thumbnail: item.thumbnailUrl,
      context: parseURL(item.hostPageUrl)
    }
    return modifiedItem
  });

  return resList;
};

module.exports = {
  mapData
};
