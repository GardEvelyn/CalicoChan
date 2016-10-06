var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

const url = require('./config.json').db_endpoint;
const cards = require("./assets/json/AllCards-x.json");
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
