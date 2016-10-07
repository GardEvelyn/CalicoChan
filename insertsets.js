var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

const url = require('./config.json').db_endpoint;
const sets = require("./assets/json/AllSets-x.json");
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Dropped sets.");
  db.collection('sets').drop().then( () => {
	  insertSets(db).then( () => {
		  console.log("Inserted sets.");
		  db.close();
	  });
  });
});

var insertSets = function(db) {
	return new Promise( (resolve, reject ) => {
		try{
			let collection = db.collection('sets');
			Object.getOwnPropertyNames(sets).forEach(setCode => {
			   collection.insert(sets[setCode], (err, result) => {
				   assert.equal(err, null);
			   });
			});
			resolve('Success');
		}
		catch(err){
			reject(err);
		}
	});

}
