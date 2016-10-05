var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// DB URL, should probably move to a config someday.
// TODO: Move to a config someday.
var url = 'mongodb://localhost:27017/myproject';
var fs = require('fs');
const adversaries = JSON.parse(fs.readFileSync("./assets/json/adversary.json"));
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  insertAdversaries(db, () => {
      console.log("Inserted adversaries.");
  })
  db.close();
});

var insertAdversaries = function(db, callback) {
    var collection = db.collection('adversaries');
    Object.getOwnPropertyNames(adversaries).forEach(advName => {
        let adv = adversaries[advName];
        collection.insert(adv, (err, result) => {
            assert.equal(err, null);
        })
    })
    callback();
}
