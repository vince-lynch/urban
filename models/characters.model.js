var mongoose = require('mongoose');


var characterSchema = new mongoose.Schema({
  name      : String,
  height    : Number,
  mass      : Number,
  hair_color: String,
  skin_color: String,
  eye_color : String,
  birth_year: String,
  is_male   : Boolean,
  image     : String
});



var Character = mongoose.model('Character', characterSchema);

module.exports = Character;
