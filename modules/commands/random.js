module.exports = function(args){
    var module = {};
    const client = args.client;
    const request = require("request");

    module.execute =  function(msg){
        console.log(msg.author.username + " random");
        msg.reply('Fetching a random card...').then(reply => {
            request("http://gatherer.wizards.com/Pages/Card/Details.aspx?action=random", function(error, response, body) {
                if(response.statusCode == 200){
                    let regex = /GET (.*) HTTP/;
                    reply.edit(`${msg.author} - http://gatherer.wizards.com${response.connection._httpMessage._header.match(regex)[1]}`);
                }
            });
        })

    };
    return module;
};
