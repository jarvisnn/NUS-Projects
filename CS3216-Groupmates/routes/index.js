var express = require('express');
var router = express.Router();
var helper = require('../helper');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (helper.isLoggedIn(req.user)) {
    res.redirect('/user/profile');
  } else {
    res.render('index', { user: req.user });
  }
});

module.exports = router;
