'use strict';

// NOTE check against migration definitions
var Sequelize = require('sequelize');
var db = require('../helper').getDb();

var SCHEMAS = {
  'users': db.define('users', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    createdAt: {
      type: Sequelize.DATE
    },
    updatedAt: {
      type: Sequelize.DATE
    },
    name: Sequelize.STRING,
    matricNumber: Sequelize.STRING,
    fbId: Sequelize.STRING,
    fbAccessToken: Sequelize.STRING,
    ivleAccessToken: Sequelize.STRING,
    isRegistered: Sequelize.BOOLEAN,
    haveFetchedModules: Sequelize.BOOLEAN
  }),
  'reviews': db.define('reviews', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    idReviewee: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    idReviewer: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    createdAt: {
      type: Sequelize.DATE
    },
    updatedAt: {
      type: Sequelize.DATE
    },
    stars: Sequelize.FLOAT,
    description: Sequelize.TEXT('medium'),
    moduleCode: Sequelize.STRING,
    semester: Sequelize.STRING
  }),
  'modules': db.define('modules', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    uuid: {
      type: Sequelize.STRING,
      allowNull: false
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    code: {
      type: Sequelize.STRING
    },
    title: {
      type: Sequelize.STRING
    },
    createdAt: {
      type: Sequelize.DATE
    },
    updatedAt: {
      type: Sequelize.DATE
    }
  })
};

// associations
// review -> users: idReviewer, idReviewee
SCHEMAS['reviews'].belongsTo(SCHEMAS['users'], {foreignKey: 'idReviewer', as: 'reviewer'});
SCHEMAS['reviews'].belongsTo(SCHEMAS['users'], {foreignKey: 'idReviewee', as: 'reviewee'});
SCHEMAS['users'].hasMany(SCHEMAS['reviews'], {foreignKey: 'idReviewee', as: 'reviewsOf'});
SCHEMAS['users'].hasMany(SCHEMAS['reviews'], {foreignKey: 'idReviewer', as: 'reviewsBy'});
SCHEMAS['users'].hasMany(SCHEMAS['modules'], {foreignKey: 'userId'});

module.exports = {
  getSchema: function (schema) {
    return SCHEMAS[schema];
  }
};
