var router = require('express').Router();

//Default middleware for all requests
router.all('*', function(req, res, next){
  console.log(`Root 'login' section.`)
  next();
});

//Handle Home GET requests
router.get('/', serveRoot);

function serveRoot(req, res, next){
  res.render('login');
}

module.exports = router;
