const parseString = require('xml2js').parseString;
var fs = require("fs");
var adv1 = fs.readFileSync("./assets/adversaryxml/01.Adversary.xml");
var adv2 = fs.readFileSync("./assets/adversaryxml/02.Adversary.xml");
//var adv3 = fs.readFileSync("./assets/adversaryxml/03.Adversary.xml");
var adv4 = fs.readFileSync("./assets/adversaryxml/01.Adversary MSE.xml");
var adv5 = fs.readFileSync("./assets/adversaryxml/01.ADVMSE2.xml");

console.log("Updating adversaries!");
var adversaries = {};

parseString(adv1, function(err, result){
    addAdversariesToJSON(err, result);
});
parseString(adv2, function(err, result){
    addAdversariesToJSON(err, result);
});
// parseString(adv3, function(err, result){
//     addAdversariesToJSON(err, result);
// });
parseString(adv4, function(err, result){
    addAdversariesToJSON(err, result);
});
parseString(adv5, function(err, result){
    addAdversariesToJSON(err, result);
});

function addAdversariesToJSON(err, result){
    let cards_a = result.cockatrice_carddatabase.cards[0].card;
    for(let i = 0; i < cards_a.length; i++){
        let adversary_o = {};
        let card_o = cards_a[i];

        if(card_o.name != null){
            adversary_o.name = card_o.name[0];
        }
        if(card_o.color != null){
            adversary_o.colorIdentity = [];
            for(let j = 0; j < card_o.color[0].length; j++){
                adversary_o.colorIdentity.push(card_o.color[0][j].toUpperCase());
            }
        }

        if(card_o.type != null){
            adversary_o.type = card_o.type[0];
        }

        if(card_o.text != null){
            adversary_o.text = card_o.text[0];
        }

        if(card_o.set != null){
            adversary_o.set = card_o.set[0]._;
        }

        if(adversary_o.type != null){
            if(adversary_o.type == "Adversary"){
                adversary_o.layout = "adversary";
            }
            else{
                continue;
            }
            // else if(adversary_o.type == "Token"){
            //     adversary_o.layout = "token";
            // }
            // else if(adversary_o.type == "Land"){
            //     adversary_o.layout = "normal";
            // }
        }
        adversary_o.legalities = [ { "format" : "Adversary",
                                "legality" : "Legal" }];

        adversaries[adversary_o.name] = adversary_o;
    }
}

fs.writeFile("assets/json/adversary.json", JSON.stringify(adversaries), function(err) {
    if(err) {
        console.log("JSON error?");
    }
    console.log("Success!");
});
