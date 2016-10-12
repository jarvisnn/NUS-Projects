'use strict';

var Sequelize = require('sequelize');
var helper = require('../helper');

var User = helper.getDatabase().define('User', {
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  imgUrl: {
    type: Sequelize.STRING
  },
  basicAuth: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  fullName: {
    type: Sequelize.STRING,
  },
  point: {
    type: Sequelize.INTEGER,
    defaultValue: 20
  },
  phoneNumber: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, {
  classMethods: {
    associate: function(models) {
      // associations can be defined here
      User.hasMany(models.Product);
      User.hasMany(models.Activity);
    }
  }
});


// All access to Users described here.
exports.createUser = function(data, callback, callError) {
  if (data.password && data.password != '') {
    data.basicAuth = helper.getBasicAuth(data.username, data.password);
    data.password = helper.hashPassword(data.password);
  }
  if (data.username == "") data.username = null;
  if (data.password == "") data.password = null;
  if (data.email == "") data.email = null;
  if (data.phoneNumber == "") data.phoneNumber = null;  

  User.create(data)
    .then(callback)
    .catch(callError);
}

exports.getAllUser = function(callback, callError) {
  User.all({attributes: ['id', 'username', 'fullName']})
    .then(callback)
    .catch(callError);
}

exports.getUserById = function(userId, callback, callError) {
  User.findById(userId)
    .then(callback)
    .catch(callError);
}

exports.updateUser = function(userId, data, callback, callError) {
  User.findById(userId)
    .then(function(user) {
      if (user == null) {
        callback;
      } else {
        if (data.image != null) {
          data.imgUrl = 'images/' + helper.saveImage('user-' + user.id, data.image);
        }
        user.updateAttributes(data, {fields: ['email', 'fullName', 'point', 'phoneNumber', 'imgUrl']})
          .then(callback);
      }
    })
    .catch(callError);
}

exports.getToken = function(username, password, callback, callError) {
  User.findOne({where: {username: username}})
    .then(callback)
    .catch(callError);
}

