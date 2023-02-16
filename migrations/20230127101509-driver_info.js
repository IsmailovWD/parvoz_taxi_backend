'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('driver_info', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      driver_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'driver',
          key: 'id'
        }
      },
      img_car_front: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      img_car_back: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      img_car_left: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      img_car_right: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      tex_passport_front: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      tex_passport_back: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      talon_front: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      talon_back: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('driver_info');
  }
};
