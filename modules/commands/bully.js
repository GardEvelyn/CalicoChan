module.exports = function(args){
	var module = {};
	const client = args.client;
	module.execute = function(msg){
		console.log(msg.author.username + " bully");
		let args = msg.content.substring(6).trim();

		if(msg.mentions.users.size == 0){
			msg.channel.sendMessage(client.strings.bully.invalid);
			return;
		}

		// Self harm.
		if(msg.mentions.users.first().id == client.user.id){
			msg.channel.sendMessage(client.strings.bully.targetself);
		}
		else{
			let r = random(0, client.strings.bully.meanthings.length - 1);
			msg.channel.sendMessage(client.strings.bully.meanthings[r].replace("$NAME", msg.mentions.users.first()));
		}
	};
	// Helper
	function random (low, high) {
		return Math.floor(Math.random() * (high - low + 1) + low);
	}

	return module;
};
