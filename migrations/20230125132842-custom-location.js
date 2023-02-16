'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('custom_location', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      lat: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      long: {
        type: Sequelize.STRING(50),
        allowNull: false,
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('custom_location');
  }
};
