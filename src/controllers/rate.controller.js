const { Rate } = require("../models/init-models");
const HttpException = require("../utils/HttpException.utils");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { secret_jwt } = require("../startup/config");
const BaseController = require("./BaseController");
const { MyUser, MainUser } = require("../utils/userRoles.utils");
const { Op } = require("sequelize");
const moment = require("moment");

/******************************************************************************
 *                              User Controller
 ******************************************************************************/
class UserController extends BaseController {
  all = async (req, res, send) => {
    const model = await Rate.findAll({
      order: [["min_summa", "ASC"]],
    });
    for (let i = 0; i < model.length; i++) {
      model[i].dataValues.summa = model[i].dataValues.min_summa;
    }
    res.send({
      success: true,
      message: "All User",
      data: model,
    });
  };
  create = async (req, res, send) => {
    this.checkValidation(req);
    const {
      name,
      min_summa,
      wait_price,
      free_wait_time,
      out_price,
      profit,
      city_price,
    } = req.body;
    const model = await Rate.create({
      name,
      min_summa,
      min_km: 0,
      wait_price,
      free_wait_time,
      out_price,
      profit,
      city_price,
    });

    res.send({
      success: true,
      message: "Rate created",
      data: model,
    });
  };
  update = async (req, res, send) => {
    this.checkValidation(req);
    const {
      name,
      min_summa,
      wait_price,
      free_wait_time,
      out_price,
      profit,
      city_price,
    } = req.body;
    const model = await Rate.findOne({
      where: {
        id: req.params.id,
      },
    });
    model.name = name;
    model.min_summa = min_summa;
    model.wait_price = wait_price;
    model.free_wait_time = free_wait_time;
    model.out_price = out_price;
    model.profit = profit;
    model.city_price = city_price;
    await model.save();
    res.send({
      success: true,
      message: "Rate created",
      data: model,
    });
  };
  one = async (req, res) => {
    const model = await Rate.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.send({ success: true, message: "One Rate", data: model });
  };
}

module.exports = new UserController();
