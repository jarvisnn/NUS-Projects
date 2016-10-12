var Sequelize = require('sequelize');

var helper = require('../helper');
var db = helper.getDb();

var reviewModel = require('../db_util/schemas').getSchema('reviews');

exports.getModel = function() {
  return reviewModel;
}
