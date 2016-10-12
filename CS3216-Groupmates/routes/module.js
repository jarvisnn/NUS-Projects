var express = require('express');
var router = express.Router();
var request = require('request');

var userModel = require('../models/user').getModel();
var moduleModel = require('../models/module').getModel();
var helper = require('../helper');

router.get('/:id', function(req, res, next) {
  if (!helper.isLoggedIn(req.user)) {
    res.redirect('/');
  }
  moduleId = req.params.id;
  var classUrl = helper.getIvleClassRoasterUrl(req.user.ivleAccessToken, moduleId);
  request(classUrl, function (error, response, body) {
    if (response.statusCode == 401) {
      res.redirect('/ivleConnect');
    } else if (response.statusCode == 200) {
      var classRoster = JSON.parse(body).Results;
      userModel.findAll({
        where: {
          matricNumber: {
            $in: classRoster.map(function(student) {
              return student.UserID;
            })
          },
          fbId: {
            ne: null
          }
        }
      }).then(function(results) {
        var activeUsers = results;
        var activeUsersMatric = activeUsers.map(function(user) {
          return user.matricNumber;
        });
        classRoster = classRoster.filter(function(user) {
          return activeUsersMatric.indexOf(user.UserID) < 0;
        });

        moduleModel.findOne({
          where: {
            uuid: moduleId
          }
        }).then( function(module) {
          res.render('module', {
            module: module,
            activeUsers: activeUsers,
            classRoster: classRoster,
            currentUser: req.user
          });
        })
      })
    } else {
      throw error;
    }
  });
});

module.exports = router;
