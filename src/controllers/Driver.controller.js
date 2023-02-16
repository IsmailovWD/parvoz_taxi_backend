const {
  Driver,
  Order,
  DriverRating,
  OrderStatus,
  Rate,
  DriverStatus,
  CompletedOrder,
  User,
  CancelOrderDriver,
  DriverInfo,
  RateDriver,
  EmptyDriver,
  WaitingOrder,
  Agent,
  AgentRegister,
  DayPriceDriver,
} = require("../models/init-models");
const HttpException = require("../utils/HttpException.utils");
const cron = require("node-cron");
const jwt = require("jsonwebtoken");
const { secret_jwt } = require("../startup/config");
const BaseController = require("./BaseController");
const sequelize = require("sequelize");
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
    let query = {};
    if (req.query.filter) {
      query = {
        [sequelize.Op.or]: [
          {
            fullname: {
              [sequelize.Op.substring]: req.query.filter,
            },
          },
          {
            number: {
              [sequelize.Op.substring]: req.query.filter,
            },
          },
        ],
      };
    }
    if (req.query.actives) {
      query.active_admin = req.query.actives;
    }
    const model = await Driver.findAll({
      include: [
        {
          model: Agent,
          as: "menejer",
          required: false,
          attributes: ["fullname"],
        },
      ],
      where: query,
      offset: parseInt(req.query.pagination_size),
      limit: 10,
      subQuery: true,
    });
    const count = await Driver.findOne({
      attributes: [[sequelize.fn("COUNT", sequelize.col("id")), "soni"]],
      where: query,
    });
    res.send({
      success: true,
      message: "Driver has been successfully",
      data: {
        model,
        count,
      },
    });
  };
  getUser = async (req, res, send) => {
    let play_status;
    const model = await Driver.findOne({
      where: {
        id: req.currentUser.id,
      },
    });
    const price = await DayPriceDriver.findOne({
      where: {
        driver_id: req.currentUser.id,
      },
      order: [["datetime", "DESC"]],
    });
    if (price) {
      if (
        Math.floor(new Date().getTime() / 1000) - parseInt(price.datetime) >
        86400
      ) {
        play_status = 0;
      } else {
        play_status = 1;
      }
    } else {
      play_status = 0;
    }
    model.fcm_token = req.query.fcm_token;
    await model.save();
    model.dataValues.play_status = play_status;
    res.send({
      success: true,
      message: "Driver information",
      data: model,
    });
  };

  one = async (req, res, send) => {
    const model = await Driver.findOne({
      include: [
        {
          model: RateDriver,
          as: "rate_drivers",
          attributes: [
            "id",
            "driver_id",
            "rate_id",
            // [sequelize.literal('`rate`.`name`'), 'rate_name']
          ],
          include: { model: Rate, as: "rate" },
        },
      ],
      where: {
        id: req.params.id,
      },
    });
    res.send({
      success: true,
      message: "One User",
      data: model,
    });
  };

  create = async (req, res) => {
    const { fullname, number, car, password, day_price } = req.body;
    const model = await Driver.create({
      fullname,
      number,
      car,
      active: 0,
      driver_status: 1,
      menejer_id: null,
      password: password,
      day_price,
    });
    res.send({
      success: true,
      message: "Driver created successfully",
      data: model,
    });
  };

  singn = async (req, res, send) => {
    let { phone, code } = req.body;
    const model = await Driver.findOne({
      where: {
        number: phone,
        password: code,
      },
    });
    if (!model) {
      return res.send({
        success: false,
        message: "Siz ro'yhatda mavjud emassiz",
        data: {},
      });
    }
    const token = jwt.sign({ user_id: model.id.toString() }, secret_jwt, {});
    model.token = token;
    res.send({
      success: true,
      message: "Driver sign successfully",
      data: model,
    });
  };

  update = async (req, res, next) => {
    let success = true;
    let message = "";
    let data = null;
    const { name, car, rate } = req.body;
    const model = await Driver.findOne({
      where: {
        id: req.currentUser.id,
      },
    });
    if (!model) {
      success = false;
      message = "Tizimda siz haqingizdagi ma'lumotlar topilmadi";
      data = {};
    }
    if (name) {
      model.fullname = name;
    }
    if (car) {
      model.car = car;
    }
    if (rate) {
      let arr = rate.split(",");
      for (let i = 0; i < arr.length; i++) {
        await RateDriver.create({
          driver_id: req.currentUser.id,
          rate_id: parseInt(arr[i]),
        });
      }
    }
    model.save();
    res.send({
      success: success,
      message: message,
      data: data || model,
    });
  };

  login = async (req, res, next) => {
    this.checkValidation(req);
    const phone = req.query.phone;
    let data = {};
    if (!phone) {
      data.success = false;
      data.message = "Please enter a phone number ";
      data.data = {};
    } else {
      const user = await Driver.findOne({
        where: {
          number: phone,
        },
      });
      if (!user) {
        const dvd = await Driver.create({
          number: phone,
          driver_status: 1,
          created_date: Math.floor(new Date().getTime() / 1000),
          active: 0,
        });
        data.success = true;
        data.message = "Driver created successfully";
        data.data = false;
      } else {
        data.success = true;
        data.message = "Driver login";
        data.data = true;
      }
    }
    res.send(data);
  };

  active_driver = async (req, res) => {
    const model = await Driver.findOne({
      where: {
        id: req.currentUser.id,
      },
    });
    console.log(model);
    if (model.active == 0) {
      if (req.currentUser.active_admin == 0) {
        res.send({
          success: false,
          message: "Siz admin tomonidan faollashtirilmagansiz",
          data: {},
        });
      } else {
        if (req.currentUser.summa < 999) {
          res.send({
            success: false,
            errorcode: 2,
            message: "Balansingiz yetarli emas",
            data: model,
          });
        } else {
          model.active = 1;
          model.status_id = 1;
          model.free_time = Math.floor(new Date().getTime() / 1000);
          model.save();
          res.send({
            success: true,
            message: "Ish kuningiz boshlandi",
            data: model,
          });
        }
      }
    } else if (model.active == 1) {
      if (model.driver_status != 1) {
        res.send({
          success: false,
          message: "Sizda buyurtma mavjud",
          data: {},
        });
      } else {
        model.active = 0;
        model.status_id = 1;
        model.free_time = Math.floor(new Date().getTime() / 1000);
        await model.save();
        await EmptyDriver.destroy({ where: { driver_id: model.id } });
        res.send({
          success: true,
          message: "Ish kuningiz yakunlandi",
          data: model,
        });
      }
    }
  };

  setLocation = async (req, res) => {
    const model = await EmptyDriver.findOne({
      where: {
        driver_id: req.currentUser.id,
      },
    });
    if (model) {
      model.lat = req.body.lat.toString();
      model.long = req.body.long.toString();
      model.closing_date = Math.floor(new Date().getTime() / 1000);
      model.save();
    } else {
      if (req.currentUser.active == 1 && req.currentUser.active_admin == 1) {
        if (
          req.currentUser.driver_status == 1 ||
          req.currentUser.driver_status == 6
        ) {
          await EmptyDriver.create({
            driver_id: req.currentUser.id,
            lat: req.body.lat.toString(),
            long: req.body.long.toString(),
            datetime: Math.floor(new Date().getTime() / 1000),
            closing_date: Math.floor(new Date().getTime() / 1000),
          });
        }
      }
    }
    res.send({
      success: true,
      message: "Updated your location",
      data: {},
    });
  };

  ////// Driver rating

  ratingCreate = async (req, res) => {
    const { order_id, rating, comment } = req.body;
    const model = await Order.findOne({
      where: {
        id: order_id,
      },
    });
    if (!model) {
      throw new HttpException(404, "Order not found");
    }
    model.rating = 1;
    model.save();
    const ratings = await DriverRating.create({
      order_id,
      driver_id: model.driver_id,
      rating,
      comment,
    });
    res.send({
      success: true,
      message: "Rating added successfully",
      data: ratings,
    });
  };

  /// Driver order

  OrderAll = async (req, res, next) => {
    const driver = await EmptyDriver.findOne({
      where: {
        driver_id: req.currentUser.id,
      },
    });
    console.log(driver);
    let model;
    let arr = [];
    if (driver) {
      model = await Order.findAll({
        attributes: [
          "id",
          "phone_number",
          "whence",
          "whereto",
          "created_date",
          "rate_id",
          "status_id",
          [sequelize.literal("status.name"), "status_name"],
          [
            sequelize.literal(
              "111.111 *\
          DEGREES(ACOS(LEAST(1.0, COS(RADIANS(SUBSTRING_INDEX(`whence`,',', 1)))\
              * COS(RADIANS(" +
                driver.lat +
                "))\
              * COS(RADIANS(" +
                driver.long +
                " - SUBSTRING_INDEX(`whence`,',', -1)))\
              + SIN(RADIANS(SUBSTRING_INDEX(`whence`,',', 1)))\
              * SIN(RADIANS(" +
                driver.lat +
                " )))))"
            ),
            "distance",
          ],
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
          status_id: 1,
        },
      });
      console.log(model);
      for (let i = 0; i < model.length; i++) {
        if (model[i].dataValues.distance <= 10) {
          arr.push(model[i]);
        }
        model[i].created_date = new Date(
          model[i].created_date * 1000
        ).toDateString();
      }
    } else {
      model = [];
    }

    model = arr;
    res.send({
      success: true,
      message: "Orders for one driver",
      data: model,
    });
  };

  // Zakazni driver berish

  select_driver_order = async (req, res) => {
    const { id } = req.body;
    const cancel = await CancelOrderDriver.findOne({
      where: {
        order_id: id,
        driver_id: req.currentUser.id,
      },
    });
    const model = await Order.findOne({
      where: {
        id,
      },
    });
    if (model.status_id == 6 && cancel) {
      return res.send({
        success: false,
        message: "Vaqt tugadi",
        data: {},
      });
    }
    if (req.currentUser.active_admin == 0) {
      return res.send({
        success: false,
        message: "Siz admin tomondan foallashtirilmagansiz",
      });
    }
    if (req.currentUser.summa < 999) {
      return res.send({
        success: false,
        message: "Balansingiz yetarli emas",
        data: {},
      });
    }
    if (req.currentUser.active != 1) {
      return res.send({
        success: false,
        message: "Siz liniyada emassiz",
        data: {},
      });
    }
    if (!id) {
      return res.send({
        success: false,
        message: "Id is required",
      });
    }
    if (!model) {
      return res.send({
        success: false,
        message: "Order not found",
        data: {},
      });
    }
    if (!model.driver_id && (model.status_id == 1 || model.status_id == 6)) {
      const drivers = await Driver.findOne({
        where: {
          id: req.currentUser.id,
        },
      });
      if (drivers.driver_status == 1 || drivers.driver_status == 6) {
        model.status_id = 2;
        model.driver_id = req.currentUser.id;
        await model.save();
        drivers.driver_status = 2;
        await drivers.save();
        res.send({
          success: true,
          message: "Zakaz qabul qilindi",
          data: model,
        });
        await WaitingOrder.destroy({
          where: { driver_id: req.currentUser.id, order_id: model.id },
        });
        await EmptyDriver.destroy({ where: { driver_id: req.currentUser.id } });
      } else {
        const ord = await WaitingOrder.findOne({
          where: {
            driver_id: req.currentUser.id,
            type: 2,
          },
        });
        if (ord) {
          await EmptyDriver.destroy({
            where: { driver_id: req.currentUser.id },
          });
          res.send({
            success: false,
            message: "Sizda yetarlicha buyurtmalar mavjud",
            data: {},
          });
        } else {
          model.status_id = 2;
          model.driver_id = req.currentUser.id;
          await model.save();
          await WaitingOrder.create({
            order_id: id,
            driver_id: req.currentUser.id,
            type: 2,
          });
          await EmptyDriver.destroy({
            where: { driver_id: req.currentUser.id },
          });
          res.send({
            success: true,
            message: "Buyurtma qabul qilindi",
            data: model,
          });
        }
      }
    } else {
      res.send({
        success: false,
        message: "Kech qoldingiz",
        data: {},
      });
    }
    if (model.client_id) {
      const sockets = await this.io.fetchSockets();
      for (const soc of sockets) {
        if (soc.dataUser.type == "Client") {
          if (soc.dataUser.userId == model.client_id) {
            return this.io.to(soc.id).emit("order_update");
          }
        }
      }
    } else {
      console.log("No client");
    }
  };

  // get my order

  GetMyOrder = async (req, res) => {
    const id = req.query.order_id;
    const model = await Order.findOne({
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
          include: { model: DriverStatus, as: "status_driver", attributes: [] },
        },
        { model: Rate, as: "rate" },
      ],
      where: {
        id,
      },
    });
    if (model) {
      if (model.dataValues.whence) {
        let arr = model.dataValues.whence.split(",");
        model.dataValues.whence_lat = arr[0];
        model.dataValues.whence_long = arr[1];
      }
      if (model.dataValues.whereto) {
        let arr = model.dataValues.whence.split(",");
        model.dataValues.whereto_lat = arr[0];
        model.dataValues.whereto_long = arr[1];
      }
      res.send({
        success: true,
        message: "Order information",
        data: model,
      });
    } else {
      res.send({
        success: true,
        message: "Order not found",
        data: {},
      });
    }
  };

  // arrival-order

  arrivalOrder = async (req, res) => {
    const id = req.query.order_id;
    const drivers = await Driver.findOne({
      where: {
        id: req.currentUser.id,
      },
    });
    await WaitingOrder.destroy({
      where: { driver_id: req.currentUser.id, order_id: id, type: 2 },
    });
    drivers.driver_status = 3;
    await drivers.save();
    const mdl = await Order.findOne({
      where: {
        id,
      },
    });
    mdl.status_id = 7;
    await mdl.save();
    const model = await Order.findOne({
      attributes: [
        "id",
        "phone_number",
        "whence",
        "whereto",
        "rate_id",
        "status_id",
        "client_id",
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
          include: { model: DriverStatus, as: "status_driver", attributes: [] },
        },
        { model: Rate, as: "rate" },
      ],
      where: {
        id,
      },
    });
    if (model) {
      const sockets = await this.io.fetchSockets();
      for (const soc of sockets) {
        console.log("dscadasdasd 1");
        if (soc.dataUser.type == "Client") {
          console.log("dsadasdasd 2");
          if (soc.dataUser.userId == model.client_id) {
            console.log("dsadasdasd 3");
            this.io.to(soc.id).emit("order_update");
            break;
          }
        }
      }
      if (model.dataValues.whence) {
        let arr = model.dataValues.whence.split(",");
        model.dataValues.whence_lat = arr[0];
        model.dataValues.whence_long = arr[1];
      }
      if (model.dataValues.whereto) {
        let arr = model.dataValues.whence.split(",");
        model.dataValues.whereto_lat = arr[0];
        model.dataValues.whereto_long = arr[1];
      }
      res.send({
        success: true,
        message: "Order information",
        data: model,
      });
    } else {
      res.send({
        success: true,
        message: "Order not found",
        data: {},
      });
    }
  };

  // start order
  startOrder = async (req, res) => {
    const driverss = await Driver.findOne({
      where: {
        id: req.currentUser.id,
      },
    });
    driverss.driver_status = 4;
    await driverss.save();
    // res.send(driverss)
    const id = req.query.order_id;
    const mdl = await Order.findOne({
      where: {
        id,
      },
    });
    mdl.status_id = 3;
    await mdl.save();
    const model = await Order.findOne({
      attributes: [
        "id",
        "phone_number",
        "whence",
        "whereto",
        "rate_id",
        "status_id",
        "client_id",
        "driver_id",
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
          include: { model: DriverStatus, as: "status_driver", attributes: [] },
        },
        { model: Rate, as: "rate" },
      ],
      where: {
        id,
      },
    });
    if (model) {
      const sockets = await this.io.fetchSockets();
      for (const soc of sockets) {
        if (soc.dataUser.type == "Client") {
          if (soc.dataUser.userId == model.client_id) {
            this.io.to(soc.id).emit("order_update");
            break;
          }
        }
      }
      if (model.dataValues.whence) {
        let arr = model.dataValues.whence.split(",");
        model.dataValues.whence_lat = arr[0];
        model.dataValues.whence_long = arr[1];
      }
      if (model.dataValues.whereto) {
        let arr = model.dataValues.whence.split(",");
        model.dataValues.whereto_lat = arr[0];
        model.dataValues.whereto_long = arr[1];
      }
      res.send({
        success: true,
        message: "Order information",
        data: model,
      });
    } else {
      res.send({
        success: true,
        message: "Order not found",
        data: {},
      });
    }
  };

  // complete the order

  completeOrder = async (req, res) => {
    const { id, summa, km_out_city, km, wait_time, lat, long } = req.body;
    await WaitingOrder.destroy({
      where: { driver_id: req.currentUser.id, order_id: id },
    });
    let firma_summa = 0,
      agent_summa = 0;
    const orders = await Order.findOne({
      where: { id },
    });
    const rates = await Rate.findOne({
      id: orders.rate_id,
    });
    const drivers = await Driver.findOne({
      where: {
        id: req.currentUser.id,
      },
    });
    // driver summa
    // if (Math.floor(rates.profit) != 0) {
    //   firma_summa = ((summa / 100) * rates.profit).toFixed(2);
    //   drivers.summa -= firma_summa;
    // }
    // if (drivers.menejer_id) {
    //   const agent = await Agent.findOne({
    //     where: {
    //       id: drivers.menejer_id,
    //     },
    //   });
    //   agent_summa = ((firma_summa / 100) * agent.percentage).toFixed(2);
    //   firma_summa -= agent_summa;
    //   await AgentRegister.create({
    //     datetime: Math.floor(new Date().getTime() / 1000),
    //     agent_id: drivers.menejer_id,
    //     summa: agent_summa,
    //     type: 1,
    //   });
    // }
    const wait_order = await WaitingOrder.findOne({
      where: {
        driver_id: req.currentUser.id,
        type: 2,
      },
    });
    if (wait_order) {
      drivers.driver_status = 2;
    } else {
      drivers.driver_status = 1;
    }
    drivers.free_time = Math.floor(new Date().getTime() / 1000);
    await drivers.save();

    orders.closing_date = Math.floor(new Date().getTime() / 1000);
    orders.status_id = 4;

    const order_completed = await CompletedOrder.create({
      order_id: id,
      summa,
      km_out_city,
      km,
      wait_time,
      datetime: Math.floor(new Date().getTime() / 1000),
      firma_summa,
      agent_summa,
      driver_id: req.currentUser.id,
    });
    orders.dataValues.info = order_completed;
    orders.dataValues.driver = drivers;
    if (orders.dataValues.whence) {
      let arr = orders.dataValues.whence.split(",");
      orders.dataValues.whence_lat = arr[0];
      orders.dataValues.whence_long = arr[1];
    }
    if (orders.dataValues.whereto) {
      let arr = orders.dataValues.whence.split(",");
      orders.dataValues.whereto_lat = arr[0];
      orders.dataValues.whereto_long = arr[1];
    }
    await EmptyDriver.destroy({ where: { driver_id: req.currentUser.id } });
    const sockets = await this.io.fetchSockets();
    for (const soc of sockets) {
      if (soc.dataUser.type == "Client") {
        if (soc.dataUser.userId == orders.client_id) {
          this.io.to(soc.id).emit("order_update");
          break;
        }
      }
    }
    const driver = await WaitingOrder.findOne({
      where: { driver_id: req.currentUser.id, order_id: id },
    });

    if (driver) {
      // for (const soc of sockets) {
      //   if (soc.dataUser.userId == "Driver") {
      //     if (soc.dataUser.userId == req.currentUser.id) {
      //       this.io.to(soc.id).emit("next-order", driver.order_id);
      //     }
      //   }
      // }
      // await WaitingOrder.destroy({ where: { driver_id: req.currentUser.id } });
    } else {
      await EmptyDriver.create({
        driver_id: req.currentUser.id,
        lat,
        long,
        datetime: Math.floor(new Date().getTime() / 1000),
        closing_date: Math.floor(new Date().getTime() / 1000),
      });
    }
    await orders.save();
    res.send({
      success: true,
      message: "Order completed successfully",
      data: orders,
    });
  };
  /// empty driver

  emptyDriver = async (req, res) => {
    const order = await WaitingOrder.findOne({
      where: {
        driver_id: req.currentUser.id,
        type: 2,
      },
    });
    console.log(order);
    if (order) {
      return res.send({
        success: false,
        message: "Sizda buyurtmalar yetarli",
        data: {},
      });
    } else {
      const model = await EmptyDriver.create({
        driver_id: req.currentUser.id,
        lat: req.body.lat.toString(),
        long: req.body.long.toString(),
        datetime: Math.floor(new Date().getTime() / 1000),
        closing_date: Math.floor(new Date().getTime() / 1000),
      });
      return res.send({
        success: true,
        message: "Driver activated successfully",
        data: model,
      });
    }
  };

  // Driver information

  info = async (req, res) => {
    const driver = await Driver.findOne({
      where: {
        id: req.currentUser.id,
      },
    });
    const model = await DriverInfo.findOne({
      where: {
        driver_id: req.currentUser.id,
      },
    });
    if (!model) {
      driver.dataValues.info = null;
      return res.send({
        success: true,
        message: "Driver information not found",
        data: driver,
      });
    }
    driver.dataValues.info = model;
    res.send({
      success: true,
      message: "Driver information",
      data: driver,
    });
  };

  // driver active in admin

  active_admin = async (req, res) => {
    let user = req.body.user;
    let status = req.body.status;
    const model = await Driver.findOne({
      where: {
        id: req.params.id,
      },
    });
    model.fullname = user.fullname;
    model.number = user.number;
    model.car = user.car;
    model.day_price = user.day_price;
    await RateDriver.destroy({ where: { driver_id: req.params.id } });
    for (let i = 0; i < status.length; i++) {
      if (status[i].checked) {
        await RateDriver.create({
          driver_id: req.params.id,
          rate_id: status[i].id,
        });
      }
    }
    if (model.active_admin == 0) {
      model.active_admin = 1;
      model.save();
      return res.send({
        success: true,
        message: "Haydovchi faol holatda",
        data: model,
      });
    } else {
      model.active_admin = 0;
      model.save();
      return res.send({
        success: true,
        message: "Haydovchi faolsizlantirildi",
        data: model,
      });
    }
  };
  // waitng order
  get_my_waiting_order = async (req, res) => {
    const model = await WaitingOrder.findOne({
      where: {
        driver_id: req.currentUser.id,
        type: 1,
      },
    });
    if (model) {
      // const sendDriver = await Order.findOne({
      //   attributes: [
      //     "id",
      //     "created_date",
      //     "phone_number",
      //     "whence",
      //     "whereto",
      //     "status_id",
      //     "driver_id",
      //     [sequelize.literal("status.name"), "status_name"],
      //     "rate_id",
      //     [sequelize.literal("rate.name"), "rate_name"],
      //   ],
      //   include: [
      //     { model: OrderStatus, as: "status", attributes: [] },
      //     { model: Rate, as: "rate", attributes: [] },
      //   ],
      //   where: {
      //     id: model.order_id,
      //   },
      // });
      const sendDriver = await Order.findOne({
        attributes: [
          "id",
          "phone_number",
          "whence",
          "whereto",
          "created_date",
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
          id: model.order_id,
        },
      });
      sendDriver.dataValues.created_date = new Date(
        sendDriver.dataValues.created_date * 1000
      ).toDateString();
      sendDriver.dataValues.next_order = 1;
      res.send({
        success: true,
        message: "Waiting order",
        data: sendDriver,
      });
    } else {
      const models = await WaitingOrder.findOne({
        where: {
          driver_id: req.currentUser.id,
          type: 2,
        },
      });
      if (models) {
        const sendDriver = await Order.findOne({
          attributes: [
            "id",
            "phone_number",
            "whence",
            "whereto",
            "created_date",
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
            id: models.order_id,
          },
        });
        sendDriver.dataValues.created_date = new Date(
          sendDriver.dataValues.created_date * 1000
        ).toDateString();
        sendDriver.dataValues.next_order = 2;
        return res.send({
          success: true,
          message: "Waiting order",
          data: sendDriver,
        });
      } else {
        return res.send({
          success: true,
          message: "Waiting order not found",
          data: {},
        });
      }
    }
  };

  summa_add = async (req, res) => {
    const summa = req.query.summa;
    const id = req.query.id;
    const model = await Driver.findOne({
      where: { id: id },
    });
    model.summa = parseFloat(model.summa) + parseFloat(summa);
    await model.save();
    res.send({
      success: true,
      message: "Summa added successfully",
      data: model,
    });
  };

  #NoticationsSend = async (token, model) => {
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
  start_session = async (req, res) => {
    const model = await Driver.findOne({
      where: {
        id: req.currentUser.id,
      },
    });
    if (parseFloat(model.summa) < parseFloat(model.day_price)) {
      return res.send({
        success: false,
        message: "Hisobingizda mablag' yetarli emas",
        data: {},
      });
    }
    const price = await DayPriceDriver.findOne({
      where: {
        driver_id: req.currentUser.id,
      },
      order: [["datetime", "DESC"]],
    });
    if (price) {
      if (Math.floor(new Date().getTime() / 1000) - parseInt(price.datetime) > 86400) {
        model.summa = parseFloat(model.summa) - parseFloat(model.day_price);
      } else {
        return res.send({
          success: false,
          message: "Sizning ish vaqtingiz hali mavjud",
          data: {},
        });
      }
    } else {
      model.summa = parseFloat(model.summa) - parseFloat(model.day_price);
    }
    // await model.save();
    await DayPriceDriver.create({
      datetime: Math.floor(new Date().getTime() / 1000),
      driver_id: req.currentUser.id,
      summa: parseFloat(model.day_price),
    });
    res.send({
      success: true,
      message: "24 soatgacha ish vaqtingiz uzaytirildi",
      data: model,
    });
  };
}

module.exports = new UserController();
