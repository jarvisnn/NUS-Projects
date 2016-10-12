var express = require('express');
var router = express.Router();
var helper = require('../helper');
var userModel = require('../models/user').getModel();
var reviewModel = require('../models/review').getModel();
var moduleModel = require('../models/module').getModel();
var Sequelize = require('sequelize');
var userUtil = require('../db_util/user');

router.get('/profile', function(req, res, next) {
  if (helper.isLoggedIn(req.user)) {
    res.redirect('/user/' +  req.user.id);
  } else {
    res.redirect('/');
  }
});

router.get('/refreshModules', function(req, res, next) {
  if (!helper.isLoggedIn(req.user)) {
    res.redirect('/');
    return;
  }

  userUtil.getModules(req.user, function(modules, statusCode) {
    if (statusCode === 401) {
      res.redirect('/user/profile')
    }
    userModel.update({
        haveFetchedModules: true
      }, {
        where: {
          id: req.user.id
        }
    }).then(function() {
      if (modules == null) {
        modules = [];
      }

      var dbModels = modules.map(function(module) {
        return({
          uuid: module.ID,
          code: module.CourseCode,
          title: module.CourseName,
          userId: req.user.id
        });
      });

      // TODO: do this in an idiomatic way with associations
      moduleModel.destroy({
        where: {
          userId: req.user.id
        }
      }).then(function() {
        moduleModel.bulkCreate(dbModels).then(function() {
          res.redirect('/user/profile');
        });
      });
    });
  });
});

router.get('/:id', function(req, res, next) {
  if (!helper.isLoggedIn(req.user)) {
    res.redirect('/');
    return;
  }
  var userId = Number.parseInt(req.params.id);

  userModel.findById(userId, {
    include: [
      {
        model: moduleModel,
        required: false
      }
    ]
  }).then(function(user) {
    if (user == null) {
      res.redirect('/');
    }
    if (user.modules.length > 0 && user.id == req.user.id) {
      req.user.modules = user.modules;
    }

    if (user.haveFetchedModules ||
      req.user.id !== userId ||
      !user.ivleAccessToken
    ) {
      res.render('profile', {
        user: user,
        currentUser: req.user,
        reviewUrl: helper.getRoot() + '/reviews/'
      });
    } else if(req.user.id === userId &&
        user.ivleAccessToken &&
        !user.haveFetchedModules
      ) {
      res.redirect('/user/refreshModules');
    }
  });
});

router.get('/matric/:matricNumber/:name', function(req, res, next) {
  if (!helper.isLoggedIn(req.user)) {
    res.redirect('/');
    return;
  }

  userUtil.getUserByMatric(req.params.matricNumber, function(user) {
    if (user == null) {
      res.render('profile', {
        user: {
          id: req.params.matricNumber,
          name: req.params.name,
          matricNumber: req.params.matricNumber
        },
        currentUser: req.user
      });
    } else {
      res.redirect('/user/' + user.id);
    }
  })
});

module.exports = router;
