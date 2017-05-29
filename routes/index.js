  var
  express              = require('express'),
  router               = express.Router();

var Character = require('../models/characters.model.js'),
    characterController = require('../controllers/characters.controller.js');


router.post('/character/:id', characterController.characterGet);
router.get('/character/:id', characterController.characterUpdate);



module.exports = router;