'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('user', [
      {
        firstname: "Dastruchi",
        lastname: "Developer",
        phone_number: '+998916544327',
        password: "$2a$08$sJjS/l.Mfz/jcSfEDRivQOrBx0qJ5lezAy1dE.eLN351BSg68lPmq",
        deleted_at: 0,
        role: "dasturchi",
      },
      {
        firstname: "Admin",
        lastname: "Admin",
        phone_number: '+998111111111',
        password: "$2a$08$sJjS/l.Mfz/jcSfEDRivQOrBx0qJ5lezAy1dE.eLN351BSg68lPmq",
        deleted_at: 0,
        role: "Admin",
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user', null, {});
  }
};
