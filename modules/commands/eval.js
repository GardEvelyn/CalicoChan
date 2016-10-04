/**
 * Eval command adapted from LuckyEvie @ https://github.com/eslachance/djs-selfbot-v9
 */

module.exports = function(args){
    var module = {};
    const client = args.client;
    const beautify = require('js-beautify').js_beautify;

    module.execute = function(msg){
        if(msg.author.id != client.strings.ids.admin){
            return;
        }
        msg.reply('Evaluating...').then(reply => {
            let code = msg.content.split(" ").slice(1).join(" ");
            try {
                let evaled = eval(code);
                console.log(evaled);
                if (typeof evaled !== 'string'){
                        console.log(evaled);
                        evaled = require('util').inspect(evaled);
                        console.log(evaled);
                }
                reply.edit("`In:`\n" +
                        "```js\n" + beautify(clean(code)) + '\n```\n' +
                        "`Out:`\n" +
                        "```xl\n" + clean(evaled) +
                        "\n```"
                );
            }
            catch(err) {
                reply.edit("`In:`\n" +
                        "```js\n" + beautify(clean(code)) + "\n```\n" +
                        "`Out:`\n" +
                        "```xl\n" + clean(err) +
                        "\n```");
            }
        });

    }

    function clean(text) {
      if (typeof(text) === "string") {
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
      }
      else {
          return text;
      }
    }
    return module;
};
