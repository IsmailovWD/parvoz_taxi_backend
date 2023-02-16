"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("driver", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      fullname: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      number: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      car: {
        type: Sequelize.STRING(250),
        allowNull: true,
      },
      driver_status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "driver_status",
          key: "id",
        },
      },
      deleted_at: {
        type: Sequelize.INTEGER,
        default: 0,
        allowNull: false,
      },
      created_date: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      active: {
        type: Sequelize.INTEGER,
        default: 0,
        allowNull: false,
      },
      fcm_token: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      active_admin: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 0,
      },
      menejer_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "agent",
          key: "id",
        },
      },
      summa: {
        type: Sequelize.DOUBLE(11, 2),
        allowNull: false,
        defaultValue: 0,
      },
      day_price: {
        type: Sequelize.DOUBLE(11, 2),
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("driver");
  },
};
