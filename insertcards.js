var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

const url = require('./config.json').db_endpoint;
const cards = require("./assets/json/AllCards-x.json");
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Dropped cards.");
  db.collection('cards').drop().then( () => {
	  insertCards(db).then( () => {
		  console.log("Inserted cards.");
		  db.close();
	  });
  });
});

var insertCards = function(db) {
	return new Promise( (resolve, reject ) => {
		try{
			let collection = db.collection('cards');
			Object.getOwnPropertyNames(cards).forEach(cardName => {
				let card = cards[cardName];
				collection.insert(card, (err, result) => {
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
