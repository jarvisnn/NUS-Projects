var express = require('express');
var router = express.Router();
var helper = require('../helper');
var User = require('../models/user');
var Product = require('../models/product');

router.get('/', function(req, res) {
  User.getToken(req.query.username, req.query.password,
    function(user) {
      if (user == null) {
        res.status(400).json({message: 'User does not exist!'});
      } else if (helper.hashPassword(req.query.password) != user.password) {
        res.status(400).json({message: 'Password is wrong!'});
      } else {
        res.json(user);
      }
    },function(error) {
      res.status(400).json(error);
    }
  );
});

module.exports = router;
