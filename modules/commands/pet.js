module.exports = function(args){
    var module = {};
    const client = args.client;
    module.execute = function(msg){
        console.log(msg.author.username + " pet");
        messages = client.strings.pet;
        let r = random(0, messages.length - 1);
        msg.reply(messages[r]);
    }
    // Helper
    function random (low, high) {
        return Math.floor(Math.random() * (high - low + 1) + low);
    }
    return module;
};
