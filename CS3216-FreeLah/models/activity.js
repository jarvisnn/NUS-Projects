var Sequelize = require('sequelize');
var helper = require('../helper');

var Activity = helper.getDatabase().define('Activity', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  message: {
    allowNull: false,
    type: Sequelize.STRING
  },
  title: {
    type: Sequelize.STRING
  },
  productId: {
    allowNull: false,
    type: Sequelize.INTEGER
  },
  userId: {
    allowNull: false,
    type: Sequelize.INTEGER
  },
  createdAt: {
    type: Sequelize.DATE
  },
  updatedAt: {
    type: Sequelize.DATE
  }
}, {
  classMethods: {
    associate: function(models) {
      // associations can be defined here
      Activity.belongsTo(models.User, {foreignKey: 'userId'});
    }
  }
});


// All access to Activities described here.

exports.getAllActivitiesFromUser = function(userId, callback, callError) {
  console.log(userId);
  Activity.findAll({where: {userId: userId}})
    .then(callback)
    .catch(callError);
}

exports.create = function(title, message, userId, prodId) {
  var bod = {title: title, message: message, userId: userId, productId: prodId};
  Activity.create(bod)
    .then(function(activity) {console.log('New activity created ' + bod);})
    .catch(function(err) {console.log(err);});
}

exports.create = function(title, message, userId, prodId, callback) {
  var bod = {title: title, message: message, userId: userId, productId: prodId};
  Activity.create(bod)
    .then(function(activity) {console.log('New activity created ' + bod); callback();})
    .catch(function(err) {console.log(err);});
}

