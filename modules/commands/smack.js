module.exports = function(args){
    var module = {};
    const client = args.client;
    module.execute = function(msg){
        console.log(msg.author.username + " smack");
        let r = random(1, 10);
        let message = [];
        if(r == 10){
            for(let i = 0; i < client.strings.smack.puke.length; i++){
                message.push(client.strings.smack.puke[i]);
            }
        }
        else{
            messages = client.strings.smack.pain;
            let r = random(0, messages.length - 1);
            message.push(messages[r]);
        }
        msg.reply(message);
    }
    // Helper
    function random (low, high) {
        return Math.floor(Math.random() * (high - low + 1) + low);
    }

    return module;
};
