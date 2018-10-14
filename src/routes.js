var router = require('express').Router();

//Default middleware for all requests
router.all('*', function(req, res, next){
  console.log(`Main route 'all' section.`);
  console.log('db', req.db);
  next();
});

//Handle Home GET requests
router.get('/', require('./controllers/root.js'));

module.exports = router;
