const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "EmptyDriver",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      driver_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "driver",
          key: "id",
        },
      },
      lat: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      long: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      datetime: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      closing_date: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "empty_driver",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
        {
          name: "driver_id",
          using: "BTREE",
          fields: [{ name: "driver_id" }],
        },
      ],
    }
  );
};
