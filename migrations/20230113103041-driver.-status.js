'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('driver_status', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: true,
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('driver_status');
  }
};
