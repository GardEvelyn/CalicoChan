module.exports = function(args){
	var module = {};
	const client = args.client;
	const adversaryUtil = require("./../AdversaryUtil")({"client": client});
	module.execute = function(msg){
		console.log(msg.author.username + " spoiler");
		let args = msg.content.substring(8).trim();
		adversaryUtil.getAdversaries(args).then(adversaries => {
			msg.reply("Searching. . .").then(replyToEdit => {
				let message = [];
				if(adversaries == null || adversaries.length == 0){
					message.push(client.strings.spoiler.unabletofind);
				}
				else{
					for(let i = 0; i < adversaries.length; i++){
						let adversary = adversaries[i];
						message.push("```");
						message.push(`${adversary.name} - ${adversary.colorIdentity} - ${adversary.set}`);
						message.push("");
						message.push(adversary.text);
						message.push("```");
						message.push("");
					}
				}
				replyToEdit.edit(message);
			});
		});
	};

	module.help = `${client.prefix}spoiler <pattern> :: Searches for Adversaries whose names match a specified pattern.`;

	return module;
};
