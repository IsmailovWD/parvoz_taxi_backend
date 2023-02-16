const { Client } = require("../models/init-models");
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
  getUser = async (req, res, send) => {
    const model = await Client.findOne({
      attributes: ["id", "name", "number"],
      where: {
        id: req.currentUser.id,
      },
    });
    if (!model.name) {
      model.name = "";
    }
    if (!model.number) {
      model.number = "";
    }
    res.send({
      success: true,
      message: "Client information",
      data: model,
    });
  };

  one = async (req, res, send) => {
    const model = await Client.findOne({
      where: {
        id: req.params.id,
      },
    });

    res.send({
      success: true,
      message: "One Activity",
      data: model,
    });
  };

  singn = async (req, res, send) => {
    let { number, sms_code } = req.body;
    let success = true;
    let message = "";
    let data = null;

    let demo = 123456;
    if (demo != sms_code) {
      success = false;
      message = "SMS kod noto‘g‘ri";
      data = {};
    }
    const user = await Client.findOne({
      where: {
        number,
      },
    });
    if (!user) {
      success = false;
      message = "Foydalanuvchi topilmadi";
      data = {};
    }
    const token = jwt.sign({ user_id: user.id.toString() }, secret_jwt, {});
    if (!user.password) {
      user.password = "";
    }
    if (!user.name) {
      user.name = "";
    }
    user.token = token;
    res.send({
      success: success,
      message: message,
      data: data || user,
    });
  };

  update = async (req, res, next) => {
    let success = true;
    let message = "";
    let data = null;
    const model = await Client.findOne({
      where: {
        id: req.currentUser.id,
      },
    });
    if (!model) {
      success = false;
      message = "Tizimda siz haqingizdagi ma'lumotlar topilmadi";
      data = {};
    }
    if (req.body.name) {
      model.name = req.body.name;
    }
    if (req.body.number != "") {
      const numb = await Client.findOne({
        where: {
          number: req.body.number,
        },
      });
      if (numb) {
        success = false;
        message = "Ushbu telefon raqam tizimda mavjud";
        data = {};
      } else {
        model.number = req.body.number;
      }
    }
    model.save();
    if (!model.password) {
      model.password = "";
    }
    if (!model.name) {
      model.name = "";
    }
    if (!model.number) {
      model.number = "";
    }
    res.send({
      success: success,
      message: message,
      data: model,
    });
  };

  // delete = async (req, res, next) => {
  //   await Activity.destroy({
  //     where: {
  //       id: req.params.id,
  //     }
  //   })

  //   res.send({
  //     success: true,
  //     message: "Delete Activity",
  //     data: null
  //   })
  // }

  login = async (req, res, next) => {
    this.checkValidation(req);
    const { number } = req.body;
    let title;
    const user = await Client.findOne({
      where: {
        number,
      },
    });
    if (!user) {
      await Client.create({
        number,
      });
      title = "User created";
    } else {
      title = "User login";
    }

    // const isMatch = await bcrypt.compare(pasword, user.password);
    // console.log(pasword, user.password)
    // if (!isMatch) {
    //   throw new HttpException(401, "Login or password is incorrect!");
    // }

    // user matched!
    // const token = jwt.sign({ user_id: user.id.toString() }, secret_jwt, {
    //   expiresIn: "24h",
    // });
    // user.token = token;
    res.send({
      success: true,
      message: title,
      data: user,
    });
  };
}

module.exports = new UserController();
