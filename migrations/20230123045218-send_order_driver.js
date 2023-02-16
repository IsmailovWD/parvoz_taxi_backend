'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('send_order_driver', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'order',
          key: 'id',
        }
      },
      driver_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'driver',
          key: 'id'
        }
      },
      datetime: {
        type: Sequelize.INTEGER,
        allowNull: false,
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('send_order_driver');
  }
};
