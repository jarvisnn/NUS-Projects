var request = require('request');

var dbUser = require('../models/user');
var helper = require('../helper');

exports.createUserProfile = function(accessToken, profile, done) {
  // taken from app.js
  dbUser.getModel()
    .findOrCreate({
      where: {
        fbId: profile.id
      },
      defaults: {
        fbId: profile.id,
        name: profile.displayName,
        isRegistered: true,
      }
    })
    .then(function(result, created) {
      var user = result[0];
      user.fbAccessToken = accessToken;
      user.save().then(function () {
        return done(null, user);
      });
    });
}

exports.getOrCreateWithMatric = function(profile, callback) {
  dbUser.getModel().findOrCreate({
    where: {matricNumber: profile.matricNumber},
    defaults: {
      name: profile.name,
      matricNumber: profile.matricNumber,
      fbId: null,
      fbAccessToken: null,
      ivleAccessToken: null,
      isRegistered: false
    }
  }).then(callback);
}

exports.getUserByMatric = function(matricNumber, callback) {
  dbUser.getModel()
    .findOne({where: {matricNumber: matricNumber}})
    .then(callback);
}

exports.getUserInfoById = function(userId, callback) {
  dbUser.getModel()
    .findById(userId)
    .then(callback);
}

exports.linkToIvle = function(matricNumber, ivleToken, currentUserId, callback) {
  dbUser.getModel()
    .findById(currentUserId)
    .then(function(currentUser) {
      console.log(currentUser);
      dbUser.getModel()
        .findOne({
          where: {matricNumber: matricNumber}
        })
        .then(function(fakeUser) {
          if (fakeUser == null) {
            currentUser.matricNumber = matricNumber;
            currentUser.ivleAccessToken = ivleToken;
            currentUser.save().then(callback);
          } else {
            fakeUser.isRegistered = true;
            fakeUser.name = currentUser.name;
            fakeUser.fbId = currentUser.fbId;
            fakeUser.fbAccessToken = currentUser.fbAccessToken;
            fakeUser.ivleAccessToken = ivleToken;

            currentUser.destroy().then(function() {
              fakeUser.save().then(callback);
            });
          }
        });
    });
}

exports.getModules = function(user, callback) {
  var modulesUrl = helper.getIvleModulesUrl(user.ivleAccessToken);

  request(modulesUrl, function (error, response, body) {
    var responseBody = JSON.parse(body);

    // IVLE is fucking stupid, returns a 200 instead of 401 for unauthorized requests
    if (responseBody.Comments === 'Invalid login!') {
      callback(null, 401);
    } else if (!error) {
      var modules = responseBody.Results;
      callback(modules, 200);
    } else {
      throw error;
    }
  });
}

exports.deauthorizeFacebook = function(userId, callback) {
  dbUser.getModel().update({
    fbId: "",
    fbAccessToken: ""
  }, {
    where: { id: userId }
  }).then(callback);
}
