module.exports = function(module_args){
	var module = {};
	const client = module_args.client;
	const YouTube = require("simple-youtube-api");
	const yt_api = new YouTube(client.ytkey);
	const yt_dl = require("ytdl-core");
	const TUNES_GUILD = client.guilds.get(client.strings.ids.guild_id);
	const TUNES_VOICE = TUNES_GUILD.channels.get(client.strings.ids.voice_id);
	const TUNES_CHANNEL = TUNES_GUILD.channels.get(client.strings.ids.channel_id);
	var queue = [];
	var playing = false;
	var dispatcher;
	module.execute = function(msg){
		let args = msg.content.split(" ").splice(1);
		if(msg.channel.id !== TUNES_CHANNEL.id){
			return msg.reply(`Please keep \`tunes\` commands in ${TUNES_CHANNEL}. S-sorry, senpai.`);
		}
		if(TUNES_VOICE.members.get(msg.author.id) == null){
			return msg.reply("Please only execute \`tunes\` commands if you are actually listening to tunes.");
		}

		if(args[0] === "queue"){
			reportQueue(TUNES_CHANNEL);
		}
		else if ( args[0] === "skip" && playing){
			let song;
			if(args[1]){
				try{
					song = queue[parseInt(args[1] - 1)];
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
				if(song.skipVotes.length >= (Math.ceil((TUNES_VOICE.members.array().length - 1) / 2))){
					TUNES_CHANNEL.sendMessage("Song skipped.").then(() => {
						msg.delete();
						if(args[1]){
							queue.splice(args[1] - 1, 1);
						}
						else{
							dispatcher.end();
						}
					});
				}
				else{
					TUNES_CHANNEL.sendMessage(`Skip vote recorded. Total: ${song.skipVotes.length}.`).then(() =>{
						msg.delete();
					});
				}
			}
		}
		else{
			let url = msg.content.split(" ")[2].trim();
			if (url == "" || url === undefined) {
				return TUNES_CHANNEL.sendMessage("Eh? Where's the tune, fampai?");
			}
			yt_dl.getInfo(url, (err, info) => {
				if(err) {
					searchForVideo(msg).then((song) => {
						pushSong(song);
						msg.delete().then( () => {
							reportQueue(TUNES_CHANNEL).then( () => {
								if(!playing){
									play(queue[0]);
								}
							});
						});

					}).catch(console.log);
				}
				else{
					pushSong({url: url, title: info.title, runtime: info.length_seconds, requester: msg.author.username});
					msg.delete().then( () => {
						reportQueue(TUNES_CHANNEL).then( () => {
							if(!playing){
								play(queue[0]);
							}
						});
					});
				}
			});
		}
	};

	function reportQueue(textchannel){
		if(queue.length === 0){
			return textchannel.sendMessage("We've got no tunes -- queue something up, fampai!");
		}
		let tosend = [];
		queue.forEach((song, i) => { tosend.push(`${i+1}. ${song.title} (${addZero(new Date(song.runtime * 1000).getUTCHours())}:${addZero(new Date(song.runtime * 1000).getUTCMinutes())}:${addZero(new Date(song.runtime * 1000).getUTCSeconds())}) - ${song.requester}`);});
		return textchannel.sendMessage(`**${queue.length}** ${queue.length === 1 ? "song" : "songs"} in queue ${(queue.length > 10 ? "*[Only next 10 songs are displayed]*" : "")}\n\`\`\`${tosend.slice(0,15).join("\n")}\`\`\``);
	}
	function pushSong(song){
		song.skipVotes = [];
		queue.push(song);
	}
	function searchForVideo(msg){
		return new Promise( (resolve, reject ) => {
			let query = msg.content.split(" ").splice(2).join(" ");
			yt_api.searchVideos(query, 1).then(results => {
				yt_api.getVideoByID(results[0].id).then( video => {
					resolve({url: video.url, title: video.title, runtime: video.durationSeconds, requester: msg.author.username});
				});
			}).catch(reject);
		});
	}

	function play(song) {
		getVoiceConnection().then( connection => {
			playing = true;
			try{
				if (song === undefined) return TUNES_CHANNEL.sendMessage("Finished queue.").then(() => {
					playing = false;
					client.user.setStatus("online");
					connection.disconnect();
					TUNES_VOICE.leave();
				});
				client.user.setStatus("online", song.title);
				dispatcher = connection.playStream(yt_dl(song.url, { audioonly: true }), {passes : 3});
				dispatcher.on("end", () => {
					queue.shift();
					reportQueue(TUNES_CHANNEL).then(play(queue[0]));
				});
				dispatcher.on("error", (err) => {
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
			if(!TUNES_GUILD.voiceConnection){
				TUNES_VOICE.join().then(resolve).catch(reject);
			}
			else{
				resolve(TUNES_GUILD.voiceConnection);
			}
		});
	}

	function addZero(i) {
		if (i < 10) {
			i = "0" + i;
		}
		return i;
	}

	module.help = `${client.prefix}tunes <YouTube URL | Query> :: Queues up a tune to play in ${TUNES_VOICE}.\n${client.prefix}tunes skip [index] :: Vote to skip the currently playing tune [or the one at the specified index].\n${client.prefix}tunes queue :: Display the current queue.`;

	return module;
};
