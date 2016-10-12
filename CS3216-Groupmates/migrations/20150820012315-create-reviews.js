'use strict';

module.exports = {
  up: function (queryInterface, DataTypes) {
    return queryInterface.createTable(
      'reviews',
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        idReviewee: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        idReviewer: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        createdAt: {
          type: DataTypes.DATE
        },
        updatedAt: {
          type: DataTypes.DATE
        },
        stars: DataTypes.FLOAT,
        description: DataTypes.TEXT('medium'),
        moduleCode: DataTypes.STRING,
        semester: DataTypes.STRING
      }
    );
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: function (queryInterface, DataTypes) {
    return queryInterface.dropTable('reviews');
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
