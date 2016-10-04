module.exports = function(args){
    var module = {};
    const client = args.client;
    const adversaryUtil = require('./../AdversaryUtil')({'client': client});
    module.execute = function(msg){
        console.log(msg.author.username + " spoiler");
        let args = msg.content.substring(8).trim();
        adversaryUtil.getAdversaries(args).then(adversaries => {
            let message = [];
            if(adversaries == null || adversaries.length == 0){
                message.push("Sorry, I couldn't find any adversaries matching that name.");
            }
            else{
                for(let i = 0; i < adversaries.length; i++){
                    let adversary = adversaries[i];
        			message.push("```");
        			message.push(`${adversary.name} - ${adversary.colorIdentity}`);
        			message.push("");
                    message.push(adversary.text);
        			message.push("```");
                    message.push("");
                }
            }

            msg.channel.sendMessage(message);
        });

    }

    return module;
};
