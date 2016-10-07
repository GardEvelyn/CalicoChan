module.exports = function(args){
	var module = {};
	const client = args.client;
	module.execute = function(msg){
		console.log(msg.author.username + " bed");
		let message = "";
		// Cynic doesn't get to tell people to go to bed.
		if(msg.author.id == client.strings.ids.cynic){
			msg.channel.sendMessage(msg.author + ": Go to bed.");
		}
		else if(msg.mentions != null && msg.mentions.users != null){
			let mentions_a = msg.mentions.users.array();
			for(let i = 0; i < mentions_a.length; i++){
				message += mentions_a[i];

				if(i == mentions_a.length - 1){
					message += ":";
				}
				else{
					message += ", ";
				}
			}
			message += " Go to bed.";
			msg.channel.sendMessage(message);
		}
	};

	return module;
};
