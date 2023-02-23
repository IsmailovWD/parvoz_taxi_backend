const {
  Order,
  Rate,
  OrderStatus,
  Driver,
  CancelOrderDriver,
  SendOrderDriver,
  CompletedOrder,
  EmptyDriver,
  WaitingOrder,
  DriverStatus,
  Client
} = require("../models/init-models");
const BaseController = require("./BaseController");
const { Op } = require("sequelize");
const db = require("../db/db-sequelize");
const sequelize = require("sequelize");
const { QueryTypes } = require("sequelize");
var FCM = require("fcm-node");
var serverKey =
  "AAAAp-XDSiA:APA91bFg1rDmkOSKqRG3tkq2m52aBBp8A7DkVNC0eG6lYu91wqq-_PtAxxzTsJPqViDoJJCvufP1EsFONY2NuIVVCcza-s3ENCjp2dEIVDJpQB0PPMDuWPtLzQrkTBQvUMq59uFUy9pR";
var fcm = new FCM(serverKey);
/******************************************************************************
 *                              User Controller
 ******************************************************************************/
class UserController extends BaseController {
  io;
  socket;
  socketConnect = (io, socket) => {
    this.io = io;
    this.socket = socket;
  };
  all = async (req, res) => {
    console.log(req.query);
    let txt = "";
    if (req.query.value && req.query.value != "") {
      txt = "WHERE `Order`.`phone_number` LIKE '%" + req.query.value + "%'";
    }
    const model = await db.query(
      "SELECT\
    `Order`.`id`,\
    `Order`.`created_date`,\
    `Order`.`phone_number`,\
    `rate`.`name` AS `tarif`,\
    `user`.`firstname` AS `name`,\
    `status`.`name` AS `status`,\
    `status`.`id` AS `status_id`,\
    `status`.`name` AS `status_name`, \
    `Order`.`kashbek_add`,\
    `Order`.`kashbek_summa` \
    FROM\
        `order` AS `Order` \
    LEFT OUTER JOIN `rate` AS `rate`\
    ON \
        `Order`.`rate_id` = `rate`.`id` \
    LEFT OUTER JOIN `user` AS `user` \
    ON\
        `Order`.`user_id` = `user`.`id` \
    LEFT OUTER JOIN `order_status` AS `status` \
    ON \
    `Order`.`status_id` = `status`.`id` " +
      txt +
      "\
    Order by `Order`.`created_date` DESC LIMIT " +
      req.query.count +
      " , 20",
      { model: Order, raw: true, type: QueryTypes.SELECT }
    );
    res.send({
      success: true,
      message: "All Orders",
      data: model,
    });
  };
  create = async (req, res, send) => {
    let time = Math.floor(new Date().getTime() / 1000);
    const {
      phone_number,
      whence,
      whereto,
      rate_id,
      whence_name,
      whereto_name,
      kesh_value
    } = req.body;
    let client = await Client.findOne({
      where: {
        number: phone_number
      }
    })
    if (!client) {
      client = await Client.create({
        number: phone_number,
        keshbek_summa: 0
      })
    }
    const model = await Order.create({
      created_date: time,
      phone_number,
      whence,
      whereto,
      rate_id,
      whence_name,
      whereto_name,
      client_id: client.dataValues.id,
      user_id: req.currentUser.id,
      status_id: 6,
      kashbek_add: kesh_value ? 1 : 0,
      kashbek_summa: kesh_value ? client.dataValues.keshbek_summa : 0,
      rating: false,
    });
    for (let i = 0; i < model.length; i++) {
      model[i].created_date = new Date(
        model[i].created_date * 1000
      ).toDateString();
    }
    res.send({
      success: true,
      message: "Order created successfully",
    });
    await this.#emit_new_order(model.id)
    await this.#DriverSearch(whence, model.id, null);
    const sockets = await this.io.fetchSockets();
    for (const soc of sockets) {
      if (soc.dataUser.type == "User") {
        if (soc.dataUser.userId == req.currentUser.id) {
          return this.io.to(soc.id).emit("new_order_one");
        }
      }
    }
  };
  createClient = async (req, res, send) => {
    let time = Math.floor(new Date().getTime() / 1000);
    const { from, to, rate_id } = req.body;
    const model = await Order.create({
      created_date: time,
      phone_number: req.currentUser.number,
      whence: from,
      whereto: to == "" ? null : to,
      rate_id,
      status_id: 6,
      client_id: req.currentUser.id,
      rating: false,
    });
    res.send({
      success: true,
      message: "Order created successfully",
      data: model,
    });
    await this.#DriverSearch(from, model.id, model.client_id);
  };
  #emit_new_order = async (id) => {
    const model = await db.query(
      "SELECT\
    `Order`.`id`,\
    `Order`.`created_date`,\
    `Order`.`phone_number`,\
    `rate`.`name` AS `tarif`,\
    `user`.`firstname` AS `name`,\
    `status`.`name` AS `status`,\
    `status`.`id` AS `status_id`,\
    `status`.`name` AS `status_name`, \
    `Order`.`kashbek_add`,\
    `Order`.`kashbek_summa` \
    FROM\
        `order` AS `Order` \
    LEFT OUTER JOIN `rate` AS `rate`\
    ON \
        `Order`.`rate_id` = `rate`.`id` \
    LEFT OUTER JOIN `user` AS `user` \
    ON\
        `Order`.`user_id` = `user`.`id` \
    LEFT OUTER JOIN `order_status` AS `status` \
    ON \
    `Order`.`status_id` = `status`.`id` Where `Order`.`id` = " +
      id +
      "\
    Order by `Order`.`created_date` DESC LIMIT 1",
      { model: Order, raw: true, type: QueryTypes.SELECT }
    );
    console.log(model)
    const sockets = await this.io.fetchSockets();
    for (const soc of sockets) {
      if (soc.dataUser.type == "User") {
        this.io.emit("newOrder", model[0]);
      }
    }
  }
  cancelOrderCreate = async (req, res) => {
    const { id, comment } = req.body;
    let responseData = {};
    const model = await Order.findOne({
      where: { id },
    });
    if (!model) {
      responseData.success = false;
      responseData.message = "Order not found";
      responseData.data = {};
    } else {
      responseData.success = true;
      responseData.message = "Order canceled successfully";
      responseData.data = model;
      model.comment = comment;
      model.status_id = 5;
      await model.save();
      await this.socket.emit("updateOrderCancel", model);
    }
    if (model.driver_id) {
      const driver = await Driver.findOne({
        where: {
          id: model.driver_id,
        },
      });
      driver.driver_status = 1;
      await driver.save();
    }
    const sockets = await this.io.fetchSockets();
    for (const soc of sockets) {
      if (soc.dataUser.type == "Driver") {
        if (soc.dataUser.userId == model.driver_id) {
          this.io.to(soc.id).emit("cancel_client_order");
        }
      }
    }
    res.send(responseData);
  };
  one = async (req, res, next) => {
    const model = await Order.findOne({
      include: [{ model: Driver, as: "driver", required: false }],
      where: {
        client_id: req.currentUser.id,
        status_id: {
          [Op.notIn]: [5],
        },
        rating: 0,
      },
      order: [["created_date", "DESC"]],
    });
    if (!model) {
      res.send({
        success: true,
        error_code: 400,
        message: "Buyurtma topilmadi",
        data: model,
      });
    } else {
      const summa = await CompletedOrder.findOne({
        where: {
          order_id: model.dataValues.id,
        },
      });
      model.dataValues.total_info = summa;
      res.send({
        success: true,
        message: "Buyurtma",
        data: model,
      });
    }
  };
  // Send order one driver
  #DriverSearch = async (whence, id, client) => {
    let coords = whence.split(",");
    let lat = coords[0];
    let long = coords[1];
    let text = "";
    const modelsl = await Order.findOne({
      where: {
        id,
      },
    });
    if (modelsl.driver_id) {
      return;
    }
    const driver = await CancelOrderDriver.findAll({
      attributes: ["driver_id"],
      where: {
        order_id: id,
      },
    });
    const drivers = await SendOrderDriver.findAll({
      attributes: ["driver_id"],
      where: {
        order_id: id,
      },
    });
    if (driver.length != 0 || drivers.length != 0) {
      let driverId = "";
      if (driver.length != 0) {
        for (let i = 0; i < driver.length; i++) {
          driverId += driver[i].driver_id + ",";
        }
      }
      if (drivers.length != 0) {
        for (let i = 0; i < drivers.length; i++) {
          driverId += drivers[i].driver_id + ",";
        }
      }
      text =
        "`a`.`driver_id` NOT IN (" +
        driverId.slice(0, driverId.length - 1) +
        ") AND ";
      console.log(text);
    }
    let result = await db.query(
      "SELECT \
      `a`.`driver_id` AS `id`, \
      `b`.`distance` AS `KM`,\
      `a`.`datetime` AS `time`\
      FROM\
      `empty_driver` AS `a`\
      INNER JOIN(\
      SELECT\
      `empty_driver`.`driver_id`,\
      111.111 * DEGREES( \
              ACOS( \
                  LEAST(\
                      1.0,\
                      COS(RADIANS(`empty_driver`.`lat`)) * COS(RADIANS('" +
      lat +
      "')) * COS(\
                          RADIANS(\
                            `empty_driver`.`long` - '" +
      long +
      "'\
                          )\
                      ) + SIN(RADIANS(`empty_driver`.`lat`)) * SIN(RADIANS('" +
      lat +
      "'))\
                  )\
              )\
          ) AS `distance`\
      FROM\
          `empty_driver`\
      ) AS `b`\
      ON\
      `a`.`driver_id` = `b`.`driver_id`\
      WHERE\
        " +
      text +
      " `b`.`distance` BETWEEN 0 AND 10 \
      ORDER BY `a`.`datetime` LIMIT 1;",
      { model: Driver, raw: true, type: QueryTypes.SELECT }
    );
    console.log(result);
    const sockets = await this.io.fetchSockets();
    if (result.length != 0) {
      result = result[0];
      await EmptyDriver.destroy({ where: { driver_id: result.id } });
      const sendDriver = await Order.findOne({
        attributes: [
          "id",
          "phone_number",
          "whence",
          "whereto",
          "rate_id",
          "status_id",
          [sequelize.literal("status.name"), "status_name"],
        ],
        include: [
          { model: OrderStatus, as: "status", attributes: [] },
          {
            model: Driver,
            as: "driver",
            attributes: [
              "id",
              [
                sequelize.literal("`driver->status_driver`.`name`"),
                "status_name",
              ],
            ],
            include: {
              model: DriverStatus,
              as: "status_driver",
              attributes: [],
            },
          },
          { model: Rate, as: "rate" },
        ],
        where: {
          id,
        },
      });
      const driver = await Driver.findOne({
        where: {
          id: result.id,
        },
      });
      if (driver.dataValues.driver_status == 1) {
        await this.#Send_order_driver(sendDriver, result.id, 6);
      } else {
        await this.#Send_order_driver(sendDriver, result.id, 7);
      }
      for (const soc of sockets) {
        if (soc.dataUser.type == "Driver") {
          if (soc.dataUser.userId == result.id) {
            this.io.to(soc.id).emit("new_order_driver", sendDriver);
            setTimeout(async () => {
              await this.#SetTimeOutOrder(id, result.id);
            }, 60000);
            break;
          }
        }
      }
      await this.#NoticationsSend(driver.fcm_token, sendDriver);
    } else {
      console.log("driver_not_found");
      const models = await Order.findOne({
        where: {
          id,
        },
      });
      models.status_id = 1;
      await models.save();
      if (client) {
        setTimeout(async () => {
          const model = await Order.findOne({
            where: {
              id,
            },
          });
          if (!model.driver_id) {
            for (const soc of sockets) {
              if (soc.dataUser.type == "Client") {
                if (soc.dataUser.userId == client) {
                  this.io.to(soc.id).emit("driver_not_found");
                }
              }
            }
          }
        }, 30000);
      }
    }
  };
  // order send driver
  #Send_order_driver = async (order, driver, driver_status) => {
    const drivers = await Driver.findOne({
      id: driver,
    });
    drivers.driver_status = driver_status;
    await drivers.save();
    await SendOrderDriver.create({
      order_id: order.id,
      driver_id: driver,
      datetime: Math.floor(new Date().getTime() / 1000),
    });
    if (driver_status == 6) {
      await WaitingOrder.create({
        order_id: order.id,
        driver_id: driver,
        datetime: Math.floor(new Date().getTime() / 1000),
        type: 1,
      });
    }
  };

  DriverOrderCancel = async (req, res) => {
    const id = req.body.order_id;
    const cancel = await CancelOrderDriver.findOne({
      where: {
        order_id: id,
        driver_id: req.currentUser.id,
      },
    });
    if (cancel) {
      await res.send({
        success: true,
        message: "Order canceled",
        data: {},
      });
    } else {
      const drivers = await Driver.findOne({
        id: req.currentUser.id,
      });
      if (req.currentUser.driver_status == 6) {
        drivers.driver_status = 1;
      } else {
        drivers.driver_status = 4;
      }
      drivers.save();
      const model = await Order.findOne({
        where: {
          id,
        },
      });
      await CancelOrderDriver.create({
        order_id: id,
        driver_id: req.currentUser.id,
        datetime: Math.floor(new Date().getTime() / 1000),
      });
      await this.#DriverSearch(model.whence, id, model.client_id);
      await WaitingOrder.destroy({
        where: { driver_id: req.currentUser.id, order_id: id },
      });
      await res.send({
        success: true,
        message: "Order canceled",
        data: model,
      });
    }
  };
  /// Driver old orders
  OneDriverOrders = async (req, res, next) => {
    let filter = req.query.filter;
    let model = [];
    let time = Math.floor(new Date().getTime() / 1000);
    if (filter == "day") {
      model = await db.query(
        "SELECT\
      `a`.`id` AS 'id',\
      `a`.`whence` AS 'whence',\
      `a`.`whereto` AS 'whereto',\
      FROM_UNIXTIME(`a`.`closing_date`, '%Y-%m-%d') AS 'date_format',\
      `c`.`name` AS 'rate_name',\
      `b`.`summa` as `balance`\
  FROM\
      `order` AS `a`\
  INNER JOIN `completed_order` AS `b`\
  ON\
      `a`.`id` = `b`.`order_id`\
  INNER JOIN `rate` AS `c`\
  ON\
      `a`.`rate_id` = `c`.`id`\
  WHERE\
      `a`.`status_id` = 4 AND FROM_UNIXTIME(`a`.`closing_date`, '%Y-%m-%d') = FROM_UNIXTIME(" +
        time +
        ", '%Y-%m-%d');",
        { model: Order, raw: true, type: QueryTypes.SELECT }
      );
    } else if (filter == "week") {
      let son = 1;
      while (son < 8) {
        let lats = await db.query(
          "SELECT\
        `a`.`id` AS 'id',\
        `a`.`whence` AS 'whence',\
        `a`.`whereto` AS 'whereto',\
        FROM_UNIXTIME(`a`.`closing_date`, '%Y-%m-%d') AS 'date_format',\
        `c`.`name` AS 'rate_name',\
        `b`.`summa` as `balance`\
    FROM\
        `order` AS `a`\
    INNER JOIN `completed_order` AS `b`\
    ON\
        `a`.`id` = `b`.`order_id`\
    INNER JOIN `rate` AS `c`\
    ON\
        `a`.`rate_id` = `c`.`id`\
    WHERE\
        `a`.`status_id` = 4 AND FROM_UNIXTIME(`a`.`closing_date`, '%Y-%m-%d') = FROM_UNIXTIME(" +
          time +
          ", '%Y-%m-%d');",
          { model: Order, raw: true, type: QueryTypes.SELECT }
        );
        time -= 86400;
        for (let i = 0; i < lats.length; i++) {
          model.push(lats[i]);
        }
        son += 1;
      }
    } else if (filter == "month") {
      let son = 1;
      while (son < 30) {
        let lats = await db.query(
          "SELECT\
        `a`.`id` AS 'id',\
        `a`.`whence` AS 'whence',\
        `a`.`whereto` AS 'whereto',\
        FROM_UNIXTIME(`a`.`closing_date`, '%Y-%m-%d') AS 'date_format',\
        `c`.`name` AS 'rate_name',\
        `b`.`summa` as `balance`\
    FROM\
        `order` AS `a`\
    INNER JOIN `completed_order` AS `b`\
    ON\
        `a`.`id` = `b`.`order_id`\
    INNER JOIN `rate` AS `c`\
    ON\
        `a`.`rate_id` = `c`.`id`\
    WHERE\
        `a`.`status_id` = 4 AND FROM_UNIXTIME(`a`.`closing_date`, '%Y-%m-%d') = FROM_UNIXTIME(" +
          time +
          ", '%Y-%m-%d');",
          { model: Order, raw: true, type: QueryTypes.SELECT }
        );
        time -= 86400;
        for (let i = 0; i < lats.length; i++) {
          model.push(lats[i]);
        }
        son += 1;
      }
    }
    res.send({
      success: true,
      message: "Filter",
      data: model,
    });
  };
  // again order client

  againOrderClient = async (req, res) => {
    const id = req.query.order_id;
    const model = await Order.findOne({
      where: {
        id,
      },
    });
    if (model) {
      if (model.driver_id) {
        res.send({
          success: true,
          message: "Haydovchi tez orada keladi",
          data: model,
        });
      } else {
        await CancelOrderDriver.destroy({ where: { order_id: id } });
        await SendOrderDriver.destroy({ where: { order_id: id } });
        await this.#DriverSearch(model.whence, id, model.client_id);
        model.status_id = 6;
        await model.save();
        res.send({
          success: true,
          message: "Zakaz qayta yuborildi",
          data: model,
        });
      }
    } else {
      res.send({
        success: false,
        message: "order not found",
        data: {},
      });
    }
  };

  // settime out

  #SetTimeOutOrder = async (order, driver) => {
    const cancel = await CancelOrderDriver.findOne({
      where: {
        order_id: order,
        driver_id: driver,
      },
    });
    if (!cancel) {
      const model = await Order.findOne({
        where: {
          id: order,
        },
      });
      if (!model.driver_id) {
        const drivers = await Driver.findOne({
          where: {
            id: driver,
          },
        });
        drivers.driver_status = 1;
        drivers.save();
        await CancelOrderDriver.create({
          order_id: model.id,
          driver_id: drivers.id,
          datetime: Math.floor(new Date().getTime() / 1000),
        });
      }
      await this.#DriverSearch(model.whence, model.id, model.client_id);
      await WaitingOrder.destroy({
        where: { order_id: order, driver_id: driver },
      });
    }
  };

  // NOtification send

  #NoticationsSend = async (token, model) => {
    console.log(token, model);
    var message = {
      to: token,
      data: {
        title: "Yangi zakaz",
        body: model.id.toString(),
        type: "new_order",
        data: model,
      },
    };
    fcm.send(message, function (err, response) {
      if (err) {
        console.log("Something has gone wrong!" + err);
        console.log("Respponse:! " + response);
      } else {
        console.log("Successfully sent with response: ", response);
      }
    });
  };
  kashber_update = async (req, res) => {
    let id = req.params.id;
    let message;
    const model = await Order.findOne({ where: { id } });
    if (model.dataValues.status_id == 4 || model.dataValues.status_id == 5) {
      await res.send({
        success: false,
        message: 'Buyurtmada yakuniga yetdi'
      })
    } else {
      if (model.dataValues.kashbek_add == 0) {
        const client = await Client.findOne({ where: { id: model.dataValues.client_id } });
        model.kashbek_add = 1;
        model.kashbek_summa = client.keshbek_summa;
        message = 'Keshbek yoqildi'
        await model.save();
      } else {
        model.kashbek_add = 0;
        model.kashbek_summa = 0;
        message = 'Keshbek o\'chirildi'
        await model.save();
      }
      await res.send({
        success: true,
        message: message,
        data: model
      })
    }
  }
}

module.exports = new UserController();
