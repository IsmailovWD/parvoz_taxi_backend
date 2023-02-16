const {
  CompletedOrder,
  Driver,
  DriverRating,
} = require("../models/init-models");
const HttpException = require("../utils/HttpException.utils");
const jwt = require("jsonwebtoken");
const { secret_jwt } = require("../startup/config");
const BaseController = require("./BaseController");
const sequelize = require("sequelize");
var FCM = require("fcm-node");
var serverKey =
  "AAAAp-XDSiA:APA91bFg1rDmkOSKqRG3tkq2m52aBBp8A7DkVNC0eG6lYu91wqq-_PtAxxzTsJPqViDoJJCvufP1EsFONY2NuIVVCcza-s3ENCjp2dEIVDJpQB0PPMDuWPtLzQrkTBQvUMq59uFUy9pR";
var fcm = new FCM(serverKey);
class ReportController extends BaseController {
  driver_rating = async (req, res) => {
    const model = await Driver.findAll({
      attributes: ["id", "fullname", "number"],
      include: [
        {
          model: DriverRating,
          as: "driver_ratings",
          attributes: [
            "id",
            "driver_id",
            [sequelize.fn("AVG", sequelize.col("rating")), "driver_rating"],
          ],
        },
      ],
      group: ["id"],
    });
    res.send({
      success: true,
      message: "Rating driver",
      data: model,
    });
  };
}
module.exports = new ReportController();
