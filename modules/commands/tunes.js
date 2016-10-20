module.exports = function(args){
	var module = {};
	const client = args.client;
	//const yt_api = require("simple-youtube-api");
	const yt_dl = require("ytdl-core");
	const TUNES_GUILD = client.guilds.get(client.strings.ids.guild_id);
	const TUNES_VOICE = TUNES_GUILD.channels.get(client.strings.ids.voice_id);
	const TUNES_CHANNEL = TUNES_GUILD.channels.get(client.strings.ids.channel_id);
	let queue = [];
	let playing = false;
	var dispatcher;
	module.execute = function(msg){
		let subcommand = msg.content.split(" ")[1];
		if(msg.channel.id !== TUNES_CHANNEL.id){
			return msg.reply(`Please keep \`tunes\` commands in ${TUNES_CHANNEL}. S-sorry, senpai.`);
		}
		if(TUNES_VOICE.members.get(msg.author.id) == null){
			return msg.reply("Please only execute \`tunes\` commands if you are actually listening to tunes.");
		}
		if ( subcommand === "skip" && playing){
			let song = queue[0];
			for(let i = 0; i < song.skipVotes.length; i++){
				if(song.skipVotes[i] == msg.author.id){
					msg.delete();
					return;
				}
			}
			if(TUNES_VOICE.members.get(msg.author.id) != null){
				song.skipVotes.push(msg.author.id);
				if(song.skipVotes.length >= (Math.ceil((TUNES_VOICE.members.array().length - 1) / 2))){
					TUNES_CHANNEL.sendMessage("Song skipped.").then(() => {
						msg.delete();
						dispatcher.end();
					});
				}
				else{
					TUNES_CHANNEL.sendMessage(`Skip vote recorded. Total: ${song.skipVotes.length}.`).then(() =>{
						msg.delete();
					});
				}
			}
		}
		else if(subcommand === "play"){
			let url = msg.content.split(" ")[2].trim();
			if (url == "" || url === undefined) {
				return TUNES_CHANNEL.sendMessage("Eh? Where's the tune, fampai?");
			}
			yt_dl.getInfo(url, (err, info) => {
				if(err) {
					return msg.channel.sendMessage(err);
				}

				queue.push({url: url, title: info.title, runtime: info.length_seconds, requester: msg.author.username});
				let tosend = [];
				queue.forEach((song, i) => { tosend.push(`${i+1}. ${song.title} (${addZero(new Date(song.runtime * 1000).getUTCHours())}:${addZero(new Date(song.runtime * 1000).getUTCMinutes())}:${addZero(new Date(song.runtime * 1000).getUTCSeconds())}) - ${song.requester}`);});
				TUNES_CHANNEL.sendMessage(`**${queue.length}** songs in queue ${(queue.length > 10 ? "*[Only next 10 songs are displayed]*" : "")}\n\`\`\`${tosend.slice(0,15).join("\n")}\`\`\``);
				msg.delete().then( () => {
					if(!playing){
						play(queue[0]);
					}

				});
			});
		}
	};


	function play(song) {
		playing = true;
		getVoiceConnection().then( connection => {
			try{
				if (song === undefined) return TUNES_CHANNEL.sendMessage("Finished queue.").then(() => {
					console.log("Finished queue");
					playing = false;
					client.user.setStatus("online");
					connection.disconnect();
					TUNES_VOICE.leave();
				});
				client.user.setStatus("online", song.title);
				song.skipVotes = [];
				dispatcher = connection.playStream(yt_dl(song.url, { audioonly: true }), {passes : 3});
				dispatcher.on("end", () => {
					queue.shift();
					let tosend = [];
					queue.forEach((song, i) => { tosend.push(`${i+1}. ${song.title} (${addZero(new Date(song.runtime * 1000).getUTCHours())}:${addZero(new Date(song.runtime * 1000).getUTCMinutes())}:${addZero(new Date(song.runtime * 1000).getUTCSeconds())}) - ${song.requester}`);});
					if(queue.length > 0){
						TUNES_CHANNEL.sendMessage(`**${tosend.length}** songs in queue ${(tosend.length > 10 ? "*[Only next 10 songs are displayed]*" : "")}\n\`\`\`${tosend.slice(0,15).join("\n")}\`\`\``);
					}
					play(queue[0]);
				});
				dispatcher.on("error", (err) => {
					console.log("Dispatcher.error");
					console.log(err);
					return TUNES_CHANNEL.sendMessage(err).then(() => {
						console.log("Received error event.");
						queue.shift();
						play(queue[0]);
					});
				});
			}
			catch(err){
				console.log(err);
				TUNES_CHANNEL.sendMessage("Something... went wrong. Attempting to restart queue.").then(() => {
					play(queue[0]);
				});
			}
		});
	}
	function getVoiceConnection(){
		return new Promise( (resolve, reject) => {
			if(!client.voiceConnections.get(TUNES_VOICE.id)){
				TUNES_VOICE.join().then(resolve).catch(reject);
			}
			else{
				resolve(client.voiceConnections.get(TUNES_VOICE.id));
			}
		});
	}

	function addZero(i) {
		if (i < 10) {
			i = "0" + i;
		}
		return i;
	}

	return module;
};
