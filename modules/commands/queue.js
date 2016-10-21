module.exports = function(args){
	var module = {};
	const client = args.client;
	const TUNES_GUILD = client.guilds.get(client.strings.ids.guild_id);
	const TUNES_CHANNEL = TUNES_GUILD.channels.get(client.strings.ids.channel_id);
	var queue = client.queue;
	module.execute =  function(msg){
		console.log(msg.author.username + " queue");
		if(msg.channel.id !== TUNES_CHANNEL.id){
			return msg.reply(`Please keep \`tunes\` commands in ${TUNES_CHANNEL}. S-sorry, senpai.`);
		}

		if(queue.length === 0){
			return TUNES_CHANNEL.sendMessage("We've got no tunes -- queue something up, fampai!");
		}
		let tosend = [];
		tosend.push(`**${queue.length}** ${queue.length === 1 ? "song" : "songs"} in queue ${(queue.length > 10 ? "*[Only next 10 songs are displayed]*" : "")}`);
		tosend.push("```");
		tosend.push(`1. ${queue[0].title} (${getFormattedTime(client.dispatcher.time)} / ${getFormattedTime(queue[0].runtime * 1000)}) - ${queue[0].requester.username}`);
		for(let i = 1; i < 10 && i < queue.length; i++){
			tosend.push(`${i+1}. ${queue[i].title} (${getFormattedTime(queue[i].runtime * 1000)}) - ${queue[i].requester.username}`);
		}
		tosend.push("```");
		return TUNES_CHANNEL.sendMessage(tosend);
	};
	function getFormattedTime(ms){
		let d = new Date(ms);
		return `${addZero(d.getUTCHours())}:${addZero(d.getUTCMinutes())}:${addZero(d.getUTCSeconds())}`;
	}

	function addZero(i) {
		if (i < 10) {
			i = "0" + i;
		}
		return i;
	}
	module.help = `${client.prefix}queue :: Display the current queue.`;
	return module;
};
