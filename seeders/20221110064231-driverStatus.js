"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "driver_status",
      [
        {
          name: "waiting",
        },
        {
          name: "accept",
        },
        {
          name: "arrival",
        },
        {
          name: "start",
        },
        {
          name: "complete",
        },
        {
          name: "isThinking",
        },
        {
          name: "double",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("driver_status", null, {});
  },
};
