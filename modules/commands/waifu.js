module.exports = function(args){
    var module = {};
    const client = args.client;
    module.execute = function(msg){
        console.log(msg.author.username + " waifu");
        msg.reply(client.strings.waifu);
    }

    return module;
};
