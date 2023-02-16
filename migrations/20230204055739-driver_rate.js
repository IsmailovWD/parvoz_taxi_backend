'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('rate_driver', { 
      id: {
        type: Sequelize.INTEGER, 
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      driver_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'driver',
          key: 'id'
        }
      },
      rate_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'rate',
          key: 'id'
        }
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('rate_driver');
  }
};
