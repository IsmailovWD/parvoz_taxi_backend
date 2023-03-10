const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "Driver",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      fullname: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      number: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      deleted_at: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      password: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      car: {
        type: DataTypes.STRING(250),
        allowNull: true,
      },
      driver_status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "driver_status",
          key: "id",
        },
      },
      created_date: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      active: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fcm_token: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      active_admin: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      menejer_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "agent",
          key: "id",
        },
      },
      summa: {
        type: DataTypes.DOUBLE(11, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      day_price: {
        type: DataTypes.DOUBLE(11, 2),
        allowNull: false,
      },
      token: {
        type: DataTypes.VIRTUAL,
      },
    },
    {
      sequelize,
      tableName: "driver",
      timestamps: false,
      paranoid: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
        {
          name: "driver_status",
          using: "BTREE",
          fields: [{ name: "driver_status" }],
        },
        {
          name: "driver_ibfk_3",
          using: "BTREE",
          fields: [{ name: "rate_id" }],
        },
        {
          name: "driver_ibfk_2",
          using: "BTREE",
          fields: [{ name: "menejer_id" }],
        },
      ],
    }
  );
};
