var fs        = require('fs'),
    Character = require('../models/characters.model.js'),
    seedData  = require('../config/seed.data.js').data;





var loadSeedData = function(){
	console.log("reached load seed data");
	var character = {};

	Character.collection.insert(seedData.characters,function(err, docs) {
	    if (err) {
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
 * GET /character
 */
exports.characterGet = function(req, res) {
  console.log("reached characterGet");

};

/**
 * POST /character
 */
exports.characterUpdate = function(req, res) {

  console.log("reached characterUpdate");

};
