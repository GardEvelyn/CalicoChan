module.exports = function(args){
	var module = {};
	const client = args.client;
	module.execute = function(msg){
		console.log(msg.author.username + " cuck");
		let message = [];

		if(msg.author.id == client.strings.ids.hawk){
			message.push(client.strings.cuck.hawk);
		}
		else{
			for(let i = 0; i < client.strings.cuck.seraph.length; i++){
				message.push(client.strings.cuck.seraph[i]);
			}
			let r = random(0, client.strings.cuck.cucking.length - 1);
			message.push("Ah! It's from Seraph-chan! She says... '" + msg.author + ", " + client.strings.cuck.cucking + "'? Huh?");
		}
		msg.reply(message);
	};
	// Helper
	function random (low, high) {
		return Math.floor(Math.random() * (high - low + 1) + low);
	}

	return module;
};
