module.exports = function(args){
    var module = {};
    const client = args.client;
    module.execute = function(msg){
        console.log(msg.author.username + " help");
        msg.channel.sendMessage(client.strings.help);
    }

    return module;
};
