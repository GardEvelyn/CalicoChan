module.exports = function(args){
	var module = {};
	const client = args.client;
	const adversaryUtil = require("./../AdversaryUtil")({"client": client});

	module.execute = function(msg){
		console.log(msg.author.username + " adversaries");
		try{
			let args = msg.content.substring(12).trim();
			adversaryUtil.getColorReport(args).then(report => {
				let message = [];
				let total = 0;
				if(Object.getOwnPropertyNames(report).length == 0){
					message.push(client.strings.adversaries.unabletofind);
				}
				else{
					message.push("");
					let identities = Object.getOwnPropertyNames(report).sort(function(a, b){
						return a.length - b.length;
					});
					for(let i = 0; i < identities.length; i++){
						let colorReport = [];
						let adversaries_a = report[identities[i]];
						let j = 0;
						for(j = 0; j < adversaries_a.length ; j++){
							total++;
							let str = adversaries_a[j];
							if (str.indexOf(" ") === -1){
								colorReport.push(str);
							}
							else{
								colorReport.push(str.substr(0, str.indexOf(" ")));
							}
						}
						message.push("**" + identities[i] + ": " + j + "**");
						for(let k = 0; k < colorReport.length; k++){
							message.push(colorReport[k]);
						}
						message.push("");
					}
				}
				message.push("**Total: " + total + "**");
				msg.channel.sendMessage(message);
			});
		}
		catch(err){
			msg.author.sendMessage(client.strings.errformat);
			console.log(err);
		}
	};

	module.help = `${client.prefix}adversaries [setcode] : Generates a report of all adversaries [in a set].`;

	return module;
};
