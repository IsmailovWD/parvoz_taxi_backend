"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("agent", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      fullname: {
        type: Sequelize.STRING(250),
        allowNull: false,
      },
      phone_number: {
        type: Sequelize.STRING(250),
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(250),
        allowNull: false,
      },
      summa: {
        type: Sequelize.DOUBLE(11, 2),
        allowNull: false,
      },
      percentage: {
        type: Sequelize.DOUBLE(11, 2),
        allowNull: false,
      },
      deleted_at: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("agent");
  },
};
