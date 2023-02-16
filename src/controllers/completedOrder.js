const { CompletedOrder, Driver } = require("../models/init-models");
const HttpException = require("../utils/HttpException.utils");
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
class OrderController extends BaseController {
  all = async (req, res) => {
    this.checkValidation(req);
    let query = {};
    if (req.query.number) {
      query = {
        [sequelize.Op.or]: [
          {
            number: {
              [sequelize.Op.substring]: req.query.number,
            },
          },
          {
            fullname: {
              [sequelize.Op.substring]: req.query.number,
            },
          },
        ],
      };
    }
    const model = await CompletedOrder.findAll({
      include: [{ model: Driver, as: "driver", where: query }],
      order: [["datetime", "DESC"]],
      offset: parseInt(req.query.offset),
      limit: 100,
      subQuery: true,
    });
    const count = await CompletedOrder.findOne({
      attributes: [[sequelize.fn("COUNT", sequelize.col("driver_id")), "soni"]],
      include: [{ model: Driver, as: "driver", where: query }],
    });
    res.send({
      success: true,
      message: "Completed Order",
      data: model,
      count,
    });
  };
}

module.exports = new OrderController();
