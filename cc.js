const Discord = require("discord.js");
const client = new Discord.Client();
const MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

const url = require('./config.json').db_endpoint;
const PREFIX = '!';

MongoClient.connect(url, function(err, database) {
    // Attach db and strings to client instance because deal w/ it
	client.db = database;
	client.strings = require("./assets/json/strings.json");

	const COMMANDS = require('./modules/CommandManager')({'client': client});

    // Attach event listeners
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
	    if(msg.content.startsWith(PREFIX)){
	        let command = msg.content.split(" ")[0].substring(1);
	        try{
				if(COMMANDS.get(command.toLowerCase())){
					COMMANDS.get(command.toLowerCase())(msg);
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
