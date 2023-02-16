"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("agent_register", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      datetime: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      agent_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "agent",
          key: "id",
        },
      },
      summa: {
        type: Sequelize.FLOAT(11, 2),
        allowNull: false,
        defaultValue: 0,
      },
      type: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("agent_register");
  },
};
