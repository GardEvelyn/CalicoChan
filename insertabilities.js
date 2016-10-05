var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// DB URL, should probably move to a config someday.
// TODO: Move to a config someday.
var url = 'mongodb://localhost:27017/myproject';
var fs = require('fs');
const abilities = JSON.parse(fs.readFileSync("./assets/json/adversary_abilities.json"));
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
