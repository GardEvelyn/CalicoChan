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
	var recentlySkipped = false;
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
			if(queue.length === 0){
				return msg.reply("Sorry, there's no tunes to skip right now. W-would you like to listen to some with me?");
			}
			if(recentlySkipped){
				return msg.reply("Sorry, a tune was recently skipped. Please wait a few seconds.");
			}
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
				if(song.requester.id === msg.author.id || song.skipVotes.length >= (Math.ceil((TUNES_VOICE.members.array().length - 1) / 2))){
					TUNES_CHANNEL.sendMessage(`${song.title} skipped.`).then(() => {
						msg.delete();
						recentlySkipped = true;
						setTimeout(() => {
							recentlySkipped = false;
						}, 5000);
						if(args[1]){
							queue.splice(args[1] - 1, 1);
						}
						else{
							dispatcher.end();
						}
					});
				}
				else{
					TUNES_CHANNEL.sendMessage(`Skip vote recorded for ${song.title}. Total: ${song.skipVotes.length}.`).then(() =>{
						msg.delete();
					});
				}
			}
		}
		else{
			let url = msg.content.split(" ")[1];
			if (url == "" || url === undefined) {
				return TUNES_CHANNEL.sendMessage("Eh? Where's the tune, fampai?");
			}
			else{
				url = url.trim();
			}
			yt_dl.getInfo(url, (err, info) => {
				if(err) {
					searchForVideo(msg).then((song) => {
						pushSong(song, TUNES_CHANNEL).then( () => {
							msg.delete().then( () => {
								if(!playing){
									play(queue[0]);
								}
							});
						});
					}).catch( (err) => {
						console.log(err);
						msg.reply("S-sorry, I couldn't find that tune.");
					});
				}
				else{
					pushSong({url: url, title: info.title, runtime: info.length_seconds, requester: msg.author}, TUNES_CHANNEL).then( () => {
						msg.delete().then( () => {
							if(!playing){
								play(queue[0]);
							}
						});
					});
				}
			});
		}
	};

	function reportQueue(textchannel, reportEntireQueue = true){
		if(queue.length === 0){
			return textchannel.sendMessage("We've got no tunes -- queue something up, fampai!");
		}
		let tosend = [];
		if(reportEntireQueue){
			tosend.push(`**${queue.length}** ${queue.length === 1 ? "song" : "songs"} in queue ${(queue.length > 10 ? "*[Only next 10 songs are displayed]*" : "")}`);
			tosend.push("```");
			tosend.push(`1. ${queue[0].title} (${getFormattedTime(dispatcher.time)} / ${getFormattedTime(queue[0].runtime * 1000)}) - ${queue[0].requester.username}`);
			for(let i = 1; i < 10 && i < queue.length; i++){
				tosend.push(`${i+1}. ${queue[i].title} (${getFormattedTime(queue[i].runtime * 1000)}) - ${queue[i].requester.username}`);
			}
			tosend.push("```");
		}
		else{
			tosend.push(`Currently playing: \`${queue[0].title}\` - \`${queue[0].requester.username}\`.`);
		}
		return textchannel.sendMessage(tosend);
	}

	function getFormattedTime(ms){
		let d = new Date(ms);
		return `${addZero(d.getUTCHours())}:${addZero(d.getUTCMinutes())}:${addZero(d.getUTCSeconds())}`;
	}

	function pushSong(song, textchannel){
		song.skipVotes = [];
		queue.push(song);
		return textchannel.sendMessage(`Successfully added \`${song.title}\` to the end of the queue.`);
	}
	function searchForVideo(msg){
		return new Promise( (resolve, reject ) => {
			let query = msg.content.split(" ").splice(2).join(" ");
			yt_api.searchVideos(query, 1).then(results => {
				yt_api.getVideoByID(results[0].id).then( video => {
					resolve({url: video.url, title: video.title, runtime: video.durationSeconds, requester: msg.author});
				});
			}).catch(reject);
		});
	}

	function play(song) {
		getVoiceConnection().then( connection => {
			playing = true;
			try{
				if (song === undefined) {
					playing = false;
					client.user.setStatus("online");
					connection.disconnect();
					TUNES_VOICE.leave();
					return;
				}
				client.user.setStatus("online", song.title);
				dispatcher = connection.playStream(yt_dl(song.url, { audioonly: true }), {passes : 3});
				dispatcher.on("end", () => {
					queue.shift();
					reportQueue(TUNES_CHANNEL, false).then(play(queue[0]));
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

	module.help = `${client.prefix}tunes <YouTube URL | Query> :: Queues up a tune to play.\n${client.prefix}tunes skip [index] :: Vote to skip the currently playing tune [or the one at the specified index].\n${client.prefix}tunes queue :: Display the current queue.`;

	return module;
};
