let cron = require("node-cron");
const { Op } = require("sequelize");
const { Order, EmptyDriver } = require("../models/init-models");
module.exports = async function () {
  cron.schedule("*/5 * * * *", async () => {
    const model = await Order.findAll({
      where: {
        status_id: [1],
      },
    });
    for (let i = 0; i < model.length; i++) {
      if (
        Math.floor(new Date().getTime() / 1000) - model[i].created_date >
        300
      ) {
        model[i].status_id = 5;
        await model[i].save();
      }
    }
  });
  cron.schedule("*/5 * * * *", async () => {
    const model = await EmptyDriver.findAll();
    for (let i = 0; i < model.length; i++) {
      if (
        Math.floor(new Date().getTime() / 1000) - model[i].closing_date >
        300
      ) {
        await EmptyDriver.destroy({
          where: {
            id: model[i].id,
          },
        });
      }
    }
  });
};
