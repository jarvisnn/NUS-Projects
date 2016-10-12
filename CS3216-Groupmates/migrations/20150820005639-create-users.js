'use strict';

module.exports = {
  up: function (queryInterface, DataTypes) {
    return queryInterface.createTable(
      'users',
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        createdAt: {
          type: DataTypes.DATE
        },
        updatedAt: {
          type: DataTypes.DATE
        },
        name: DataTypes.STRING,
        matricNumber: DataTypes.STRING,
        fbId: DataTypes.STRING,
        fbAccessToken: DataTypes.STRING,
        ivleAccessToken: DataTypes.STRING
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
    return queryInterface.dropTable('users');
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
