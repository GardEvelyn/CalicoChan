module.exports = function(args){
    var module = {};
    var request = require('request');
    const client = args.client;
    module.execute = function(msg){
        console.log(msg.author.username + " booster");
        try{
            let setCode = msg.content.substring(8).trim();
            request("https://api.magicthegathering.io/v1/sets/" + setCode + "/booster", function(error, response, body) {
                let bodyJSON = JSON.parse(body);
                let message = [];
                if(response.statusCode == 200){
                    message.push("**" + msg.author + ", your " + setCode.toUpperCase() + " booster pack contained:**");
                    bodyJSON.cards.forEach(card => {
                        message.push(card.name);
                    });
                }
                else if(response.statusCode == 404){
                    for(let i = 0; i < client.strings.booster.unabletofind.length; i++){
                        message.push(client.strings.booster.unabletofind[i]);
                    }
                }
                else{
                    console.log(response.statusCode);
                    message.push(client.strings.err);
                }
                msg.channel.sendMessage(message);
            });
        }
        catch(err){
            msg.author.sendMessage(client.strings.err);
            console.log(err);
        }
    }
    return module;
};
