var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// DB URL, should probably move to a config someday.
// TODO: Move to a config someday.
var url = 'mongodb://localhost:27017/myproject';
var fs = require('fs');
const sets = JSON.parse(fs.readFileSync("./assets/json/AllSets-x.json"));
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  insertSets(db, () => {
      console.log("Inserted sets.")
  });
  db.close();
});

var insertSets = function(db, callback) {
  var collection = db.collection('sets');
  Object.getOwnPropertyNames(sets).forEach(setCode => {
     collection.insert(sets[setCode], (err, result) => {
         assert.equal(err, null);
     });
  });
  callback();
}
