var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/myproject';
var fs = require('fs');
const sets = JSON.parse(fs.readFileSync("./assets/json/AllSets-x.json"));
const cards = JSON.parse(fs.readFileSync("./assets/json/AllCards-x.json"));
const adversaries = JSON.parse(fs.readFileSync("./assets/json/adversary.json"));
const abilities = JSON.parse(fs.readFileSync("./assets/json/adversary_abilities.json"));
// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
  db.collection('sets').drop();
  console.log("Dropped sets.");
  db.collection('cards').drop();
  console.log("Dropped cards.");
  db.collection('adversaries').drop();
  console.log("Dropped adversaries.");
  db.collection('adversaries').drop();
  console.log("Dropped abilities.");
  db.collection('abilities').drop();

  insertSets(db, () => {
      console.log("Inserted sets.")
  });

  insertCards(db, () => {
      console.log("Inserted cards.")
  });

  insertAdversaries(db, () => {
      console.log("Inserted adversaries.");
  })
  insertAbilities(db, () => {
      console.log("Inserted abilities.");
  })
  db.close();
});


var insertSets = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('sets');
  // Insert some documents
  Object.getOwnPropertyNames(sets).forEach(setCode => {
     collection.insert(sets[setCode], (err, result) => {
         assert.equal(err, null);
     });
  });
  callback();
}

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

var insertAbilities = function(db, callback) {
    var collection = db.collection('abilities');
    Object.getOwnPropertyNames(abilities).forEach(abilityName => {
        let ability = abilities[abilityName];
        collection.insert(ability, (err, result) => {
            assert.equal(err, null);
        })
    })
    callback();
}
