var Sequelize = require('sequelize');

var helper = require('../helper');
var db = helper.getDb();

var userModel = require('../db_util/schemas').getSchema('users');

exports.getModel = function() {
  return userModel;
}
