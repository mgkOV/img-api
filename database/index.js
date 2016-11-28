const low = require('lowdb');
const fileAsync = require('lowdb/lib/file-async')

const db = low('db.json', { storage: fileAsync });


db.defaults({ imgs: [] })
  .value();

const img = db.get('imgs');

module.exports = {
  img
};
