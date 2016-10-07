module.exports = function(args){
    var module = {};
    const client = args.client;
    module.execute = function(msg){
        console.log(msg.author.username + " pet");
        messages = client.strings.pet;
        if(msg.mentions.users.size > 0){
            let targets_a = msg.mentions.users.map((user) => {
                return user.toString();
            });
            msg.channel.sendMessage(`*pets ${targets_a.join(', ')}*`)
        }
        else{
            let r = random(0, messages.length - 1);
            msg.reply(messages[r]);
        }
    }
    // Helper
    function random (low, high) {
        return Math.floor(Math.random() * (high - low + 1) + low);
    }
    return module;
};
