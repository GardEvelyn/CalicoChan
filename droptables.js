var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// DB URL, should probably move to a config someday.
// TODO: Move to a config someday.
var url = 'mongodb://localhost:27017/myproject';
var fs = require('fs');
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

  db.close();
});
