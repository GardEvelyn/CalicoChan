module.exports = function(args){
    var module = {};
    const client = args.client;
    const validator = require('./../DeckValidator')({'client' : client});
    module.execute =  function(msg){
        console.log(msg.author.username + " validate");
        try{
            validator.validateList(msg.content.substring(9)).then(report => {
                console.log("got report");
                let message = [];
                if(report.adversary == null){
                    message.push(client.strings.validate.advnull);
                }
                else{
                    message.push("***Adversary: " + report.adversary.name + "***");
                    message.push('');
                }
                if(report.unrecognized.length != 0){
                    message.push(client.strings.validate.unrecognized);
                    for(let i = 0; i < report.unrecognized.length; i++){
                        message.push(report.unrecognized[i]);
                    }
                    message.push('');
                }

                if(report.illegal.length != 0){
                    message.push(client.strings.validate.illegal);
                    for(let i = 0; i < report.illegal.length; i++){
                        message.push(report.illegal[i]);
                    }
                    message.push('');
                }

                if(report.badcolor.length != 0){
                    message.push(client.strings.validate.badcolor);
                    for(let i = 0; i < report.badcolor.length; i++){
                        message.push(report.badcolor[i]);
                    }
                    message.push('');
                }
                else{
                    for(let i = 0; i < client.strings.validate.decklistok.length; i++){
                        message.push(client.strings.validate.decklistok[i]);
                    }
                }

                message.push(client.strings.validate.contact);

                msg.author.sendMessage(message);
            });
        }
        catch(err){
            msg.author.sendMessage(client.strings.err);
            console.log(err);
        }
    };

    return module;
};
