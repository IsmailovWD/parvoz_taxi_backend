'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('client', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      password: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      number: {
        type: Sequelize.STRING(),
        allowNull: false,
        unique: true
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('client');
  }
};
