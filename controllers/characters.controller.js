var fs        = require('fs'),
    Character = require('../models/characters.model.js'),
    seedData  = require('../config/seed.data.js').data;

var loadSeedData = function(){
	console.log("reached load seed data");
	var character = {};

	Character.collection.insert(seedData.characters,function(err, docs) {
	    if (err) {1
	        // TODO: handle error
	    } else {
	        console.info('%d characters were successfully stored to mongodb from seedData.', docs.length);
	    
			fs.writeFile("config/firstload", "false", function(err) {
			    if(err) {
			        return console.log(err);
			    }
			    console.log("The file was saved!");
			}); 
	    }
	})

}
if (!fs.existsSync("config/firstload")) {
	console.log("application running for first time");
	loadSeedData();
}//



/**
 * Query /characters
 */
exports.allCharacters = function(req, res) {
  console.log("reached allCharacters");
  Character.find({},function(err,characters){
  	if(err){
  		console.log("err", err);
  	} else {
  		res.json({characters: characters})
  	}
  })
};

/**
 * GET /character
 */
exports.characterGet = function(req, res) {
  console.log("reached characterGet");

};

/**
 * SEARCH /character
 */
exports.characterSearch = function(req, res) {
  console.log("reached characterSearch");
  var field  = req.body.field;
  var query  = req.body.query;
  var filter = req.body.filter;

  var searchQ = {};
  switch(filter){
  	case 'contains':
  	    console.log("reached contains");
	  	searchQ[field] = new RegExp(query, 'i');
	    break;
	case 'equalTo':
	    console.log("reached equalTo");
		searchQ[field] = query;
	    break;
    case 'greaterThan':
	    console.log("reached greaterThan");
	    searchQ[field] = {$gt: parseFloat(query)};
	    break;
	case 'lessThan':
	    console.log("reached lessThan");
	    searchQ[field] = {$lt: parseFloat(query)};
	    break;
  }
  

  console.log(searchQ)
   
   Character.find(searchQ,function(err,characters){
		if(err){
			console.log("err", err);
		} else {
			res.json({characters: characters})
		}
   })
};

/**
 * POST /character
 */
exports.characterUpdate = function(req, res) {

  console.log("reached characterUpdate");

};
