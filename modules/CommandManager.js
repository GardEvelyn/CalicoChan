module.exports = function (args) {
    const client = args.client;
    const dir = './modules/commands/';
    const fs = require('fs');

    var commands = new Map();
    fs.readdir(dir, (err, files) => {
        if(err){
            console.log(dir);
            console.log(err);
            process.exit(0);
        }
        else{
            for(let i = 0; i < files.length; i++){
                let fileName = files[i];
                commands.set(/(.*)\.js/.exec(fileName)[1], require(`./commands/${/(.*)\.js/.exec(fileName)[1]}`)({'client': client}).execute);
            }
        }
    });

    //module.commands = commands;
    return commands;
};
