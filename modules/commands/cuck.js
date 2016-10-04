module.exports = function(args){
    var module = {};
    const client = args.client;
    module.execute = function(msg){
        console.log(msg.author.username + " cuck");
        let message = [];

        // Hawk
        if(msg.author.id == client.strings.ids.hawk){
            message.push(client.strings.cuck.hawk);
        }
        else{
            for(let i = 0; i < client.strings.cuck.seraph.length; i++){
                message.push(client.strings.cuck.seraph[i]);
            }
            message.push("Ah! It's from Seraph-chan! She says... '" + msg.author + ", please tap me'? Huh?");
        }
        msg.reply(message);
    }

    return module;
};
