var DataTypes = require("sequelize").DataTypes;
var sequelize = require("../db/db-sequelize");
var _Agent = require("./agent");
var _AgentRegister = require("./agent_register");
var _CancelOrderDriver = require("./cancel_order_driver");
var _Client = require("./client");
var _CompletedOrder = require("./completed_order");
var _CustomLocation = require("./custom_location");
var _DayPriceDriver = require("./day_price_driver");
var _Driver = require("./driver");
var _DriverInfo = require("./driver_info");
var _DriverRating = require("./driver_rating");
var _DriverStatus = require("./driver_status");
var _EmptyDriver = require("./empty_driver");
var _Order = require("./order");
var _OrderStatus = require("./order_status");
var _Rate = require("./rate");
var _RateDriver = require("./rate_driver");
var _SendOrderDriver = require("./send_order_driver");
var _Sequelizemeta = require("./sequelizemeta");
var _User = require("./user");
var _WaitingOrder = require("./waiting_order");

var Agent = _Agent(sequelize, DataTypes);
var AgentRegister = _AgentRegister(sequelize, DataTypes);
var CancelOrderDriver = _CancelOrderDriver(sequelize, DataTypes);
var Client = _Client(sequelize, DataTypes);
var CompletedOrder = _CompletedOrder(sequelize, DataTypes);
var CustomLocation = _CustomLocation(sequelize, DataTypes);
var DayPriceDriver = _DayPriceDriver(sequelize, DataTypes);
var Driver = _Driver(sequelize, DataTypes);
var DriverInfo = _DriverInfo(sequelize, DataTypes);
var DriverRating = _DriverRating(sequelize, DataTypes);
var DriverStatus = _DriverStatus(sequelize, DataTypes);
var EmptyDriver = _EmptyDriver(sequelize, DataTypes);
var Order = _Order(sequelize, DataTypes);
var OrderStatus = _OrderStatus(sequelize, DataTypes);
var Rate = _Rate(sequelize, DataTypes);
var RateDriver = _RateDriver(sequelize, DataTypes);
var SendOrderDriver = _SendOrderDriver(sequelize, DataTypes);
var Sequelizemeta = _Sequelizemeta(sequelize, DataTypes);
var User = _User(sequelize, DataTypes);
var WaitingOrder = _WaitingOrder(sequelize, DataTypes);

AgentRegister.belongsTo(Agent, { as: "agent", foreignKey: "agent_id" });
Agent.hasMany(AgentRegister, { as: "agent_registers", foreignKey: "agent_id" });
Driver.belongsTo(Agent, { as: "menejer", foreignKey: "menejer_id" });
Agent.hasMany(Driver, { as: "drivers", foreignKey: "menejer_id" });
Order.belongsTo(Client, { as: "client", foreignKey: "client_id" });
Client.hasMany(Order, { as: "orders", foreignKey: "client_id" });
CancelOrderDriver.belongsTo(Driver, { as: "driver", foreignKey: "driver_id" });
Driver.hasMany(CancelOrderDriver, {
  as: "cancel_order_drivers",
  foreignKey: "driver_id",
});
CompletedOrder.belongsTo(Driver, { as: "driver", foreignKey: "driver_id" });
Driver.hasMany(CompletedOrder, {
  as: "completed_orders",
  foreignKey: "driver_id",
});
DayPriceDriver.belongsTo(Driver, { as: "driver", foreignKey: "driver_id" });
Driver.hasMany(DayPriceDriver, {
  as: "day_price_drivers",
  foreignKey: "driver_id",
});
DriverInfo.belongsTo(Driver, { as: "driver", foreignKey: "driver_id" });
Driver.hasMany(DriverInfo, { as: "driver_infos", foreignKey: "driver_id" });
DriverRating.belongsTo(Driver, { as: "driver", foreignKey: "driver_id" });
Driver.hasMany(DriverRating, { as: "driver_ratings", foreignKey: "driver_id" });
EmptyDriver.belongsTo(Driver, { as: "driver", foreignKey: "driver_id" });
Driver.hasMany(EmptyDriver, { as: "empty_drivers", foreignKey: "driver_id" });
Order.belongsTo(Driver, { as: "driver", foreignKey: "driver_id" });
Driver.hasMany(Order, { as: "orders", foreignKey: "driver_id" });
RateDriver.belongsTo(Driver, { as: "driver", foreignKey: "driver_id" });
Driver.hasMany(RateDriver, { as: "rate_drivers", foreignKey: "driver_id" });
SendOrderDriver.belongsTo(Driver, { as: "driver", foreignKey: "driver_id" });
Driver.hasMany(SendOrderDriver, {
  as: "send_order_drivers",
  foreignKey: "driver_id",
});
WaitingOrder.belongsTo(Driver, { as: "driver", foreignKey: "driver_id" });
Driver.hasMany(WaitingOrder, { as: "waiting_orders", foreignKey: "driver_id" });
Driver.belongsTo(DriverStatus, {
  as: "status_driver",
  foreignKey: "driver_status",
});
DriverStatus.hasMany(Driver, { as: "drivers", foreignKey: "driver_status" });
CancelOrderDriver.belongsTo(Order, { as: "order", foreignKey: "order_id" });
Order.hasMany(CancelOrderDriver, {
  as: "cancel_order_drivers",
  foreignKey: "order_id",
});
CompletedOrder.belongsTo(Order, { as: "order", foreignKey: "order_id" });
Order.hasMany(CompletedOrder, {
  as: "completed_orders",
  foreignKey: "order_id",
});
DriverRating.belongsTo(Order, { as: "order", foreignKey: "order_id" });
Order.hasMany(DriverRating, { as: "driver_ratings", foreignKey: "order_id" });
SendOrderDriver.belongsTo(Order, { as: "order", foreignKey: "order_id" });
Order.hasMany(SendOrderDriver, {
  as: "send_order_drivers",
  foreignKey: "order_id",
});
WaitingOrder.belongsTo(Order, { as: "order", foreignKey: "order_id" });
Order.hasMany(WaitingOrder, { as: "waiting_orders", foreignKey: "order_id" });
Order.belongsTo(OrderStatus, { as: "status", foreignKey: "status_id" });
OrderStatus.hasMany(Order, { as: "orders", foreignKey: "status_id" });
Order.belongsTo(Rate, { as: "rate", foreignKey: "rate_id" });
Rate.hasMany(Order, { as: "orders", foreignKey: "rate_id" });
RateDriver.belongsTo(Rate, { as: "rate", foreignKey: "rate_id" });
Rate.hasMany(RateDriver, { as: "rate_drivers", foreignKey: "rate_id" });
Order.belongsTo(User, { as: "user", foreignKey: "user_id" });
User.hasMany(Order, { as: "orders", foreignKey: "user_id" });

module.exports = {
  Agent,
  AgentRegister,
  CancelOrderDriver,
  Client,
  CompletedOrder,
  CustomLocation,
  DayPriceDriver,
  Driver,
  DriverInfo,
  DriverRating,
  DriverStatus,
  EmptyDriver,
  Order,
  OrderStatus,
  Rate,
  RateDriver,
  SendOrderDriver,
  Sequelizemeta,
  User,
  WaitingOrder,
};
