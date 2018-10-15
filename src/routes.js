var router = require('express').Router();

//Default middleware for all requests
router.all('*', function(req, res, next){
  console.log(`Main route 'all' section.`);
  //console.log('REQ:', Object.keys(req));
  next();
});

//Handle Home GET requests
router.use('/', require('./controllers/root.js'));
router.use('/profile', require('./controllers/profile.js'));
router.use('/login', require('./controllers/login.js'));
router.use('/signup', require('./controllers/signup.js'));

module.exports = router;
