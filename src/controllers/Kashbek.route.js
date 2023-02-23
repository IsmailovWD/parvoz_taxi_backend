const { KeshBackRegister } = require("../models/init-models");
const BaseController = require("./BaseController");

/******************************************************************************
 *                              User Controller
 ******************************************************************************/
class UserController extends BaseController {
  all = async (req, res, send) => {
    const model = await KeshBackRegister.findAll({
      order: [["datetime", "DESC"]],
    });
    res.send({
      success: true,
      message: "All Keshbek",
      data: model,
    });
  };
  create = async (req, res, send) => {
    this.checkValidation(req);
    const {
      profit
    } = req.body;
    const model = await KeshBackRegister.create({
      profit,
      datetime: Math.floor(new Date().getTime() / 1000)
    });

    res.send({
      success: true,
      message: "Keshbek created",
      data: model,
    });
  };
}

module.exports = new UserController();
