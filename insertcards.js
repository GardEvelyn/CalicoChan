var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// DB URL, should probably move to a config someday.
// TODO: Move to a config someday.
var url = 'mongodb://localhost:27017/myproject';
var fs = require('fs');
const cards = JSON.parse(fs.readFileSync("./assets/json/AllCards-x.json"));
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  insertCards(db, () => {
      console.log("Inserted cards.")
  });
  db.close();
});

var insertCards = function(db, callback) {
    var collection = db.collection('cards');
    Object.getOwnPropertyNames(cards).forEach(cardName => {
        let card = cards[cardName];
        collection.insert(card, (err, result) => {
            assert.equal(err, null);
        })
    })
    callback();
}
