const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "Agent",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      fullname: {
        type: DataTypes.STRING(250),
        allowNull: false,
      },
      phone_number: {
        type: DataTypes.STRING(250),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(250),
        allowNull: false,
      },
      summa: {
        type: DataTypes.DOUBLE(11, 2),
        allowNull: false,
      },
      percentage: {
        type: DataTypes.DOUBLE(11, 2),
        allowNull: false,
      },
      deleted_at: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      token: {
        type: DataTypes.VIRTUAL,
      },
    },
    {
      sequelize,
      tableName: "agent",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
      ],
    }
  );
};
