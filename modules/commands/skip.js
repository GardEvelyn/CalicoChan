module.exports = function(args){
	var module = {};
	const client = args.client;
	var queue = client.queue;
	let recentlySkipped = false;
	const TUNES_GUILD = client.guilds.get(client.strings.ids.guild_id);
	const TUNES_VOICE = TUNES_GUILD.channels.get(client.strings.ids.voice_id);
	const TUNES_CHANNEL = TUNES_GUILD.channels.get(client.strings.ids.channel_id);

	module.execute =  function(msg){
		console.log(msg.author.username + " skip");
		if(msg.channel.id !== TUNES_CHANNEL.id){
			return msg.reply(`Please keep \`tunes\` commands in ${TUNES_CHANNEL}. S-sorry, senpai.`);
		}
		if(TUNES_VOICE.members.get(msg.author.id) == null){
			return msg.reply("Please only execute tunes-related commands if you are actually listening to tunes.");
		}
		if(queue.length === 0){
			return msg.reply("Sorry, there's no tunes to skip right now. W-would you like to listen to some with me?");
		}
		if(recentlySkipped){
			return msg.reply("Sorry, a tune was recently skipped. Please wait a few seconds.");
		}

		let song;
		let index = msg.content.split(" ")[1];
		if(args[1]){
			try{
				song = queue[parseInt(index - 1)];
			}
			catch(err){
				return msg.reply(err);
			}
		}
		else{
			song = queue[0];
		}

		if(song === undefined){
			return msg.reply("Sorry, I couldn't find a tune at that index.");
		}
		for(let i = 0; i < song.skipVotes.length; i++){
			if(song.skipVotes[i] == msg.author.id){
				msg.delete();
				return;
			}
		}

		if(TUNES_VOICE.members.get(msg.author.id) != null){
			song.skipVotes.push(msg.author.id);
			if(song.requester.id === msg.author.id || song.skipVotes.length >= (Math.ceil((TUNES_VOICE.members.array().length - 1) / 2))){
				TUNES_CHANNEL.sendMessage(`\`${song.title}\` skipped.`).then(() => {
					msg.delete().then( () => {
						recentlySkipped = true;
						setTimeout(() => {
							recentlySkipped = false;
						}, 5000);
						if(index){
							queue.splice(parseInt(index) - 1, 1);
						}
						else{
							client.dispatcher.end();
						}
					});	
				});
			}
			else{
				TUNES_CHANNEL.sendMessage(`Skip vote recorded for ${song.title}. Total: ${song.skipVotes.length}.`).then(() =>{
					msg.delete();
				});
			}
		}

	};

	module.help = `${client.prefix}skip [index] :: Vote to skip the currently playing tune [or the one at the specified index]..`;
	return module;
};
