const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const i18n = require("./i18n.config");
const errorMiddleware = require("../middleware/error.middleware");
const userRoute = require("../routes/user.route");
const rateRoute = require("../routes/rate.route");
const orders = require("../routes/order.route");
const client = require("../routes/client.route");
const driver = require("../routes/driver.route");
const imgRouter = require("../routes/img.route");
const custom_location = require("../routes/customLocation.route");
const reports = require("../routes/report.route");
const agent = require("../routes/Agent.route");

// const uploadFile = require('../routes/uploadFile.route');

const HttpException = require("../utils/HttpException.utils");

module.exports = async function (app) {
  // app.use(function (req, res, next) {
  //     var send = res.send;
  //     res.send = function (body) {
  //         let status = res.statusCode;
  //         if (req.get('mobile') && (typeof body == 'object')) {
  //             let success = true;
  //             let message = body.message;
  //             if (body.errors) {
  //                 message = message + ': ' + body.errors[0].msg;
  //             }
  //             if (body.data) {
  //                 body = body.data;
  //             }
  //             if (!(status == 200 || status == 201)) {
  //                 success = false;
  //                 body = {};
  //             } else if (body.error) {
  //                 success = false;
  //                 body = {};
  //             }
  //             if (!message) {
  //                 message = 'Info';
  //             }
  //             body = {
  //                 success,
  //                 // error_code: -1,
  //                 message,
  //                 data: body,
  //             };
  //             if (req.get('mobile') == 'analytics') {
  //                 body.success = !body.error;
  //                 if (error && status === 401) {
  //                     body.error_code = 405;
  //                 }
  //             }
  //             res.statusCode = 200;
  //         }
  //         send.call(this, body);
  //     };
  //     next();
  // });
  // parse requests of content-type: application/json
  // parses incoming requests with JSON payloads
  app.use(express.json());
  // enabling cors for all requests by using cors middleware
  app.use(cors());
  // Enable pre-flight
  app.options("*", cors());
  app.use(express.static(path.join(__dirname, "../../dist")));
  // i18n.setLocale('uz');
  app.use(cookieParser());
  app.use(i18n.init);
  // app.use('audio', express.static('upload'))
  app.use(`/api/user`, userRoute);
  app.use(`/api/rate`, rateRoute);
  app.use(`/api/order`, orders);
  app.use(`/api/client`, client);
  app.use(`/api/driver`, driver);
  app.use(`/api/driver/images`, imgRouter);
  app.use(`/api/custom_location`, custom_location);
  app.use(`/api/report`, reports);
  app.use(`/api/agent`, agent);

  // app.use(`/api/v1/upload`, uploadFile);
  app.use(`/api/images`, express.static("uploads"));
  app.use(`/api/image/icon`, express.static("image"));
  // 404 error
  app.all("*", (req, res, next) => {
    const err = new HttpException(404, req.mf("Endpoint not found"));
    next(err);
  });

  app.use(errorMiddleware);
};
