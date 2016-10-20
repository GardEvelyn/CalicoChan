const Discord = require("discord.js");
const client = new Discord.Client();
const MongoClient = require("mongodb").MongoClient;

const url = cr.db_endpoint;
let cr = require("./assets/token.json");
var PREFIX = cr.prefix;

client.ytkey = cr.youtube;
client.login(cr.token);

MongoClient.connect(url, function(err, database) {
	// Attach db and strings to client instance because deal w/ it
	client.db = database;
	client.strings = require("./assets/json/strings.json");
	var COMMANDS;
	// Attach event listeners
	client.on("ready", () => {
		console.log(`Ready to begin! Serving in ${client.guilds.size} servers.`);
		COMMANDS = require("./modules/CommandManager")({"client": client});
	});

	client.on("disconnect", () => {
		console.log("Disconnected.");
		process.exit(0);
	});

	client.on("error", (error) => {
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
