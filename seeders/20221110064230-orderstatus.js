"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "order_status",
      [
        {
          name: "Yangi",
        },
        {
          name: "Qabul qilindi",
        },
        {
          name: "Yo'lda",
        },
        {
          name: "Tugallangan",
        },
        {
          name: "Bekor qilingan",
        },
        {
          name: "Yangi",
        },
        {
          name: "Kutmoqda",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("order_status", null, {});
  },
};
