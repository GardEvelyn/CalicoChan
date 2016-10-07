var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

const url = require('./config.json').db_endpoint;
const abilities = require("./assets/json/adversary_abilities.json");
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Dropped abilities.");
  db.collection('abilities').drop().then( () => {
      insertAbilities(db).then( () => {
          console.log("Inserted abilities.");
          db.close();
      });
  });
});

var insertAbilities = function(db) {
    console.log("Inserting");
    var collection = db.collection('abilities');
    Object.getOwnPropertyNames(abilities).forEach(abilityName => {
        console.log("doing it");

        let ability = abilities[abilityName];
        collection.insert(ability, (err, result) => {
            assert.equal(err, null);
        })
    })
}
