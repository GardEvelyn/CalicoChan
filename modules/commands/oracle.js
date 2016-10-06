module.exports = function(args){
    var module = {};
    const client = args.client;
    module.execute = function(msg){
        console.log(msg.author.username + " oracle");
        let args = msg.content.substring(7).trim();
        msg.reply(`Searching for ${args}. . .`).then(replyToEdit => {
            client.db.collection('cards').find({name: new RegExp(args, 'i')}).toArray().then(matches => {
                let message = [];
                message.push(msg.author);
                if(matches == null || matches.length == 0){
                    message.push(client.strings.oracle.unabletofind);
                }
                else if(20 > matches.length && matches.length > 1){
                    message.push("")
                    message.push(client.strings.oracle.multiplematches);
                    message.push("```");
                    matches.forEach(match => {
                        message.push(match.name);
                    })
                    message.push("```");
                }
                else if(matches.length >= 20){
                    message.push(client.strings.oracle.toomanymatches);
                }
                else{
                    let card = matches[0];
                    message.push("```");
                    let nameline = "";
                    nameline += card.name;
                    if(card.manaCost){
                        nameLine += ` - ${card.manaCost}`;
                    }
                    message.push(nameline);
                    message.push("");
                    message.push(card.type);
                    message.push("");
                    message.push(card.text);
                    if(card.power){
                        message.push("");
                        message.push(`${card.power}/${card.toughness}`);
                    }
                    if(card.loyalty){
                        message.push("");
                        message.push(`Loyalty: ${card.loyalty}`);
                    }

                    if(card.flavor){
                        message.push("");
                        message.push(card.flavor);
                    }
                    message.push("```");
                }
                replyToEdit.edit(message);
            });
        });
    }

    return module;
};
