var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

const url = require('./config.json').db_endpoint;
const abilities = require("./assets/json/adversary_abilities.json");
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  insertAbilities(db, () => {
      console.log("Inserted abilities.");
  });
  db.close();
});

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
