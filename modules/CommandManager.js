/**
 * CommandManager - Puts together a map of all commands in ./modules/commands
 */
module.exports = function (args) {
	const client = args.client;
	const dir = "./modules/commands/";
	const fs = require("fs");

	var commands = new Map();
	fs.readdir(dir, (err, files) => {
		if(err){
			console.log(dir);
			console.log(err);
			process.exit(0);
		}
		else{
			for(let i = 0; i < files.length; i++){
				let fileName = files[i];
				commands.set(/(.*)\.js/.exec(fileName)[1], require(`./commands/${/(.*)\.js/.exec(fileName)[1]}`)({"client": client}));
			}
		}
	});

	commands.set("help", {execute: help, help: `${client.prefix}help :: Prints out what you're looking at right now!`});

	function help(msg){
		console.log(msg.author.username + " help");
		let tosend = [];
		tosend.push("```asciidoc");
		commands.forEach( command => {
			if(command.help){
				tosend.push(command.help);
			}
		});
		tosend.push("```");
		msg.reply(tosend);
	}

	return commands;
};
