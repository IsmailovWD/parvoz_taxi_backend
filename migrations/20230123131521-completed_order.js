'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('completed_order', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'order',
          key: 'id'
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
      summa: {
        type: Sequelize.DECIMAL(17, 3),
        allowNull: false,
      },
      km_out_city: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      km: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      wait_time: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      datetime: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      firma_summa: {
        type: Sequelize.DOUBLE(11, 2),
        allowNull: false,
        defaultValue: 0
      },
      agent_summa: {
        type: Sequelize.DOUBLE(11, 2),
        allowNull: false,
        defaultValue: 0
      },
      kesh_back_summa: {
        type: Sequelize.DOUBLE(11, 2),
        allowNull: false,
        defaultValue: 0
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('completed_order');
  }
};
