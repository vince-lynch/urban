  var
  express              = require('express'),
  router               = express.Router();

var Character           = require('../models/characters.model.js'),
    characterController = require('../controllers/characters.controller.js'),
    userController      = require('../controllers/users.controller.js');


router.use(function(req, res, next) {
  req.isAuthenticated = function() {
    var token = (req.headers.authorization && req.headers.authorization.split(' ')[1]) || req.cookies.token;
    try {
      return jwt.verify(token, "somesecret124389");
    } catch (err) {
      return false;
    }
  };

  if (req.isAuthenticated()) {
    var payload = req.isAuthenticated();
    User.findById(payload.sub, function(err, user) {
      req.user = user;
      next();
    });
  } else {
    next();
  }
});

router.post('/api/character/:id', characterController.characterGet);
router.get('/api/character/:id', characterController.characterUpdate);
router.get('/api/characters', characterController.allCharacters)
router.post('/api/characterSearch', characterController.characterSearch)


router.post('/signup', userController.signupPost);
router.post('/login', userController.loginPost);
router.post('/account', userController.accountPut);

module.exports = router;