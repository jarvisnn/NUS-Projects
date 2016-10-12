var Sequelize = require('sequelize');

var helper = require('../helper');
var db = helper.getDb();

var moduleModel = require('../db_util/schemas').getSchema('modules');

exports.getModel = function() {
  return moduleModel;
}