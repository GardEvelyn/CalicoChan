module.exports = function(args){
    var module = {};
    var fs = require('fs');
    let abilities_o = JSON.parse(fs.readFileSync('./assets/json/adversary_abilities.json'));
    var abilityGen = require('./../Abilities')({abilities : abilities_o});
    const client = args.client;
    module.execute = function(msg){
        console.log(msg.author.username + " ability");
        try{
            let category = msg.content.substring(8).trim();
            let message = [];
            let ability = {};
            message.push(msg.author + ", your random ability is:")
            message.push("```");
            if(category.length > 0){
                ability = abilityGen.getRandomAbility(category);
            }
            else{
                ability = abilityGen.getRandomAbility()
            }
            message.push(ability.name);
            message.push(ability.text);
            message.push("```");
            msg.channel.sendMessage(message);
        }
        catch(err){
            msg.author.sendMessage(client.strings.errformat);
            console.log(err);
        }
    }

    return module;
};
