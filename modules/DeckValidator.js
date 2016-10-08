/**
 * Uses the black magic of spaghetti to validate Adversary decklists.
 * // TODO: Make this module a bit more sane.
 */
module.exports = function (args) {
	var module = {};
	const client = args.client;

	module.validateList = function(decklist){
		return validate(decklist);
	};

	function findAndSpliceAdversary(deck){
		// Find Adversary, record, remove from deck
		return new Promise ((resolve, reject) => {
			for (let i = 0; i < deck.length; i++){
				let name = deck[i].name;
				client.db.collection("adversaries").find({"name" : name}).toArray().then(matchedAdversaries => {
					if(matchedAdversaries.length == 0){
						return resolve(null);
					}
					if(matchedAdversaries[0].type == "Adversary"){
						deck.splice(i, 1);
						return resolve(matchedAdversaries[0]);
					}
				});
			}
		});
	}

	function validate(decklist){
		return new Promise( (resolve, reject) => {
			let deck = convertArrayToJS(convertRawToArray(decklist));
			let report = {};
			report.adversary = null;
			report.illegal = [];
			report.unrecognized = [];
			report.badcolor = [];

			findAndSpliceAdversary(deck).then(adv => {
				report.adversary = adv;

				if(report.adversary != null){
					// Check for and excise Rifts from deck
					for (let i = 0; i < deck.length; i++){
						let name = deck[i].name;
						if(name == "Rift"){
							if(!matchesColorIdentity(["P"],  report.adversary.colorIdentity)){
								report.illegal.push(deck[i].name);
							}
							deck.splice(i, 1);
							break;
						}
						else{
							continue;
						}
					}
				}
				else{
					for (let i = 0; i < deck.length; i++){
						let name = deck[i].name;
						if(name == "Rift"){
							deck.splice(i, 1);
							break;
						}
						else{
							continue;
						}
					}
				}
				checkDecklist(deck, report).then(() => {
					resolve(report);
				});
			});
		});
	}

	function checkDecklist(deck, report){
		let promises = [];
		for(let i = 0; i < deck.length; i++){
			let name = deck[i].name;
			promises.push(client.db.collection("cards").find({"name" : name}).toArray().then(matches => {
				let quantity = deck[i].quantity;
				if(!matches[0]){
					return report.unrecognized.push(name);
				}
				if(ignoredType(matches[0].layout)){
					return;
				}

				if(report.adversary && !matchesColorIdentity(matches[0].colorIdentity, report.adversary.colorIdentity)){
					return report.badcolor.push(matches[0].name);
				}
				if(illegalType(matches[0].layout)){
					return report.illegal.push(name);
				}

				if(quantity > 1 && !canHaveMultiples(name)){
					return report.illegal.push(name);
				}

				let legalities = matches[0].legalities;

				if(legalities == null){
					return;
				}

				let legal = false;
				for(let j = 0; j < legalities.length; j++){
					if((legalities[j].format.toUpperCase() == "MODERN" && legalities[j].legality.toUpperCase() == "LEGAL")
					|| (legalities[j].format.toUpperCase() == "ADVERSARY" && legalities[j].legality.toUpperCase() == "ADVERSARY")){
						legal = true;
						continue;
					}
				}

				if(!legal){
					return report.illegal.push(name);
				}
			}));
		}
		return Promise.all(promises);
	}

	function illegalType(type){
		let t = type.toUpperCase();
		if(t == "PLANE" || t == "SCHEME" || t == "PHENOMENON" || t == "VANGUARD"){
			return true;
		}
		else{
			return false;
		}
	}

	function ignoredType(type){
		let t = type.toUpperCase();
		if(t == null || t == "TOKEN"){
			return true;
		}
		else{
			return false;
		}
	}

	function matchesColorIdentity(lhsColors_a, rhsColors_a){
		if(lhsColors_a == null){
			lhsColors_a = [];
		}
		if(rhsColors_a == null){
			rhsColors_a = [];
		}
		if(rhsColors_a.length == 0 && lhsColors_a.length != 0){
			return false;
		}
		if(lhsColors_a.length == 0){
			return true;
		}
		for(let i = 0; i < lhsColors_a.length; i++){
			let foundMatch = false;
			for(let j = 0; j < rhsColors_a.length; j++){
				if(lhsColors_a[i] == rhsColors_a[j] || rhsColors_a[j] == "P"){
					foundMatch = true;
				}
			}
			if(!foundMatch){
				return false;
			}
		}

		return true;
	}

	function canHaveMultiples(name){
		let n = name.toUpperCase();
		if(n == "PLAINS" || n == "ISLAND" || n == "SWAMP" || n == "MOUNTAIN" || n == "FOREST" || n == "WASTES" || n == "SHADOWBORN APOSTLE" || n == "RELENTLESS RATS"){
			return true;
		}
		else{
			return false;
		}
	}

	function convertRawToArray(deckRaw){
		return deckRaw.match(/(\d+)(.*)/g);
	}

	function convertArrayToJS(deckArray){
		let deck = [];
		let regexp = /(\d+)(.*)/;
		for (let i = 0; i < deckArray.length; i++){
			let string = deckArray[i];
			let card = {};
			let match = regexp.exec(string);
			card["quantity"] = match[1].trim();
			card["name"] = match[2].trim();
			deck.push(card);
		}
		return deck;
	}

	return module;
};
