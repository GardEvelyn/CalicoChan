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
                else if(matches.length >= 20){
                    message.push(client.strings.oracle.toomanymatches);
                }
                else{
                    let card;
                    if(20 > matches.length && matches.length > 1){
                        matches.forEach(match => {
                            if(match.name.toUpperCase() === args.toUpperCase()){
                                card = match;
                            }
                        });
                    }
                    else{
                        card = matches[0];
                    }

                    if(card){
                        message.push("```");
                        let nameline = "";
                        nameline += card.name;
                        if(card.manaCost){
                            nameline += ` - ${card.manaCost}`;
                        }
                        message.push(nameline);

                        if(card.type){
                            message.push("");
                            message.push(card.type);
                        }

                        if(card.text){
                            message.push("");
                            message.push(card.text);
                        }

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
                    else{
                        message.push("")
                        message.push(client.strings.oracle.multiplematches);
                        message.push("```");
                        matches.forEach(match => {
                            message.push(match.name);
                        })
                        message.push("```");
                    }
                }
                replyToEdit.edit(message);
            }).catch(err => {
                console.log(err);
                replyToEdit.edit(client.strings.err);
            });
        });
    }

    return module;
};
