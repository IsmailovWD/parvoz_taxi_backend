"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("empty_driver", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      driver_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "driver",
          key: "id",
        },
      },
      lat: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      long: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      datetime: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      closing_date: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("empty_driver");
  },
};
