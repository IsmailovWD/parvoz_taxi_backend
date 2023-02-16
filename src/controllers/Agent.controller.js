const { User, Agent } = require("../models/init-models");
const HttpException = require("../utils/HttpException.utils");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { secret_jwt } = require("../startup/config");
const BaseController = require("./BaseController");

/******************************************************************************
 *                              User Controller
 ******************************************************************************/
class AgentController extends BaseController {
  all = async (req, res, send) => {
    const model = await Agent.findAll({});
    res.send({
      success: true,
      message: "All User",
      data: model,
    });
  };

  one = async (req, res, send) => {
    const model = await User.findOne({
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

  create = async (req, res, send) => {
    let { firstname, lastname, number, password, role } = req.body;
    const numbers = await User.findOne({
      where: {
        number,
      },
    });
    if (!numbers) {
      throw new HttpException(404, "User already exists");
    }
    const model = await User.create({
      firstname,
      lastname,
      number,
      password: await bcrypt.hash(password, 8),
      role,
    });

    res.send({
      success: true,
      message: "Create Activity",
      data: model,
    });
  };

  update = async (req, res, next) => {
    let { name } = req.body;

    const model = await Activity.findOne({
      where: {
        id: req.params.id,
      },
    });

    model.name = name;
    model.save();

    res.send({
      success: true,
      message: "Update Activity",
      data: model,
    });
  };

  delete = async (req, res, next) => {
    let message = "";
    const model = await User.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (model.deleted_at == 0) {
      model.deleted_at = 1;
      message = "Foydalanuvchi o'chirildi";
    } else if (model.deleted_at == 1) {
      model.deleted_at = 0;
      message = "Foydalanuvchi faol holatda";
    }
    model.save();
    res.send({
      success: true,
      message: message,
      data: model,
    });
  };

  login = async (req, res, next) => {
    this.checkValidation(req);
    const { phone, pasword } = req.body;

    const user = await User.findOne({
      where: {
        phone_number: phone,
      },
    });
    if (!user) {
      throw new HttpException(401, "Login or password is incorrect!");
    }

    const isMatch = await bcrypt.compare(pasword, user.password);

    if (!isMatch) {
      throw new HttpException(401, "Login or password is incorrect!");
    }

    // user matched!
    const token = jwt.sign({ user_id: user.id.toString() }, secret_jwt, {
      expiresIn: "24h",
    });

    user.token = token;
    res.send({
      success: true,
      message: "User info",
      data: user,
    });
  };
}

module.exports = new AgentController();
