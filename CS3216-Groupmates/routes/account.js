var express = require('express');
var helper = require('../helper');
var passport = require('passport');
var request = require('request');
var router = express.Router();
var YAML = require('yamljs');

var config = YAML.load('config.yml');
var dbUser = require('../models/user');

var dbUtilUser = require('../db_util/user');

router.get('/login', passport.authenticate('facebook', { scope: 'user_friends' }));

router.get('/login/callback',
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/login',
  })
);

router.get('/deauth', function(req, res) {
    if (!helper.isLoggedIn(req.user)) {
      res.redirect('/');
    }
    dbUtilUser.deauthorizeFacebook(req.user.id, function() {
      res.redirect('/');
    });
  }
);

router.get('/ivleConnect', function(req, res) {
  res.redirect(
    'https://ivle.nus.edu.sg/api/login/?apikey=' + config['ivle']['lapi_key']
    + '&url=' + helper.getRoot() + '/account/ivleConnect/callback'
  );
});

router.get('/ivleConnect/callback', function(req, res) {
  var token = req.query.token;
  var profileUrl = helper.getIvleApiUrl('Profile_View', token);

  request(profileUrl, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var matricNumber = JSON.parse(body)["Results"][0]["UserID"];

      dbUtilUser.linkToIvle(matricNumber, token, req.user.id, function(user) {
        req.logIn(user, function(error) {
            if (!error) {
              console.log("New user: " + req.user);
            }
        });
        res.redirect('/user/profile');
      });

    }
  });
});

router.get('/logout', function(req, res) {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
