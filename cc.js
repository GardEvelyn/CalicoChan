const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/myproject';

MongoClient.connect(url, function(err, database) {
	client.db = database;
	client.strings = JSON.parse(fs.readFileSync("./assets/json/strings.json"));
	const COMMANDS = require('./modules/CommandManager')({'client': client});
	client.on("ready", () => {
		console.log(`Ready to begin! Serving in ${client.guilds.size} servers.`);
	});

	client.on("disconnect", () => {
		console.log("Disconnected.");
		process.exit(0);
	});

	client.on('error', (error) => {
		console.log("Error event:");
	 	console.log(error);
	});

	client.on("message", (msg) => {
	    if(msg.content.startsWith("!")){
	        let command = msg.content.split(" ")[0].substring(1);
	        try{
				if(COMMANDS.get(command)){
					COMMANDS.get(command)(msg);
				}
	        }
	        catch(err){
	            console.log("Error onMessage:");
	            console.log(err);
	        }
	    }
	});
});

client.login(require('./assets/token.json').token);
