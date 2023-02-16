const express = require("express");
const app = express();
require("./startup/logging")();
require("./startup/db")();
const { port } = require("./startup/config");
require("./startup/routes")(app);
require("./startup/migration")();
require("./startup/cron")();
const jwt = require("jsonwebtoken");
const { secret_jwt } = require("./startup/config");
const { User, Client, Driver } = require("./models/init-models");
const server = app
  .listen(port, () => console.log(`🚀 Server running on port ${port}!`))
  .on("error", (e) => {
    console.log("Error happened: ", e.message);
  });

const io = require("socket.io")(server, {
  allowEIO3: true,
  cors: {
    origin: true,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.use(async (socket, next) => {
  var obj = {};
  try {
    if (socket.handshake.query.token_user) {
      const token_user = socket.handshake.query.token_user;
      const payload = jwt.verify(token_user, secret_jwt);
      const model = await User.findOne({ where: { id: payload.user_id } });
      obj.userId = model.id;
      obj.type = "User";
      obj.userName = model.firstname;
    }

    if (socket.handshake.query.client_token) {
      const token_client = socket.handshake.query.client_token;
      const payload = jwt.verify(token_client, secret_jwt);
      const model = await Client.findOne({ where: { id: payload.user_id } });
      obj.userId = model.id;
      obj.type = "Client";
      obj.userName = model.number;
    }

    if (socket.handshake.query.driver_token) {
      const driver_client = socket.handshake.query.driver_token;
      const payload = jwt.verify(driver_client, secret_jwt);
      const model = await Driver.findOne({ where: { id: payload.user_id } });
      obj.userId = model.dataValues.id;
      obj.type = "Driver";
      obj.userName = model.dataValues.number;
    }
    socket.dataUser = obj;
    next();
  } catch (err) {
    console.log(err);
  }
});

const orderController = require("./controllers/order.controller");
const driverController = require("./controllers/Driver.controller");
const onConnection = (socket) => {
  console.log(
    "Connected: " +
      socket.dataUser.userId +
      " " +
      socket.dataUser.userName +
      " " +
      socket.dataUser.type +
      " " +
      new Date().getHours() +
      ":" +
      new Date().getMinutes()
  );
  orderController.socketConnect(io, socket);
  driverController.socketConnect(io, socket);
  socket.on("disconnect", () => {
    console.log(
      "Disconnected: " +
        socket.dataUser.userId +
        " " +
        socket.dataUser.userName +
        " " +
        new Date().getHours() +
        ":" +
        new Date().getMinutes()
    );
  });
};

io.on("connection", onConnection);

module.exports = app;
