module.exports = function(args){
	var module = {};
	const client = args.client;
	const YouTube = require("simple-youtube-api");
	const yt_api = new YouTube(client.ytkey);
	const yt_dl = require("ytdl-core");
	const TUNES_GUILD = client.guilds.get(client.strings.ids.guild_id);
	const TUNES_VOICE = TUNES_GUILD.channels.get(client.strings.ids.voice_id);
	const TUNES_CHANNEL = TUNES_GUILD.channels.get(client.strings.ids.channel_id);

	var queue = client.queue;

	module.execute =  function(msg){
		console.log(msg.author.username + " play");
		if(msg.channel.id !== TUNES_CHANNEL.id){
			return msg.reply(`Please keep \`tunes\` commands in ${TUNES_CHANNEL}. S-sorry, senpai.`);
		}
		if(TUNES_VOICE.members.get(msg.author.id) == null){
			return msg.reply("Please only execute tunes-related commands if you are actually listening to tunes.");
		}

		if(msg.channel.id !== TUNES_CHANNEL.id){
			return msg.reply(`Please keep \`tunes\` commands in ${TUNES_CHANNEL}. S-sorry, senpai.`);
		}
		if(TUNES_VOICE.members.get(msg.author.id) == null){
			return msg.reply("Please only execute tunes-related commands if you are actually listening to tunes.");
		}

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
							if(queue.length === 0){
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
						if(queue.length === 0){
							play(queue[0]);
						}
					});
				});
			}
		});
	};
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
			try{
				if (song === undefined) {
					client.user.setStatus("online");
					connection.disconnect();
					TUNES_VOICE.leave();
					return;
				}
				client.user.setStatus("online", song.title);
				client.dispatcher = connection.playStream(yt_dl(song.url, { audioonly: true }), {passes : 3});
				client.dispatcher.on("end", () => {
					queue.shift();
					reportCurrentlyPlaying(TUNES_CHANNEL).then(play(queue[0]));
				});
				client.dispatcher.on("error", (err) => {
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
	function reportCurrentlyPlaying(textchannel){
		return textchannel.sendMessage(`Currently playing: \`${queue[0].title}\` - \`${queue[0].requester.username}\`.`);
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
	module.help = `${client.prefix}play <YouTube URL | Query> :: Queues up a tune to play.`;
	return module;
};
