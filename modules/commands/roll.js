module.exports = function(args){
    var module = {};
    const client = args.client;
    module.execute = function(msg){
        console.log(msg.author.username + " roll");
        try{
            let command = msg.content.substring(5).trim();
            let parameters_a = command.match(/(\d+)d(\d+)/);
            let quantity = parameters_a[1];
            let sides = parameters_a[2];

            if(quantity < 100){
                let total = 0;
                let message_a = [];
                message_a.push(msg.author + " rolled " + quantity + "d" + sides + ":");
                for(let i = 0; i < quantity; i++){
                    let roll = random(1, sides);
                    total += roll;
                    message_a.push(roll)
                }
                message_a.push('');
                message_a.push("**TOTAL: " + total + "**");
                message_a.push('');
                msg.channel.sendMessage(message_a);
            }
            else{
                msg.channel.sendMessage(client.strings.roll.toomanydice);
            }
        }
        catch(err){
            msg.author.sendMessage(client.strings.errformat);
            console.log(err);
        }
    }
    // Helper
    function random (low, high) {
        return Math.floor(Math.random() * (high - low + 1) + low);
    }
    return module;
};
