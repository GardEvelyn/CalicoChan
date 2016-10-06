module.exports = function (abilities_o) {
    var module = {};
    var abilities = abilities_o.abilities;

    var deck = [];
    var categorizedDecks = {};

    var categories_a = Object.getOwnPropertyNames(abilities);
    for(let i = 0; i < categories_a.length; i++){

        let category_a = abilities[categories_a[i]];
        categorizedDecks[categories_a[i]] = [];
        for(let j = 0; j < category_a.length; j++){
            let card = category_a[j];
            let ability = {};
            ability.name = card.name;
            ability.text = card.text;
            for(let k = 0; k < card.quantity; k++){
                deck.push(ability);
                categorizedDecks[categories_a[i]].push(ability);
            }
        }
    }

    function random (low, high) {
        return Math.floor(Math.random() * (high - low + 1) + low);
    }
    module.getRandomAbility = function(category){
        if(category == null){
            return deck[random(0, deck.length - 1)];
        }
        let catdeck = categorizedDecks[category];
        return catdeck[random(0, catdeck.length - 1)];
    }
    return module;

}
