module.exports = function(args){
	var module = {};
	const client = args.client;
	module.execute = function(msg){
		console.log(msg.author.username + " castelia");
		msg.reply(client.strings.castelia);
	};

	return module;
};
