var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

const url = require('./config.json').db_endpoint;
const adversaries = require("./assets/json/adversary.json");
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Dropped adversaries.");
  db.collection('adversaries').drop().then( () => {
      insertAdversaries(db).then(() => {
          console.log("Inserted adversaries.");
          db.close();
      });
  });
});

var insertAdversaries = function(db) {
    return new Promise( (resolve, reject ) => {
        try{
            let collection = db.collection('adversaries');
            Object.getOwnPropertyNames(adversaries).forEach(advName => {
                let adv = adversaries[advName];
                collection.insert(adv, (err, result) => {
                    assert.equal(err, null);
                })
            });
            resolve('Success');
        }
        catch(err){
            reject(err);
        }
    });
}
