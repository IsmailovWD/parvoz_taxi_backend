const { validationResult } = require("express-validator");
const HttpException = require("../utils/HttpException.utils");

class BaseController {
  // io;
  // socket;
  checkValidation = (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new HttpException(400, req.mf("Validation faild"), errors);
    }
  };
  // socketConnect = (io, socket) => {
  //     this.io = io;
  //     this.socket = socket;
  // }
}

module.exports = BaseController;
