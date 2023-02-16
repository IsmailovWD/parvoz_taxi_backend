'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('rate', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      min_summa: {
        type: Sequelize.DECIMAL(17, 3),
        allowNull: false,
      },
      min_km: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      wait_price: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      free_wait_time: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      out_price: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      city_price: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      profit: {
        type: Sequelize.DOUBLE(11,2),
        allowNull: false,
        defaultValue: 0
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('rate');
  }
};
