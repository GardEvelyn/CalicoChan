module.exports = function (args) {
    var module = {};
    var client = args.client;
    module.getColorReport = function(set){
        return sortByColor(set);
    };
    module.getAdversaries = function(query){
        return _findAdversaries(query);
    }

    function _findAdversaries(query){
        return client.db.collection('adversaries').find({'name' : new RegExp(query, 'i')}).toArray();
    }

    function sortByColor(set){
        let searches = [];
        if(set){
            searches.push(client.db.collection('adversaries').find({'set' : set.toUpperCase()}).toArray());
        }
        else{
            searches.push(client.db.collection('adversaries').find().toArray());
        }

        return Promise.all(searches).then(matches => {
            let report = {};
            matches[0].forEach(adversary => {
                let colors_a = adversary.colorIdentity;
                let identity = colors_a.sort().join();

                if(!report.hasOwnProperty(identity)){
                    report[identity] = [];
                }
                report[identity].push(adversary.name);
            });
            return report;
        })
    }
    return module;
};
