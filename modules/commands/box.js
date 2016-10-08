module.exports = function(args){
	var module = {};
	const client = args.client;
	module.execute = function(msg){
		console.log(msg.author.username + " box");
		let r = random(1, 10);
		let message = [];
		for(let i = 0; i < client.strings.box.chatter.length; i++){
				message.push(client.strings.box.chatter[i]);
			}
		let r = random(0, messages.length - 1);
		message.push("Oh, it's " + client.strings.box.contents[r]);
		msg.reply(message);
	}
	// Helper
	function random (low, high) {
		return Math.floor(Math.random() * (high - low + 1) + low);
	}

	return module;
};
