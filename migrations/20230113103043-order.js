'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('order', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      created_date: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      phone_number: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      whence: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      whereto: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      whence_name: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      whereto_name: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      summa: {
        type: Sequelize.DECIMAL(17, 3),
        allowNull: true,
      },
      client_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'client',
          key: 'id'
        },
      },
      rate_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'rate',
          key: 'id'
        },
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'user',
          key: 'id'
        },
      },
      status_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'order_status',
          key: 'id'
        },
      },
      closing_date: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      driver_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'driver',
          key: 'id'
        }
      },
      comment: {
        type: Sequelize.STRING(250),
        allowNull: true,
      },
      rating: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: false
      },
      kashbek_add: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      kashbek_summa: {
        type: Sequelize.DOUBLE(17, 3),
        allowNull: false,
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('order');
  }
};
