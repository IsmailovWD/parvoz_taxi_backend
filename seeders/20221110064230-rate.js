'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('rate', [
      {
        name: 'Standart',
        min_summa: '5000',
        min_km: 3.5,
        wait_price: 400,
        free_wait_time: 3,
        out_price: 1500,
        city_price: 1000
      },
      {
        name: 'Komfort',
        min_summa: '8000',
        min_km: 3.5,
        wait_price: 400,
        free_wait_time: 3,
        out_price: 1500,
        city_price: 1000
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('rate', null, {});
  }
};
